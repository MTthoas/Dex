// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/manager/AccessManager.sol";

abstract contract AccessManagerHelpers {
    function _setUpRole(
        AccessManager manager,
        uint64 roleId,
        uint32 executionDelay,
        address account,
        uint64 adminId,
        address admin,
        uint32 adminExecutionDelay,
        uint64 guardianId,
        address guardian,
        uint32 guardianExecutionDelay,
        string memory label
    ) internal {
        _grantMissingRole(manager, roleId, account, executionDelay);
        manager.labelRole(roleId, label);

        manager.setRoleGuardian(roleId, guardianId);
        _grantMissingRole(manager, guardianId, guardian, guardianExecutionDelay);

        manager.setRoleAdmin(roleId, adminId);
        _grantMissingRole(manager, adminId, admin, adminExecutionDelay);
    }

    function _grantMissingRole(AccessManager manager, uint64 roleId, address account, uint32 executionDelay) internal {
        (bool isMember, ) = manager.hasRole(roleId, account);
        if (!isMember) {
            manager.grantRole(roleId, account, executionDelay);
        }
    }

    function _asSingletonArray(bytes4 element) internal pure returns (bytes4[] memory) {
        bytes4[] memory array = new bytes4[](1);
        array[0] = element;

        return array;
    }
}
