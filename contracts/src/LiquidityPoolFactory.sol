// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./LiquidityPool.sol";

contract LiquidityPoolFactory is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
    // Event emitted when a new pool is created
    event PoolCreated(address indexed tokenA, address indexed tokenB, address poolAddress);

    // Mapping from tokens to pool address
    mapping(address => mapping(address => address)) public getPool;

    // All address of pools
    address[] public allPools;

    /** Initializer function (replaces constructor by OpenZeppelin standards) */
    function initialize(address owner) public initializer {
        __Ownable_init(owner);
        __ReentrancyGuard_init();
    }

    /**
     *  @notice Function to create a new liquidity pool
     *  @param tokenA Address of the first token
     *  @param tokenB Address of the second token
     *  @param platformFee Platform fee in basis points
     */
    function createPool(
        address tokenA,
        address tokenB,
        address owner,
        uint256 platformFee
    ) external onlyOwner nonReentrant returns (address pool) {
        require(tokenA != address(0) && tokenB != address(0), "Factory: invalid token addresses");
        require(tokenA != tokenB, "Factory: identical token addresses");
        require(
            getPool[tokenA][tokenB] == address(0) && getPool[tokenB][tokenA] == address(0),
            "Factory: pool already exists"
        );

        // Deploy a new LiquidityPool contract
        pool = address(new LiquidityPool());

        // Call Initialize methods of LiquidityPool Contract
        LiquidityPool(pool).initialize(tokenA, tokenB, owner, platformFee, 10);

        // Store the pool address in the mapping and array
        getPool[tokenA][tokenB] = pool;
        getPool[tokenB][tokenA] = pool;
        allPools.push(pool);

        emit PoolCreated(tokenA, tokenB, pool);
    }

    /**
     *   @notice Function to get the number of all pools
     *   @return allPools.length Number of all pools
     */
    function allPoolsLength() external view returns (uint256) {
        return allPools.length;
    }

    /**
     *   @notice Function to get the address of all pools
     *   @return allPools Address of all pools
     */
    function allPoolsAddress() external view returns (address[] memory) {
        return allPools;
    }

    /**
     *   @notice Function to get the address of all pools
     *   @return allPools Address of all pools
     */
    function getPoolAddress(address tokenA, address tokenB) external view returns (address) {
        return getPool[tokenA][tokenB];
    }

    /**
     *   @notice Function to get the address of all pools
     *   @return allPools Address of all pools
     */
    function getPoolAddressByIndex(uint256 index) external view returns (address) {
        return allPools[index];
    }
}
