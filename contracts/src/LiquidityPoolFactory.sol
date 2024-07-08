// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LiquidityPool.sol";
import "./token/LiquidityPoolToken.sol";

contract LiquidityPoolFactory is ReentrancyGuard, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event PoolCreated(address indexed tokenA, address indexed tokenB, address poolAddress);

    mapping(address => mapping(address => address)) public getPool;
    address[] public allPools;

    LiquidityToken public liquidityToken;

    constructor(address _liquidityToken, address admin) {
        liquidityToken = LiquidityToken(_liquidityToken);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function createPool(
        address tokenA,
        address tokenB,
        address poolOwner,
        uint256 platformFee
    ) external nonReentrant returns (address pool) {
        require(tokenA != address(0) && tokenB != address(0), "Factory: invalid token addresses");
        require(tokenA != tokenB, "Factory: identical token addresses");
        require(
            getPool[tokenA][tokenB] == address(0) && getPool[tokenB][tokenA] == address(0),
            "Factory: pool already exists"
        );
        require(hasRole(ADMIN_ROLE, msg.sender), "Factory: caller is not admin");

        LiquidityPool liquidityPool = new LiquidityPool();
        liquidityPool.initialize(tokenA, tokenB, address(liquidityToken), platformFee, 10, poolOwner);

        getPool[tokenA][tokenB] = address(liquidityPool);
        getPool[tokenB][tokenA] = address(liquidityPool);
        allPools.push(address(liquidityPool));

        emit PoolCreated(tokenA, tokenB, address(liquidityPool));
        return address(liquidityPool);
    }

    // Delete a pool
    function deletePool(address tokenA, address tokenB) external nonReentrant {
        require(hasRole(ADMIN_ROLE, msg.sender), "Factory: caller is not admin");
        require(getPool[tokenA][tokenB] != address(0), "Factory: pool does not exist");

        address poolAddress = getPool[tokenA][tokenB];
        LiquidityPool(poolAddress).deletePool();

        getPool[tokenA][tokenB] = address(0);
        getPool[tokenB][tokenA] = address(0);

        for (uint256 i = 0; i < allPools.length; i++) {
            if (allPools[i] == poolAddress) {
                allPools[i] = allPools[allPools.length - 1];
                allPools.pop();
                break;
            }
        }
    }

    function allPoolsLength() external view returns (uint256) {
        return allPools.length;
    }

    function allPoolsAddress() external view returns (address[] memory) {
        return allPools;
    }

    function getPoolAddress(address tokenA, address tokenB) external view returns (address) {
        return getPool[tokenA][tokenB];
    }

    function getPoolAddressByIndex(uint256 index) external view returns (address) {
        return allPools[index];
    }

    function isPoolPairAlreadyExists(address tokenA, address tokenB) external view returns (bool) {
        return getPool[tokenA][tokenB] != address(0);
    }
}
