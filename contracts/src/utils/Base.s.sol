// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";

abstract contract BaseScript is Script {
    /// @dev Included to enable compilation of the script without a $MNEMONIC environment variable.
    string internal constant TEST_MNEMONIC = "test test test test test test test test test test test junk";

    /// @dev Needed for the deterministic deployments.
    bytes32 internal constant ZERO_SALT = bytes32(0);

    /// @dev The address of the transaction broadcaster.
    address internal broadcaster;

    /// @dev Used to derive the broadcaster's address if $ETH_FROM is not defined.
    string internal mnemonic;

    /// @dev Get the index of the key to use.
    uint32 internal index;

    /// @dev The network where the script is being deployed.
    string internal deploymentNetwork;

    /// @dev Initializes the transaction broadcaster like this:
    ///
    /// - If $ETH_FROM is defined, use it.
    /// - Otherwise, derive the broadcaster address from $MNEMONIC.
    /// - If $MNEMONIC is not defined, default to a test mnemonic.
    ///
    /// The use case for $ETH_FROM is to specify the broadcaster key and its address via the command line.
    constructor() {
        deploymentNetwork = vm.envString("DEPLOYMENT_NETWORK");
        if (bytes(deploymentNetwork).length == 0) {
            revert("Please set DEPLOYMENT_NETWORK in .env file");
        }

        address from = vm.envOr({name: "ETH_FROM", defaultValue: address(0)});
        if (from != address(0)) {
            broadcaster = from;
        } else {
            string memory envVar = string.concat("MNEMONIC_", deploymentNetwork);
            mnemonic = vm.envOr({name: envVar, defaultValue: TEST_MNEMONIC});

            if (
                keccak256(abi.encodePacked(deploymentNetwork)) == keccak256(abi.encodePacked("MAINNET")) &&
                keccak256(abi.encodePacked(mnemonic)) == keccak256(abi.encodePacked(TEST_MNEMONIC))
            ) {
                revert("Please set MNEMONIC_MAINNET in .env file to deploy into mainnet");
            }

            string memory envVar1 = string.concat("INDEX_", deploymentNetwork);
            index = uint32(vm.envOr({name: envVar1, defaultValue: uint32(0)}));

            (broadcaster, ) = deriveRememberKey({mnemonic: mnemonic, index: index});
        }
    }

    modifier broadcast() {
        vm.startBroadcast(broadcaster);
        _;
        vm.stopBroadcast();
    }
}
