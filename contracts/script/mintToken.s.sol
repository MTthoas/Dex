// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/token/Token.sol";

contract MintTokens is Script {
    function run() external {
        address admin = vm.envAddress("ADMIN_ADDRESS");
        address recipient = vm.envAddress("ADMIN_ADDRESS");
        uint256 amount = 1000 * 10 ** 18;

        vm.startBroadcast(admin);
        Token token = Token(vm.envAddress("TOKEN_ADDRESS"));
        token.mint(recipient, amount);
        vm.stopBroadcast();
    }
}
