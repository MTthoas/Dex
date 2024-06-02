// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/manager/AccessManagerUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./LiquidityPoolV2.sol";

contract LiquidityPoolFactory is Initializable, ReentrancyGuardUpgradeable, AccessManagerUpgradeable {
    // Event emitted when a new pool is created
    event PoolCreated(address indexed tokenA, address indexed tokenB, address poolAddress);

    // Mapping from tokens to pool address
    mapping(address => mapping(address => address)) public getPool;

    // All address of pools
    address[] public allPools;

    /** Initializer function (replaces constructor by OpenZeppelin standards) */
    function initialization(address _accessManager) public initializer {
        require(_accessManager != address(0), "Factory: invalid access manager address");
        __AccessManager_init(_accessManager);
        __ReentrancyGuard_init();
    }

    /**
     *  @notice Function to create a new liquidity pool
     *  @param tokenA Address of the first token
     *  @param tokenB Address of the second token
     *  @param accessManager Address of the access manager contract
     *  @param platformFee Platform fee in basis points
     */
    function createPool(
        address tokenA,
        address tokenB,
        address accessManager,
        uint256 platformFee
    ) external nonReentrant returns (address pool) {
        require(tokenA != address(0) && tokenB != address(0), "Factory: invalid token addresses");
        require(tokenA != tokenB, "Factory: identical token addresses");
        require(
            getPool[tokenA][tokenB] == address(0) && getPool[tokenB][tokenA] == address(0),
            "Factory: pool already exists"
        );

        // The bytecode of the LiquidityPoolV2 contract
        bytes memory bytecode = type(LiquidityPoolV2).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(tokenA, tokenB));
        assembly {
            pool := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        require(pool != address(0), "Factory: pool creation failed");

        // Call Initialize methods of LiquidityPoolV2 Contract
        LiquidityPoolV2(pool).initialize(tokenA, tokenB, accessManager, platformFee);

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
}
