// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiquidityPool is ReentrancyGuard {
    using Math for uint256;

    address public token0;
    address public token1;
    address public feeTo; // Address to which fees will be sent
    uint256 public feeRate; // (1 basis point = 0.01%)

    uint256 public reserve0;
    uint256 public reserve1;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(address indexed sender, uint256 amount0Out, uint256 amount1Out, address indexed to);
    event Sync(uint256 reserve0, uint256 reserve1);
    event FeeUpdated(address indexed newFeeTo, uint256 newFeeRate);

    constructor(address _token0, address _token1, address _feeTo, uint256 _feeRate) {
        token0 = _token0;
        token1 = _token1;
        feeTo = _feeTo;
        feeRate = _feeRate;
    }

    function _update(uint256 balance0, uint256 balance1) private {
        reserve0 = balance0;
        reserve1 = balance1;
        emit Sync(reserve0, reserve1);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeTo, "FORBIDDEN");
        feeTo = _feeTo;
        emit FeeUpdated(feeTo, feeRate);
    }

    function setFeeRate(uint256 _feeRate) external {
        require(msg.sender == feeTo, "FORBIDDEN");
        require(_feeRate <= 300, "FEE_RATE_TOO_HIGH"); // <= 3%
        feeRate = _feeRate;
        emit FeeUpdated(feeTo, feeRate);
    }

    function addLiquidity(uint256 amount0, uint256 amount1) external nonReentrant returns (uint256 liquidity) {
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);

        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));

        uint256 _totalSupply = totalSupply;
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0 * amount1);
        } else {
            liquidity = Math.min(amount0 * _totalSupply / reserve0, amount1 * _totalSupply / reserve1);
        }
        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");

        balanceOf[msg.sender] += liquidity;
        totalSupply += liquidity;

        _update(balance0, balance1);
        emit Mint(msg.sender, amount0, amount1);
    }

    function removeLiquidity(uint256 liquidity) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        uint256 _totalSupply = totalSupply;
        require(_totalSupply > 0, "NO_LIQUIDITY");

        amount0 = liquidity * reserve0 / _totalSupply;
        amount1 = liquidity * reserve1 / _totalSupply;
        require(amount0 > 0 && amount1 > 0, "INSUFFICIENT_LIQUIDITY_BURNED");

        balanceOf[msg.sender] -= liquidity;
        totalSupply -= liquidity;

        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);

        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));

        _update(balance0, balance1);
        emit Burn(msg.sender, amount0, amount1, msg.sender);
    }

    function swap(uint256 amount0Out, uint256 amount1Out, address to) external nonReentrant {
        require(amount0Out > 0 || amount1Out > 0, "INSUFFICIENT_OUTPUT_AMOUNT");

        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));

        require(amount0Out < balance0 && amount1Out < balance1, "INSUFFICIENT_LIQUIDITY");

        uint256 amount0In = balance0 - reserve0;
        uint256 amount1In = balance1 - reserve1;

        uint256 balance0Adjusted = balance0 - amount0Out + (amount0In * (10000 - feeRate) / 10000);
        uint256 balance1Adjusted = balance1 - amount1Out + (amount1In * (10000 - feeRate) / 10000);

        if (amount0Out > 0) IERC20(token0).transfer(to, amount0Out);
        if (amount1Out > 0) IERC20(token1).transfer(to, amount1Out);

        uint256 fee0 = (amount0In * feeRate) / 10000;
        uint256 fee1 = (amount1In * feeRate) / 10000;

        if (fee0 > 0) IERC20(token0).transfer(feeTo, fee0);
        if (fee1 > 0) IERC20(token1).transfer(feeTo, fee1);

        _update(balance0Adjusted, balance1Adjusted);
        emit Swap(msg.sender, amount0Out, amount1Out, to);
    }
}
