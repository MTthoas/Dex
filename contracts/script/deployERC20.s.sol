// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/token/Token.sol";

contract deployERC20 is Script {
    address admin;

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
    }

    function run() external {
        vm.startBroadcast(admin);
        new Token("TKA", "TOKENA", 24000000 * 10 ** 18);
        vm.stopBroadcast();
    }
}