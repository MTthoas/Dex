// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LiquidityPool.sol";

contract LiquidityPoolFactory {
    address[] public allPools;
    mapping(address => mapping(address => address)) public getPool;

    event PoolCreated(address indexed token0, address indexed token1, address pool);

    function createPool(address token0, address token1) external returns (address pool) {
        require(token0 != token1, "IDENTICAL_ADDRESSES");
        require(token0 != address(0) && token1 != address(0), "ZERO_ADDRESS");
        require(getPool[token0][token1] == address(0), "POOL_EXISTS");

        pool = address(new LiquidityPool(token0, token1));
        getPool[token0][token1] = pool;
        getPool[token1][token0] = pool; // populate mapping in the reverse direction
        allPools.push(pool);

        emit PoolCreated(token0, token1, pool);
    }

    function allPoolsLength() external view returns (uint256) {
        return allPools.length;
    }
}
