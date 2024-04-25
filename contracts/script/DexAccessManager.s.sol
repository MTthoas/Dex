// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/DexAccessManager.sol";
import "../src/UserRegistry.sol";

contract DeployDexContracts is Script {
    function run() external {
        // Deploy the AccessManager
        address initialAdmin = msg.sender; // or any other admin address
        DexAccessManager dexAccessManager = new DexAccessManager(initialAdmin);
        console.log("DexAccessManager deployed to:", address(dexAccessManager));

        // Deploy the UserRegistry
        UserRegistry userRegistry = new UserRegistry(address(dexAccessManager));
        console.log("UserRegistry deployed to:", address(userRegistry));
    }
}