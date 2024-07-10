// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/token/Token.sol";
import "../src/token/LiquidityPoolToken.sol";
import "../src/LiquidityPool.sol";
import "../src/LiquidityPoolFactory.sol";

contract DeployLiquidityPool is Script {
    address admin;
    address admin2;
    address admin3;

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
        admin2 = vm.envAddress("ADMIN_ADDRESS2");
        admin3 = vm.envAddress("ADMIN_ADDRESS3");
    }

    function run() external {
        vm.startBroadcast(admin);

        Token tokenA = new Token("Genx", "GENX", 10000000 * 10 ** 18);
        Token tokenB = new Token("Gens", "GENS", 1000000 * 10 ** 18);
        LiquidityToken liquidityToken = new LiquidityToken();

        LiquidityPoolFactory factory = new LiquidityPoolFactory(address(liquidityToken), admin, admin2, admin3);

        address pool = factory.createPool(address(tokenA), address(tokenB), admin, 30, admin2, admin3);
        console.log("Pool address: %s", pool);

        vm.stopBroadcast();
    }
}
