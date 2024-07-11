// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./token/Token.sol";
import "./token/LiquidityPoolToken.sol";

/**
 * @title LiquidityPool
 * @dev A smart contract for managing a liquidity pool with two tokens, supporting adding/removing liquidity, swaps, and reward claims.
 */
contract LiquidityPool is ReentrancyGuard, AccessControl {
    using Math for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    Token public tokenA;
    Token public tokenB;
    LiquidityToken public liquidityToken;
    uint256 private reserveA;
    uint256 private reserveB;
    uint256 public platformFee;
    uint256 private MINIMUM_LIQUIDITY;

    struct LiquidityInfo {
        uint256 amountTokenA;
        uint256 amountTokenB;
        uint256 liquidity;
        uint256 timestamp;
    }

    mapping(address => LiquidityInfo[]) public userLiquidity;
    mapping(address => uint256) public userRewardsA;
    mapping(address => uint256) public userRewardsB;

    event LiquidityAdded(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    event LiquidityRemoved(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    event Swap(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);
    event RewardClaimed(address indexed user, uint256 rewardAmountA, uint256 rewardAmountB);

    /**
     * @dev Constructor to initialize the liquidity pool with tokens, liquidity token, platform fee, and admins.
     * @param _tokenA Address of token A.
     * @param _tokenB Address of token B.
     * @param _liquidityToken Address of the liquidity token.
     * @param _platformFee Platform fee percentage (in basis points).
     * @param _minimumLiquidity Minimum liquidity amount required.
     * @param _admin Address of the first admin.
     * @param _admin2 Address of the second admin.
     * @param _admin3 Address of the third admin.
     */
    constructor(
        address _tokenA,
        address _tokenB,
        address _liquidityToken,
        uint256 _platformFee,
        uint256 _minimumLiquidity,
        address _admin,
        address _admin2,
        address _admin3
    ) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid token addresses");
        require(_tokenA != _tokenB, "Identical token addresses");
        require(_liquidityToken != address(0), "Invalid liquidity token address");
        require(_platformFee > 0 && _platformFee < 10000, "Invalid platform fee");
        require(_minimumLiquidity > 0, "Invalid minimum liquidity");

        tokenA = Token(_tokenA);
        tokenB = Token(_tokenB);
        liquidityToken = LiquidityToken(_liquidityToken);
        platformFee = _platformFee;
        MINIMUM_LIQUIDITY = _minimumLiquidity;
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin2);
        _grantRole(ADMIN_ROLE, _admin3);
    }

    /**
     * @notice Adds liquidity to the pool.
     * @param tokenAAmount Amount of token A to add.
     * @param tokenBAmount Amount of token B to add.
     */
    function addLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external nonReentrant {
        require(tokenAAmount > 0 && tokenBAmount > 0, "Invalid amounts");

        require(tokenA.transferFrom(msg.sender, address(this), tokenAAmount), "Transfer of tokenA failed");
        require(tokenB.transferFrom(msg.sender, address(this), tokenBAmount), "Transfer of tokenB failed");

        uint256 liquidity;
        if (liquidityToken.totalSupply() == 0) {
            liquidity = calculateInitialLiquidity(tokenAAmount, tokenBAmount);
            require(liquidity > 0, "Insufficient liquidity minted");
            liquidityToken.mint(msg.sender, liquidity);
        } else {
            liquidity = calculateLiquidity(tokenAAmount, tokenBAmount);
            require(liquidity > 0, "Insufficient liquidity minted");
            liquidityToken.mint(msg.sender, liquidity);
        }

        reserveA += tokenAAmount;
        reserveB += tokenBAmount;

        userLiquidity[msg.sender].push(LiquidityInfo(tokenAAmount, tokenBAmount, liquidity, block.timestamp));

        // Check reserve ratios after updating reserves
        require(checkReservesRatio(), "Reserve ratios are incorrect");

        emit LiquidityAdded(msg.sender, tokenAAmount, tokenBAmount);
    }

    /**
     * @notice Removes liquidity from the pool.
     * @param liquidity Amount of liquidity tokens to remove.
     */
    function removeLiquidity(uint256 liquidity) external nonReentrant {
        require(liquidity > 0, "Invalid liquidity amount");

        uint256 totalSupply = liquidityToken.totalSupply();
        require(totalSupply > 0, "Total supply must be greater than zero");

        uint256 tokenAAmount = liquidity.mulDiv(reserveA, totalSupply);
        uint256 tokenBAmount = liquidity.mulDiv(reserveB, totalSupply);
        require(tokenAAmount > 0 && tokenBAmount > 0, "Invalid withdrawal amounts");

        liquidityToken.burn(msg.sender, liquidity);

        require(tokenA.transfer(msg.sender, tokenAAmount), "Transfer of tokenA failed");
        require(tokenB.transfer(msg.sender, tokenBAmount), "Transfer of tokenB failed");

        reserveA -= tokenAAmount;
        reserveB -= tokenBAmount;

        for (uint256 i = 0; i < userLiquidity[msg.sender].length; i++) {
            if (userLiquidity[msg.sender][i].liquidity == liquidity) {
                userLiquidity[msg.sender][i] = userLiquidity[msg.sender][userLiquidity[msg.sender].length - 1];
                userLiquidity[msg.sender].pop();
                break;
            }
        }

        emit LiquidityRemoved(msg.sender, tokenAAmount, tokenBAmount);
    }

    /**
     * @notice Swaps tokens in the pool.
     * @param tokenIn Address of the input token.
     * @param amountIn Amount of input token.
     * @param minAmountOut Minimum amount of output token expected.
     */
    function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut) external nonReentrant {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token address");
        require(amountIn > 0, "Invalid input amount");

        address tokenOut = (tokenIn == address(tokenA)) ? address(tokenB) : address(tokenA);
        uint256 amountOut = getAmountOut(amountIn, tokenIn);

        require(amountOut >= minAmountOut, "Insufficient output amount");

        require(Token(tokenIn).transferFrom(msg.sender, address(this), amountIn), "Transfer of tokenIn failed");
        require(Token(tokenOut).transfer(msg.sender, amountOut), "Transfer of tokenOut failed");

        reserveA = tokenA.balanceOf(address(this));
        reserveB = tokenB.balanceOf(address(this));

        emit Swap(msg.sender, tokenIn, amountIn, tokenOut, amountOut);
    }

    /**
     * @notice Calculates the output amount for a given input amount and token.
     * @param amountIn Amount of input token.
     * @param tokenIn Address of the input token.
     * @return Amount of output token.
     */
    function getAmountOut(uint256 amountIn, address tokenIn) public view returns (uint256) {
        uint256 reserveIn = (tokenIn == address(tokenA)) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == address(tokenA)) ? reserveB : reserveA;
        uint256 amountInWithFee = (amountIn * (10000 - platformFee)) / 10000;
        return (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
    }

    /**
     * @notice Calculates initial liquidity based on token amounts.
     * @param tokenAAmount Amount of token A.
     * @param tokenBAmount Amount of token B.
     * @return Initial liquidity.
     */
    function calculateInitialLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) private view returns (uint256) {
        return Math.sqrt(tokenAAmount * tokenBAmount) - MINIMUM_LIQUIDITY;
    }

    /**
     * @notice Calculates liquidity based on token amounts.
     * @param tokenAAmount Amount of token A.
     * @param tokenBAmount Amount of token B.
     * @return Liquidity.
     */
    function calculateLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) private view returns (uint256) {
        uint256 totalSupply_ = liquidityToken.totalSupply();
        if (reserveA == 0 || reserveB == 0) {
            return Math.sqrt(tokenAAmount * tokenBAmount) - MINIMUM_LIQUIDITY;
        }
        return Math.min((tokenAAmount * totalSupply_) / reserveA, (tokenBAmount * totalSupply_) / reserveB);
    }

    /**
     * @notice Gets the current reserves of the pool.
     * @return Reserve of token A and token B.
     */
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    /**
     * @notice Gets the price of the output token for a given input amount and token.
     * @param tokenIn Address of the input token.
     * @param amountIn Amount of input token.
     * @return Price of the output token.
     */
    function getPrice(address tokenIn, uint256 amountIn) external view returns (uint256) {
        return getAmountOut(amountIn, tokenIn);
    }

    /**
     * @notice Updates the platform fee.
     * @param _platformFee New platform fee (in basis points).
     * @return Updated platform fee.
     */
    function updatePlatformFee(uint256 _platformFee) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(_platformFee > 0 && _platformFee < 10000, "Invalid platform fee");
        platformFee = _platformFee;
        return platformFee;
    }

    /**
     * @notice Gets the pair of tokens in the pool.
     * @return Address of token A and token B.
     */
    function getPair() external view returns (address, address) {
        return (address(tokenA), address(tokenB));
    }

    /**
     * @notice Calculates rewards for a user based on their liquidity share.
     * @param user Address of the user.
     * @return rewardA Reward amount for token A.
     * @return rewardB Reward amount for token B.
     */
    function calculateRewards(address user) public view returns (uint256 rewardA, uint256 rewardB) {
        uint256 totalLiquidity = liquidityToken.totalSupply();
        uint256 userLiquidityShare = 0;

        LiquidityInfo[] storage liquidityInfo = userLiquidity[user];
        for (uint256 i = 0; i < liquidityInfo.length; i++) {
            userLiquidityShare += liquidityInfo[i].liquidity;
        }

        uint256 totalRewardA = (reserveA * userLiquidityShare) / totalLiquidity;
        uint256 totalRewardB = (reserveB * userLiquidityShare) / totalLiquidity;

        rewardA = totalRewardA > userRewardsA[user] ? totalRewardA - userRewardsA[user] : 0;
        rewardB = totalRewardB > userRewardsB[user] ? totalRewardB - userRewardsB[user] : 0;
    }

    /**
     * @notice Claims rewards for the caller.
     */
    function claimRewards() external nonReentrant {
        (uint256 rewardA, uint256 rewardB) = calculateRewards(msg.sender);
        require(rewardA > 0 || rewardB > 0, "No rewards available");

        reserveA -= rewardA;
        reserveB -= rewardB;

        userRewardsA[msg.sender] += rewardA;
        userRewardsB[msg.sender] += rewardB;

        require(tokenA.transfer(msg.sender, rewardA), "Transfer of rewardA failed");
        require(tokenB.transfer(msg.sender, rewardB), "Transfer of rewardB failed");

        emit RewardClaimed(msg.sender, rewardA, rewardB);
    }

    /**
     * @notice Checks if the reserve ratios are within the acceptable range.
     * @return True if the reserve ratios are correct, false otherwise.
     */
    function checkReservesRatio() private view returns (bool) {
        if (reserveA == 0 || reserveB == 0) {
            return true; // Pas de vérification si l'un des pools est vide
        }
        uint256 ratio = (reserveA * 1e18) / reserveB;
        uint256 expectedRatio = (tokenA.balanceOf(address(this)) * 1e18) / tokenB.balanceOf(address(this));
        // Tolérance de 1%
        return (ratio >= (expectedRatio * 99) / 100 && ratio <= (expectedRatio * 101) / 100);
    }
}
