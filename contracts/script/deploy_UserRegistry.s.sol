// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";

contract DeployUserRegistry is Script {
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

        UserRegistry userRegistry = new UserRegistry(admin, admin2, admin3);

        vm.stopBroadcast();

        console.log("UserRegistry deployed at:", address(userRegistry));
    }
}
