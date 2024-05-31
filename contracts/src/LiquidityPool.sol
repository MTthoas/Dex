// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract LiquidityPool is ERC20, ERC20Burnable {
    ERC20 public gensToken;
    uint256 public ethReserve;
    uint256 public gensReserve;

    constructor(address _gensTokenAddress) ERC20("LiquidityPoolToken", "LPT") {
        gensToken = ERC20(_gensTokenAddress);
    }

    function addLiquidity(uint256 _gensAmount) external payable {
        uint256 ethInput = msg.value;
        uint256 gensInput = _gensAmount;

        if (ethReserve > 0 && gensReserve > 0) {
            uint256 ethOutput = (ethReserve * gensInput) / gensReserve;
            uint256 gensOutput = (gensReserve * ethInput) / ethReserve;
            require(gensOutput <= gensInput, "Slippage limit reached");
            require(ethOutput <= ethInput, "Slippage limit reached");
        }

        gensToken.transferFrom(msg.sender, address(this), gensInput);

        uint256 liquidityMinted = totalSupply() == 0
            ? Math.sqrt(ethInput * gensInput)
            : Math.min((ethInput * totalSupply()) / ethReserve, (gensInput * totalSupply()) / gensReserve);

        _mint(msg.sender, liquidityMinted);

        ethReserve += ethInput;
        gensReserve += gensInput;
    }

    function removeLiquidity(uint256 _liquidityAmount) external {
        uint256 ethAmount = (ethReserve * _liquidityAmount) / totalSupply();
        uint256 gensAmount = (gensReserve * _liquidityAmount) / totalSupply();
        require(ethAmount > 0 && gensAmount > 0, "Insufficient liquidity");

        _burn(msg.sender, _liquidityAmount);

        ethReserve -= ethAmount;
        gensReserve -= gensAmount;

        (bool successEth,) = payable(msg.sender).call{value: ethAmount}("");
        require(successEth, "ETH Transfer failed");

        require(gensToken.transfer(msg.sender, gensAmount), "GENS Transfer failed");
    }

    function getReserves() external view returns (uint256, uint256) {
        return (ethReserve, gensReserve);
    }
}
