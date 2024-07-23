// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/token/Token.sol";
import "../src/token/LiquidityPoolToken.sol";
import "../src/LiquidityPool.sol";
import "../src/LiquidityPoolFactory.sol";

contract deployERC20 is Script {
    address admin;

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
    }

    function run() external {
        vm.startBroadcast(admin);
        Token tokenA = new Token("Helder", "PORTO", 24000000 * 10 ** 18);
        vm.stopBroadcast();
    }
}
