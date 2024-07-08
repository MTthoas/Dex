// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Roles (library)
 * @author ronfflex
 * @notice This library contains the roles used in the AccessManager contract.
 */
library Roles {
    uint64 internal constant ADMIN_ROLE = 0;
    uint64 internal constant UPGRADE_ROLE = 1;
    uint64 internal constant REGISTRY_ROLE = 2;
}
