// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/manager/AccessManagerUpgradeable.sol";

contract LiquidityPoolEvents {
    event LiquidityAdded(address indexed user, uint256 tokenAAmount, uint256 tokenBAmount);
    event LiquidityRemoved(address indexed user, uint256 tokenAAmount, uint256 tokenBAmount);
    event SwapExecuted(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);
}

abstract contract LiquidityPoolModifiers is AccessManagerUpgradeable {
    AccessManagerUpgradeable public accessManager;

    modifier onlyRole(uint64 roleId) {
        (bool hasRole, ) = accessManager.hasRole(roleId, msg.sender);
        require(hasRole, "LiquidityPool: sender must have the required role");
        _;
    }
}
