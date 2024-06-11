// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./LiquidityPoolInterfaces.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract LiquidityPool is Initializable, ERC20Upgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
    address public tokenA;
    address public tokenB;
    uint256 private reserveA;
    uint256 private reserveB;
    uint256 public platformFee;
    uint256 private MINIMUM_LIQUIDITY;

    event LiquidityAdded(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    event LiquidityRemoved(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    event Swap(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);

    function initialize(
        address _tokenA,
        address _tokenB,
        address addressManager,
        uint256 _platformFee,
        uint256 _minimumLiquidity
    ) public initializer {
        __ERC20_init("Liquidity Pool Tokens", "LPT");
        __ReentrancyGuard_init();
        __Ownable_init(addressManager);
        tokenA = _tokenA;
        tokenB = _tokenB;
        platformFee = _platformFee;
        MINIMUM_LIQUIDITY = _minimumLiquidity;
    }

    function addLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external nonReentrant {
        require(tokenAAmount > 0 && tokenBAmount > 0, "Invalid amounts");

        ERC20Upgradeable(tokenA).transferFrom(msg.sender, address(this), tokenAAmount);
        ERC20Upgradeable(tokenB).transferFrom(msg.sender, address(this), tokenBAmount);

        uint256 liquidity = calculateLiquidity(tokenAAmount, tokenBAmount);
        _mint(msg.sender, liquidity);

        updateReserves();

        emit LiquidityAdded(msg.sender, tokenAAmount, tokenBAmount);
    }

    function removeLiquidity(uint256 liquidity) external nonReentrant {
        require(liquidity > 0, "Invalid liquidity amount");

        uint256 tokenAAmount = (liquidity * reserveA) / totalSupply();
        uint256 tokenBAmount = (liquidity * reserveB) / totalSupply();
        _burn(msg.sender, liquidity);

        ERC20Upgradeable(tokenA).transfer(msg.sender, tokenAAmount);
        ERC20Upgradeable(tokenB).transfer(msg.sender, tokenBAmount);

        updateReserves();

        emit LiquidityRemoved(msg.sender, tokenAAmount, tokenBAmount);
    }

    function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut) external nonReentrant {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token address");
        require(amountIn > 0, "Invalid input amount");

        address tokenOut = (tokenIn == tokenA) ? tokenB : tokenA;
        uint256 amountOut = getAmountOut(amountIn, tokenIn);

        require(amountOut >= minAmountOut, "Insufficient output amount");

        ERC20Upgradeable(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        ERC20Upgradeable(tokenOut).transfer(msg.sender, amountOut);

        updateReserves();

        emit Swap(msg.sender, tokenIn, amountIn, tokenOut, amountOut);
    }

    function getAmountOut(uint256 amountIn, address tokenIn) public view returns (uint256) {
        uint256 reserveIn = (tokenIn == tokenA) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == tokenA) ? reserveB : reserveA;
        uint256 amountInWithFee = (amountIn * (10000 - platformFee)) / 10000;
        return (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
    }

    function updateReserves() private {
        reserveA = ERC20Upgradeable(tokenA).balanceOf(address(this));
        reserveB = ERC20Upgradeable(tokenB).balanceOf(address(this));
    }

    function calculateLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) private view returns (uint256) {
        return Math.sqrt(tokenAAmount * tokenBAmount) - MINIMUM_LIQUIDITY;
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    function getPrice(address tokenIn, uint256 amountIn) external view returns (uint256) {
        return getAmountOut(amountIn, tokenIn);
    }

    function updatePlatformFee(uint256 _platformFee) external onlyOwner {
        platformFee = _platformFee;
    }
}
