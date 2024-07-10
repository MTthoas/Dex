// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./token/Token.sol";
import "./token/LiquidityPoolToken.sol";

contract LiquidityPool is ReentrancyGuard, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    Token public tokenA;
    Token public tokenB;
    LiquidityToken public liquidityToken;
    uint256 private reserveA;
    uint256 private reserveB;
    uint256 public platformFee;
    uint256 private MINIMUM_LIQUIDITY;

    event LiquidityAdded(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    event LiquidityRemoved(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    event Swap(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);

    constructor(
        address _tokenA,
        address _tokenB,
        address _liquidityToken,
        uint256 _platformFee,
        uint256 _minimumLiquidity,
        address _admin,
        address _admin2,
        address _admin3
    ){
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

        emit LiquidityAdded(msg.sender, tokenAAmount, tokenBAmount);
    }

    function removeLiquidity(uint256 liquidity) external nonReentrant {
        require(liquidity > 0, "Invalid liquidity amount");

        uint256 tokenAAmount = (liquidity * reserveA) / liquidityToken.totalSupply();
        uint256 tokenBAmount = (liquidity * reserveB) / liquidityToken.totalSupply();
        require(tokenAAmount > 0 && tokenBAmount > 0, "Invalid withdrawal amounts");

        liquidityToken.burn(msg.sender, liquidity);

        require(tokenA.transfer(msg.sender, tokenAAmount), "Transfer of tokenA failed");
        require(tokenB.transfer(msg.sender, tokenBAmount), "Transfer of tokenB failed");

        reserveA -= tokenAAmount;
        reserveB -= tokenBAmount;

        emit LiquidityRemoved(msg.sender, tokenAAmount, tokenBAmount);
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
        return sqrt(tokenAAmount * tokenBAmount) - MINIMUM_LIQUIDITY;
    }

    function calculateLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) private view returns (uint256) {
        uint256 totalSupply_ = liquidityToken.totalSupply();
        return
            totalSupply_ == 0
                ? sqrt(tokenAAmount * tokenBAmount) - MINIMUM_LIQUIDITY
                : min((tokenAAmount * totalSupply_) / reserveA, (tokenBAmount * totalSupply_) / reserveB);
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    function getPrice(address tokenIn, uint256 amountIn) external view returns (uint256) {
        return getAmountOut(amountIn, tokenIn);
    }

    function updatePlatformFee(uint256 _platformFee) external onlyRole(ADMIN_ROLE) {
        require(_platformFee > 0 && _platformFee < 10000, "Invalid platform fee");
        platformFee = _platformFee;
    }

    function getPair() external view returns (address, address) {
        return (address(tokenA), address(tokenB));
    }
}
