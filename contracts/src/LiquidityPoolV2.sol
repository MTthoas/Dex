// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/manager/AccessManagedUpgradeable.sol";

contract LiquidityPool is ReentrancyGuardUpgradeable, AccessManagedUpgradeable {
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

    // Events
    event LiquidityAdded(address indexed user, uint256 tokenAAmount, uint256 tokenBAmount);
    event LiquidityRemoved(address indexed user, uint256 tokenAAmount, uint256 tokenBAmount);
    event SwapExecuted(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);

    // Initializer function (replaces constructor)
    function initialize(address _tokenA, address _tokenB, address _initialAuthority) public initializer {
        require(_tokenA != address(0) && _tokenB != address(0), "LiquidityPool: invalid token addresses");
        tokenA = _tokenA;
        tokenB = _tokenB;

        __ReentrancyGuard_init();
        __AccessManaged_init(_initialAuthority);
    }

    // Function to add liquidity to the pool
    function addLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external restricted nonReentrant {
        require(tokenAAmount > 0 && tokenBAmount > 0, "LiquidityPool: amounts must be greater than zero");

        // Transfer tokens from sender to the contract
        ERC20Upgradeable(tokenA).transferFrom(msg.sender, address(this), tokenAAmount);
        ERC20Upgradeable(tokenB).transferFrom(msg.sender, address(this), tokenBAmount);

        // Calculate liquidity tokens to mint
        uint256 liquidity;
        if (totalLiquidity == 0) {
            liquidity = Math.sqrt(tokenAAmount * tokenBAmount);
        } else {
            liquidity = Math.min(
                (tokenAAmount * totalLiquidity) / reserveA,
                (tokenBAmount * totalLiquidity) / reserveB
            );
        }
        require(liquidity > 0, "LiquidityPool: insufficient liquidity minted");

        // Update reserves and mint liquidity tokens
        _updateReserves();
        liquidityBalances[msg.sender] += liquidity;
        totalLiquidity += liquidity;

        emit LiquidityAdded(msg.sender, tokenAAmount, tokenBAmount);
    }

    // Function to remove liquidity from the pool
    function removeLiquidity(uint256 liquidityTokens) external restricted nonReentrant {
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

// Function to execute a swap
    function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut, address recipient) external restricted nonReentrant {
        require(amountIn > 0, "LiquidityPool: amount must be greater than zero");
        require(tokenIn == tokenA || tokenIn == tokenB, "LiquidityPool: invalid token address");

        address tokenOut = (tokenIn == tokenA) ? tokenB : tokenA;
        uint256 reserveIn = (tokenIn == tokenA) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == tokenA) ? reserveB : reserveA;

        // Transfer the input tokens from the user to the contract
        ERC20Upgradeable(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Calculate the output amount using the constant product formula
        uint256 amountInWithFee = amountIn * (10000 - platformFee) / 10000;
        uint256 amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        require(amountOut >= minAmountOut, "LiquidityPool: insufficient output amount");

        // Update reserves
        _updateReserves();

        // Transfer the output tokens to the recipient
        ERC20Upgradeable(tokenOut).transfer(recipient, amountOut);

        emit SwapExecuted(msg.sender, tokenIn, amountIn, tokenOut, amountOut);
    }

    // Function to get the current reserves of the pool
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    // Function to get the price of a token amount in the other token
    function getPrice(address tokenIn, uint256 amountIn) external view returns (uint256) {
        require(tokenIn == tokenA || tokenIn == tokenB, "LiquidityPool: invalid token address");

        uint256 reserveIn = (tokenIn == tokenA) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == tokenA) ? reserveB : reserveA;

        uint256 amountInWithFee = amountIn * (10000 - platformFee) / 10000;
        uint256 amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        return amountOut;
    }

    // Function to update the platform fee
    function updatePlatformFee(uint256 newFee) external restricted {
        platformFee = newFee;
    }

    // Internal function to update reserves based on the actual balances of tokens in the contract
    function _updateReserves() internal {
        reserveA = ERC20Upgradeable(tokenA).balanceOf(address(this));
        reserveB = ERC20Upgradeable(tokenB).balanceOf(address(this));
    }
}