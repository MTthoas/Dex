// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
    uint256 private constant MINIMUM_TIME = 2 hours;

    struct LiquidityInfo {
        uint256 amountTokenA;
        uint256 amountTokenB;
        uint256 liquidity;
        uint256 timestamp;
    }

    mapping(address => LiquidityInfo[]) public userLiquidity;
    mapping(address => uint256) public userRewards;

    event LiquidityAdded(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    event LiquidityRemoved(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    event Swap(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);
    event RewardClaimed(address indexed user, uint256 rewardAmount);

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

    function hasAddedLiquidity(address user) external view returns (bool) {
        return userLiquidity[user].length > 0;
    }

    function addLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external nonReentrant {
        require(tokenAAmount > 0 && tokenBAmount > 0, "Invalid amounts");

        require(tokenA.transferFrom(msg.sender, address(this), tokenAAmount), "Transfer of tokenA failed");
        require(tokenB.transferFrom(msg.sender, address(this), tokenBAmount), "Transfer of tokenB failed");

        uint256 liquidity;
        if (liquidityToken.totalSupply() == 0) {
            require(tokenAAmount <= type(uint256).max / tokenBAmount, "Multiplication overflow");
            liquidity = calculateInitialLiquidity(tokenAAmount, tokenBAmount);
            require(liquidity > MINIMUM_LIQUIDITY, "Insufficient initial liquidity");
            liquidityToken.mint(msg.sender, liquidity - MINIMUM_LIQUIDITY);
        } else {
            liquidity = calculateLiquidity(tokenAAmount, tokenBAmount);
            require(liquidity > 0, "Insufficient liquidity minted");
            liquidityToken.mint(msg.sender, liquidity);
        }

        reserveA += tokenAAmount;
        reserveB += tokenBAmount;

        userLiquidity[msg.sender].push(LiquidityInfo(tokenAAmount, tokenBAmount, liquidity, block.timestamp));

        require(checkReservesRatio(), "Reserve ratios are incorrect");

        emit LiquidityAdded(msg.sender, tokenAAmount, tokenBAmount);
    }

    function getUserLiquidityInfo(
        address user
    ) public view returns (uint256 liquidityTokens, uint256 tokenAAmount, uint256 tokenBAmount, uint256 timeRemaining) {
        uint256 totalLiquidity = 0;
        uint256 totalTokenA = 0;
        uint256 totalTokenB = 0;
        uint256 currentTime = block.timestamp;
        uint256 lastAddedTime = 0;

        LiquidityInfo[] storage liquidityInfo = userLiquidity[user];
        for (uint i = 0; i < liquidityInfo.length; i++) {
            totalLiquidity += liquidityInfo[i].liquidity;
            totalTokenA += liquidityInfo[i].amountTokenA;
            totalTokenB += liquidityInfo[i].amountTokenB;
            if (liquidityInfo[i].timestamp > lastAddedTime) {
                lastAddedTime = liquidityInfo[i].timestamp;
            }
        }

        uint256 remainingTime = (lastAddedTime + MINIMUM_TIME > currentTime)
            ? (lastAddedTime + MINIMUM_TIME - currentTime)
            : 0;

        return (totalLiquidity, totalTokenA, totalTokenB, remainingTime);
    }

    function removeLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external nonReentrant {
        require(userLiquidity[msg.sender].length > 0, "No liquidity added");
        require(tokenAAmount > 0 && tokenBAmount > 0, "Invalid token amounts");

        (uint256 totalUserLiquidity, uint256 totalTokenA, uint256 totalTokenB, ) = getUserLiquidityInfo(msg.sender);
        require(tokenAAmount <= totalTokenA && tokenBAmount <= totalTokenB, "Insufficient liquidity");

        uint256 liquidity = Math.min(
            tokenAAmount.mulDiv(totalUserLiquidity, totalTokenA),
            tokenBAmount.mulDiv(totalUserLiquidity, totalTokenB)
        );
        require(liquidity > 0, "Invalid liquidity amount");

        uint256 currentTime = block.timestamp;
        LiquidityInfo[] storage liquidityInfo = userLiquidity[msg.sender];
        for (uint256 i = 0; i < liquidityInfo.length; i++) {
            require(currentTime >= liquidityInfo[i].timestamp + MINIMUM_TIME, "Liquidity is locked for 2 hours");
        }

        uint256 totalSupply = liquidityToken.totalSupply();
        require(totalSupply > 0, "Total supply must be greater than zero");

        uint256 tokenAAmountWithdraw = liquidity.mulDiv(reserveA, totalSupply);
        uint256 tokenBAmountWithdraw = liquidity.mulDiv(reserveB, totalSupply);
        require(tokenAAmountWithdraw > 0 && tokenBAmountWithdraw > 0, "Invalid withdrawal amounts");

        liquidityToken.burn(msg.sender, liquidity);

        require(tokenA.transfer(msg.sender, tokenAAmountWithdraw), "Transfer of tokenA failed");
        require(tokenB.transfer(msg.sender, tokenBAmountWithdraw), "Transfer of tokenB failed");

        reserveA -= tokenAAmountWithdraw;
        reserveB -= tokenBAmountWithdraw;

        updateUserLiquidity(msg.sender, liquidity, tokenAAmountWithdraw, tokenBAmountWithdraw);

        emit LiquidityRemoved(msg.sender, tokenAAmountWithdraw, tokenBAmountWithdraw);
    }

    function updateUserLiquidity(address user, uint256 liquidity, uint256 tokenAAmount, uint256 tokenBAmount) internal {
        uint256 liquidityToRemove = liquidity;
        uint256 tokenAAmountToRemove = tokenAAmount;
        uint256 tokenBAmountToRemove = tokenBAmount;
        LiquidityInfo[] storage liquidityInfo = userLiquidity[user];

        for (uint256 i = 0; i < liquidityInfo.length; i++) {
            if (liquidityInfo[i].liquidity > liquidityToRemove) {
                liquidityInfo[i].liquidity -= liquidityToRemove;
                liquidityInfo[i].amountTokenA -= tokenAAmountToRemove;
                liquidityInfo[i].amountTokenB -= tokenBAmountToRemove;
                break;
            } else {
                liquidityToRemove -= liquidityInfo[i].liquidity;
                tokenAAmountToRemove -= liquidityInfo[i].amountTokenA;
                tokenBAmountToRemove -= liquidityInfo[i].amountTokenB;
                liquidityInfo[i].liquidity = 0;
                liquidityInfo[i].amountTokenA = 0;
                liquidityInfo[i].amountTokenB = 0;
            }
        }

        for (uint256 i = 0; i < liquidityInfo.length; ) {
            if (liquidityInfo[i].liquidity == 0) {
                liquidityInfo[i] = liquidityInfo[liquidityInfo.length - 1];
                liquidityInfo.pop();
            } else {
                i++;
            }
        }
    }

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

    function getAmountOut(uint256 amountIn, address tokenIn) public view returns (uint256) {
        uint256 reserveIn = (tokenIn == address(tokenA)) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == address(tokenA)) ? reserveB : reserveA;
        uint256 amountInWithFee = (amountIn * (10000 - platformFee)) / 10000;
        return (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
    }

    function calculateInitialLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) private view returns (uint256) {
        uint256 product = tokenAAmount * tokenBAmount;
        require(product / tokenAAmount == tokenBAmount, "Multiplication overflow");
        uint256 initialLiquidity = Math.sqrt(product);
        require(initialLiquidity > MINIMUM_LIQUIDITY, "Insufficient initial liquidity");
        return initialLiquidity;
    }

    function calculateLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) private view returns (uint256) {
        uint256 totalSupply_ = liquidityToken.totalSupply();
        if (reserveA == 0 || reserveB == 0) {
            uint256 product = tokenAAmount * tokenBAmount;
            require(product / tokenAAmount == tokenBAmount, "Multiplication overflow");
            uint256 initialLiquidity = Math.sqrt(product);
            require(initialLiquidity > MINIMUM_LIQUIDITY, "Insufficient initial liquidity");
            return initialLiquidity - MINIMUM_LIQUIDITY;
        }
        return Math.min((tokenAAmount * totalSupply_) / reserveA, (tokenBAmount * totalSupply_) / reserveB);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    function getPrice(address tokenIn, uint256 amountIn) external view returns (uint256) {
        return getAmountOut(amountIn, tokenIn);
    }

    function updatePlatformFee(uint256 _platformFee) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(_platformFee > 0 && _platformFee < 10000, "Invalid platform fee");
        platformFee = _platformFee;
        return platformFee;
    }

    function getPair() external view returns (address, address) {
        return (address(tokenA), address(tokenB));
    }

    function calculateRewards(address user) public view returns (uint256 reward) {
        require(userLiquidity[user].length > 0, "No liquidity added");
        uint256 totalLiquidity = liquidityToken.totalSupply();
        uint256 userLiquidityShare = 0;

        LiquidityInfo[] storage liquidityInfo = userLiquidity[user];
        for (uint i = 0; i < liquidityInfo.length; i++) {
            userLiquidityShare += liquidityInfo[i].liquidity;
        }

        uint256 totalReward = (totalLiquidity * userLiquidityShare) / totalLiquidity;
        reward = totalReward > userRewards[user] ? totalReward - userRewards[user] : 0;
    }

    function claimRewards() external nonReentrant {
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "No rewards available");

        liquidityToken.mint(msg.sender, reward);
        userRewards[msg.sender] += reward;

        emit RewardClaimed(msg.sender, reward);
    }

    function checkReservesRatio() private view returns (bool) {
        if (reserveA == 0 || reserveB == 0) {
            return true;
        }
        uint256 ratio = (reserveA * 1e18) / reserveB;
        uint256 expectedRatio = (tokenA.balanceOf(address(this)) * 1e18) / tokenB.balanceOf(address(this));
        return (ratio >= (expectedRatio * 99) / 100 && ratio <= (expectedRatio * 101) / 100);
    }
}
