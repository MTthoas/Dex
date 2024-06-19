// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/LiquidityPool.sol";
import "../src/GensToken.sol";
import "@openzeppelin/contracts-upgradeable/access/manager/AccessManagerUpgradeable.sol";
import "../src/LiquidityPoolFactory.sol";

contract DeployLiquidityPool is Script {
    LiquidityPoolFactory factory;
    GensToken tokenA;
    GensToken tokenB;
    address admin;
    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
    }

    function run() public {
        vm.startBroadcast(admin);

        // Deploy mock ERC20 tokens
        tokenA = new GensToken();
        tokenA.initialize("Genesis", "GENX");
        tokenB = new GensToken();
        tokenB.initialize("Gens", "GENS");

        // Mint some tokens to the admin for testing
        tokenA.mint(admin, 1_000_000 * 10 ** 18); // 1 million tokens with 18 decimals
        tokenB.mint(admin, 1_000_000 * 10 ** 18); // 1 million tokens with 18 decimals

        // Deploy the LiquidityPoolFactory contract
        vm.stopBroadcast();
    }
}
