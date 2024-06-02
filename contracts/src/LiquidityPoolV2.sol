// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./LiquidityPoolInterfaces.sol";

contract LiquidityPoolV2 is Initializable, ReentrancyGuardUpgradeable, LiquidityPoolModifiers, LiquidityPoolEvents {
    using Math for uint256;

    // Addresses of the tokens in the liquidity pool
    address public tokenA;
    address public tokenB;

    // Reserves of the tokens in the liquidity pool
    uint256 private reserveA;
    uint256 private reserveB;

    // Liquidity token balances and total supply
    mapping(address => uint256) private liquidityBalances;
    uint256 private totalLiquidity;

    // Platform fee (in basis points, e.g., 30 for 0.3%)
    uint256 public platformFee;

    // Minimum initial liquidity to prevent precision issues
    uint256 private constant MINIMUM_LIQUIDITY = 20;

    /**
     * @notice Initializer function (replaces constructor).
     * @param _tokenA Address of the first token.
     * @param _tokenB Address of the second token.
     * @param _accessManager Address of the access manager contract.
     * @param _platformFee Platform fee in basis points.
     */
    function initialize(
        address _tokenA,
        address _tokenB,
        address _accessManager,
        uint256 _platformFee
    ) public initializer {
        require(_tokenA != address(0), "LiquidityPool: invalid tokenA address");
        require(_tokenB != address(0), "LiquidityPool: invalid tokenB address");
        require(_accessManager != address(0), "LiquidityPool: invalid access manager address");
        require(_platformFee <= 10000, "LiquidityPool: fee must be less than or equal to 100%");
        require(_platformFee >= 10, "LiquidityPool: fee must be at least 0.1%");

        tokenA = _tokenA;
        tokenB = _tokenB;
        accessManager = AccessManagerUpgradeable(_accessManager);
        __ReentrancyGuard_init();

        platformFee = _platformFee;
    }

    /**
     * @notice Function to adjust token amounts based on their decimals for consistency.
        For example, if a token has 6 decimals, 1 token = 1 * 10^12 (1 followed by 12 zeros).
     * @param token Address of the token.
     * @param amount Amount to adjust.
     * @return Adjusted amount.
     */
    function adjustForDecimals(address token, uint256 amount) internal view returns (uint256) {
        uint8 decimals = ERC20Upgradeable(token).decimals();
        return amount * (10 ** (18 - decimals));
    }

    /**
     * @notice Function to add liquidity to the pool.
     * @param tokenAAmount Amount of tokenA to add.
     * @param tokenBAmount Amount of tokenB to add.
     */
    function addLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external onlyRole(1) nonReentrant {
        require(tokenAAmount > 0 && tokenBAmount > 0, "LiquidityPool: amounts must be greater than zero");

        // Adjust amounts for token decimals
        uint256 adjustedTokenAAmount = adjustForDecimals(tokenA, tokenAAmount);
        uint256 adjustedTokenBAmount = adjustForDecimals(tokenB, tokenBAmount);

        // Transfer tokens from sender to the contract
        ERC20Upgradeable(tokenA).transferFrom(msg.sender, address(this), tokenAAmount);
        ERC20Upgradeable(tokenB).transferFrom(msg.sender, address(this), tokenBAmount);

        // Calculate liquidity tokens to mint
        uint256 liquidity;
        if (totalLiquidity == 0) {
            // For the first liquidity provider, mint liquidity tokens 1:1 with the provided tokens
            liquidity = Math.sqrt(adjustedTokenAAmount * adjustedTokenBAmount) - MINIMUM_LIQUIDITY;
            require(liquidity > MINIMUM_LIQUIDITY, "LiquidityPool: insufficient initial liquidity");
        } else {
            // For subsequent liquidity providers, mint liquidity tokens proportionally
            uint256 amountA = (adjustedTokenAAmount * totalLiquidity) / reserveA;
            uint256 amountB = (adjustedTokenBAmount * totalLiquidity) / reserveB;
            liquidity = Math.min(amountA, amountB);
            require(liquidity > MINIMUM_LIQUIDITY, "LiquidityPool: insufficient liquidity minted");
        }
        require(liquidity > 0, "LiquidityPool: insufficient liquidity minted");

        // Update reserves and mint liquidity tokens
        _updateReserves();
        liquidityBalances[msg.sender] += liquidity;
        totalLiquidity += liquidity;

        emit LiquidityAdded(msg.sender, tokenAAmount, tokenBAmount);
    }

    /**
     * @notice Function to remove liquidity from the pool.
     * @param liquidityTokens Amount of liquidity tokens to remove.
     */
    function removeLiquidity(uint256 liquidityTokens) external onlyRole(1) nonReentrant {
        require(liquidityTokens > 0, "LiquidityPool: amount must be greater than zero");
        require(liquidityBalances[msg.sender] >= liquidityTokens, "LiquidityPool: insufficient liquidity balance");

        // Calculate amounts of tokens to return to the user
        uint256 tokenAAmount = (liquidityTokens * reserveA) / totalLiquidity;
        uint256 tokenBAmount = (liquidityTokens * reserveB) / totalLiquidity;

        require(tokenAAmount > 0 && tokenBAmount > 0, "LiquidityPool: insufficient token amounts");

        // Update reserves and burn liquidity tokens
        _updateReserves();
        liquidityBalances[msg.sender] -= liquidityTokens;
        totalLiquidity -= liquidityTokens;

        // Transfer tokens back to the user
        ERC20Upgradeable(tokenA).transfer(msg.sender, tokenAAmount);
        ERC20Upgradeable(tokenB).transfer(msg.sender, tokenBAmount);

        emit LiquidityRemoved(msg.sender, tokenAAmount, tokenBAmount);
    }

    /**
     * @notice Function to execute a swap.
     * @param tokenIn Address of the input token.
     * @param amountIn Amount of the input token.
     * @param minAmountOut Minimum amount of the output token.
     * @param recipient Address of the recipient.
     */
    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient
    ) external onlyRole(1) nonReentrant {
        require(amountIn > 0, "LiquidityPool: amount must be greater than zero");
        require(tokenIn == tokenA || tokenIn == tokenB, "LiquidityPool: invalid token address");

        address tokenOut = (tokenIn == tokenA) ? tokenB : tokenA;
        uint256 reserveIn = (tokenIn == tokenA) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == tokenA) ? reserveB : reserveA;

        // Adjust the input amount for token decimals
        uint256 adjustedAmountIn = adjustForDecimals(tokenIn, amountIn);

        // Transfer the input tokens from the user to the contract
        ERC20Upgradeable(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Calculate the output amount using the constant product formula, adjusted for the platform fee
        uint256 amountInWithFee = (adjustedAmountIn * (10000 - platformFee)) / 10000;
        uint256 numerator = reserveOut * amountInWithFee;
        uint256 denominator = reserveIn + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        require(amountOut >= minAmountOut, "LiquidityPool: insufficient output amount");

        // Transfer the output tokens to the recipient
        ERC20Upgradeable(tokenOut).transfer(recipient, amountOut);

        if (tokenIn == tokenA) {
            reserveA += adjustedAmountIn;
            reserveB -= amountOut;
        } else {
            reserveB += adjustedAmountIn;
            reserveA -= amountOut;
        }

        // Update reserves
        _updateReserves();

        emit SwapExecuted(msg.sender, tokenIn, amountIn, tokenOut, amountOut);
    }

    /**
     * @notice Function to get the current reserves of the pool.
     * @return Reserves of tokenA and tokenB.
     */
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    /**
     * @notice Function to get the price of a token amount in the other token.
     * @param tokenIn Address of the input token.
     * @param amountIn Amount of the input token.
     * @return Amount of the output token.
     */
    function getPrice(address tokenIn, uint256 amountIn) external view returns (uint256) {
        require(tokenIn == tokenA || tokenIn == tokenB, "LiquidityPool: invalid token address");

        uint256 reserveIn = (tokenIn == tokenA) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == tokenA) ? reserveB : reserveA;

        uint256 amountInWithFee = (amountIn * (10000 - platformFee)) / 10000;
        uint256 amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        return amountOut;
    }

    /**
     * @notice Function to update the platform fee.
     * @param newFee New platform fee in basis points.
     */
    function updatePlatformFee(uint256 newFee) external onlyRole(0) {
        require(newFee <= 10000, "LiquidityPool: fee must be less than or equal to 100%");
        require(newFee != platformFee, "LiquidityPool: fee must be different from the current fee");
        require(newFee >= 10, "LiquidityPool: fee must be at least 0.1%");
        platformFee = newFee;
    }

    /**
     * @notice Internal function to update reserves based on the actual balances of tokens in the contract.
     */
    function _updateReserves() internal {
        reserveA = ERC20Upgradeable(tokenA).balanceOf(address(this));
        reserveB = ERC20Upgradeable(tokenB).balanceOf(address(this));
    }

    /**
     * @notice Function to get the liquidity balance of a user.
     * @param user Address of the user.
     * @return Liquidity balance of the user.
     */
    function getLiquidityBalance(address user) external view returns (uint256) {
        return liquidityBalances[user];
    }

    /**
     * @notice Function to get the total liquidity in the pool.
     * @return Total liquidity in the pool.
     */
    function getTotalLiquidity() external view returns (uint256) {
        return totalLiquidity;
    }

    /**
     * @notice Function to get the platform fee.
     * @return Platform fee in basis points.
     */
    function getPlatformFee() external view returns (uint256) {
        return platformFee;
    }

    /**
     * @notice Function to get the address of the access manager contract.
     * @return Address of the access manager contract.
     */
    function getAccessManager() external view returns (address) {
        return address(accessManager);
    }

    /**
     * @notice Function to get the addresses of the tokens in the pool.
     * @return Addresses of tokenA and tokenB.
     */
    function getTokens() external view returns (address, address) {
        return (tokenA, tokenB);
    }

    /**
     * @notice Function to get the address of the liquidity token.
     * @return Address of the liquidity token.
     */
    function getLiquidityToken() external view returns (address) {
        return address(this);
    }

    /**
     * @notice Function to get the balance of a token in the pool.
     * @param token Address of the token.
     * @return Balance of the token in the pool.
     */
    function getBalance(address token) external view returns (uint256) {
        return ERC20Upgradeable(token).balanceOf(address(this));
    }

    /**
     * @notice Function to get the allowance of a token for the pool.
     * @param token Address of the token.
     * @return Allowance of the token for the pool.
     */
    function getAllowance(address token) external view returns (uint256) {
        return ERC20Upgradeable(token).allowance(msg.sender, address(this));
    }

    /**
     * @notice Function to get the total supply of the liquidity token.
     * @return Total supply of the liquidity token.
     */
    function getTotalSupply() external view returns (uint256) {
        return ERC20Upgradeable(address(this)).totalSupply();
    }

    /**
     * @notice Function to get the balance of the liquidity token for a user.
     * @param user Address of the user.
     * @return Balance of the liquidity token for the user.
     */
    function getLiquidityTokenBalance(address user) external view returns (uint256) {
        return ERC20Upgradeable(address(this)).balanceOf(user);
    }

    /**
     * @notice Function to get the allowance of the liquidity token for a user.
     * @param user Address of the user.
     * @return Allowance of the liquidity token for the user.
     */
    function getLiquidityTokenAllowance(address user) external view returns (uint256) {
        return ERC20Upgradeable(address(this)).allowance(user, address(this));
    }
}
