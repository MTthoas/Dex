// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";

contract DeployUserRegistry is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        UserRegistry userRegistry = new UserRegistry();

        vm.stopBroadcast();

        // Output the address
        console.log("UserRegistry deployed to:", address(userRegistry));
    }
}
