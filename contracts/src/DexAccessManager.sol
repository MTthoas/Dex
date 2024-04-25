// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/manager/AccessManager.sol";

/**
 * @title DexAccessManager
 * @author ronfflex
 * @notice This contract manages access control for the decentralized exchange (DEX) platform.
 */
contract DexAccessManager is AccessManager {
    constructor(address initialAdmin) AccessManager(initialAdmin) {}
}