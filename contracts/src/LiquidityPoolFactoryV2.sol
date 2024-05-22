// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/manager/AccessManagedUpgradeable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./LiquidityPoolV2.sol";

contract LiquidityPoolFactory is AccessManagedUpgradeable {
    using Clones for address;

    // Address of the liquidity pool implementation
    address public liquidityPoolImplementation;

    // List of all deployed liquidity pools
    address[] public allPools;

    // Mapping from pair (tokenA, tokenB) to the liquidity pool address
    mapping(address => mapping(address => address)) public getPool;

    // Events
    event LiquidityPoolCreated(address indexed tokenA, address indexed tokenB, address pool);

    // Initializer function (replaces constructor)
    function initialize(address _liquidityPoolImplementation, address _initialAuthority) public initializer {
        require(_liquidityPoolImplementation != address(0), "LiquidityPoolFactory: invalid implementation address");
        liquidityPoolImplementation = _liquidityPoolImplementation;

        __AccessManaged_init(_initialAuthority);
    }

    // Function to create a new liquidity pool
    function createLiquidityPool(address tokenA, address tokenB, address admin) external restricted returns (address) {
        require(tokenA != tokenB, "LiquidityPoolFactory: identical token addresses");
        require(tokenA != address(0) && tokenB != address(0), "LiquidityPoolFactory: invalid token addresses");
        require(getPool[tokenA][tokenB] == address(0), "LiquidityPoolFactory: pool already exists");

        // Create a new liquidity pool using the implementation
        address pool = liquidityPoolImplementation.clone();
        LiquidityPool(pool).initialize(tokenA, tokenB, admin);

        // Store the new pool's address
        getPool[tokenA][tokenB] = pool;
        getPool[tokenB][tokenA] = pool; // Handle both orders
        allPools.push(pool);

        emit LiquidityPoolCreated(tokenA, tokenB, pool);

        return pool;
    }

    // Function to get the number of all deployed pools
    function getAllPoolsLength() external view returns (uint256) {
        return allPools.length;
    }

    // Function to retrieve all deployed pools
    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }
}
