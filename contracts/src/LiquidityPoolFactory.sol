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

    constructor(address _liquidityToken, address admin, address admin2, address admin3) {
        liquidityToken = LiquidityToken(_liquidityToken);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin2);
        _grantRole(ADMIN_ROLE, admin3);
    }

    function createPool(
        address tokenA,
        address tokenB,
        address poolOwner,
        uint256 platformFee,
        address admin2,
        address admin3
    ) external nonReentrant returns (address pool) {
        require(tokenA != address(0) && tokenB != address(0), "Factory: invalid token addresses");
        require(tokenA != tokenB, "Factory: identical token addresses");
        require(
            getPool[tokenA][tokenB] == address(0) && getPool[tokenB][tokenA] == address(0),
            "Factory: pool already exists"
        );
        require(hasRole(ADMIN_ROLE, msg.sender), "Factory: caller is not admin");

        LiquidityPool liquidityPool = new LiquidityPool(tokenA, tokenB, address(liquidityToken), platformFee, 10, poolOwner, admin2, admin3);

        getPool[tokenA][tokenB] = address(liquidityPool);
        getPool[tokenB][tokenA] = address(liquidityPool);
        allPools.push(address(liquidityPool));

        emit PoolCreated(tokenA, tokenB, address(liquidityPool));
        return address(liquidityPool);
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
}
