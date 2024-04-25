// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/DexAccessManager.sol";

contract DexAccessManagerScript is Script {
    function run() external {
        vm.startBroadcast();

        address initialAdmin = msg.sender;
        AccessManager accessManager = new AccessManager(initialAdmin);

        console.log("AccessManager deployed at:", address(accessManager));
        vm.stopBroadcast();
    }
}