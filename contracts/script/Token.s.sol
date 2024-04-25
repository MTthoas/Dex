// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Token.sol";

contract DeployToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Déployer le contrat Token avec un approvisionnement initial
        uint256 initialSupply = 1e6 * 10 ** 10; // 1 million de tokens, ajustez selon les besoins
        Token token = new Token(initialSupply);

        console.log("Token deployed to: %s", address(token));

        vm.stopBroadcast();
    }
}
