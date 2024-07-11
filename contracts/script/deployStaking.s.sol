// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Staking.sol";

contract deployStaking is Script {
    address admin;

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
    }

    function run() external {
        vm.startBroadcast(admin);
        new Staking(vm.envAddress("TOKEN_ADDRESS"));
        vm.stopBroadcast();
    }
}