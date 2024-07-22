// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LiquidityPool.sol";
import "./token/LiquidityPoolToken.sol";

/**
 * @title LiquidityPoolFactory
 * @dev A factory contract to deploy and manage multiple LiquidityPool contracts.
 */
contract LiquidityPoolFactory is ReentrancyGuard, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event PoolCreated(address indexed tokenA, address indexed tokenB, address poolAddress);

    mapping(address => mapping(address => address)) public getPool;
    address[] public allPools;

    LiquidityToken public liquidityToken;

    /**
     * @dev Constructor to initialize the factory with the liquidity token and admins.
     * @param _liquidityToken Address of the liquidity token.
     * @param admin Address of the first admin.
     * @param admin2 Address of the second admin.
     * @param admin3 Address of the third admin.
     */
    constructor(address _liquidityToken, address admin, address admin2, address admin3) {
        liquidityToken = LiquidityToken(_liquidityToken);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin2);
        _grantRole(ADMIN_ROLE, admin3);
    }

    /**
     * @notice Creates a new LiquidityPool contract.
     * @param tokenA Address of token A.
     * @param tokenB Address of token B.
     * @param poolOwner Address of the owner of the new pool.
     * @param platformFee Platform fee percentage (in basis points) for the new pool.
     * @param admin2 Address of the second admin for the new pool.
     * @param admin3 Address of the third admin for the new pool.
     * @return pool Address of the new LiquidityPool contract.
     */
    function createPool(
        address tokenA,
        address tokenB,
        address poolOwner,
        uint256 platformFee,
        address admin2,
        address admin3
    ) external nonReentrant onlyRole(ADMIN_ROLE) returns (address pool) {
        require(tokenA != address(0) && tokenB != address(0), "Factory: invalid token addresses");
        require(tokenA != tokenB, "Factory: identical token addresses");
        require(
            getPool[tokenA][tokenB] == address(0) && getPool[tokenB][tokenA] == address(0),
            "Factory: pool already exists"
        );
        require(hasRole(ADMIN_ROLE, msg.sender), "Factory: caller is not admin");

        LiquidityPool liquidityPool = new LiquidityPool(
            tokenA,
            tokenB,
            address(liquidityToken),
            platformFee,
            10,
            poolOwner,
            admin2,
            admin3
        );

        // Store pool addresses and mappings
        getPool[tokenA][tokenB] = address(liquidityPool);
        getPool[tokenB][tokenA] = address(liquidityPool);
        allPools.push(address(liquidityPool));

        emit PoolCreated(tokenA, tokenB, address(liquidityPool));
        return address(liquidityPool);
    }

    /**
     * @notice Gets the number of created pools.
     * @return Number of pools.
     */
    function allPoolsLength() external view returns (uint256) {
        return allPools.length;
    }

    /**
     * @notice Gets all addresses of created pools.
     * @return Array of pool addresses.
     */
    function allPoolsAddress() external view returns (address[] memory) {
        return allPools;
    }

    /**
     * @notice Gets the address of the pool for a specific pair of tokens.
     * @param tokenA Address of token A.
     * @param tokenB Address of token B.
     * @return Address of the LiquidityPool contract.
     */
    function getPoolAddress(address tokenA, address tokenB) external view returns (address) {
        return getPool[tokenA][tokenB];
    }

    /**
     * @notice Gets the address of a pool by its index in the allPools array.
     * @param index Index of the pool.
     * @return Address of the LiquidityPool contract.
     */
    function getPoolAddressByIndex(uint256 index) external view returns (address) {
        return allPools[index];
    }

    function isPoolPairAlreadyExists(address tokenA, address tokenB) external view returns (bool) {
        return getPool[tokenA][tokenB] != address(0);
    }
}
