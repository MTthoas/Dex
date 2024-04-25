// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/manager/AccessManager.sol";

/**
 * @title DexAccessManager
 * @author ronfflex
 * @notice This contract manages access control for the decentralized exchange (DEX) platform.
 */
contract DexAccessManager is AccessManager {
    uint64 public constant USER_REGISTRY_ADMIN_ROLE = 1;
    uint64 public constant ASSET_MANAGER_ROLE = 2;
    uint64 public constant LIQUIDITY_MANAGER_ROLE = 3;
    uint64 public constant STAKING_MANAGER_ROLE = 4;

    constructor(address initialAdmin) AccessManager(initialAdmin) {
        // Grant the initial admin all roles (useless in production, only for testing purposes)
        grantRole(USER_REGISTRY_ADMIN_ROLE, initialAdmin, 0);
        grantRole(ASSET_MANAGER_ROLE, initialAdmin, 0);
        grantRole(LIQUIDITY_MANAGER_ROLE, initialAdmin, 0);
        grantRole(STAKING_MANAGER_ROLE, initialAdmin, 0);
    }

    /**
     * @notice Sets the target functions for the USER_REGISTRY_ADMIN_ROLE for the specified contract.
     * @param contractAddress The address of the contract to set the target functions for.
     * @param targetFunctions The target functions to set.
     */
    function setUserRegistryAdminRoleTargetFunctions(address contractAddress, bytes4[] calldata targetFunctions) public onlyAuthorized {
        setTargetFunctionRole(contractAddress, targetFunctions, USER_REGISTRY_ADMIN_ROLE);
    }

    /**
     * @notice Grants the USER_REGISTRY_ADMIN_ROLE to the specified account.
     * @param account The address to grant the role to.
     */
    function grantUserRegistryAdminRole(address account) public onlyAuthorized {
        grantRole(USER_REGISTRY_ADMIN_ROLE, account, 0);
    }

    /**
     * @notice Revokes the USER_REGISTRY_ADMIN_ROLE from the specified account.
     * @param account The address to revoke the role from.
     */
    function revokeUserRegistryAdminRole(address account) public onlyAuthorized {
        revokeRole(USER_REGISTRY_ADMIN_ROLE, account);
    }

    /**
     * @notice Sets the target functions for the ASSET_MANAGER_ROLE for the specified contract.
     * @param contractAddress The address of the contract to set the target functions for.
     * @param targetFunctions The target functions to set.
     */
    function setAssetManagerRoleTargetFunctions(address contractAddress, bytes4[] calldata targetFunctions) public onlyAuthorized {
        setTargetFunctionRole(contractAddress, targetFunctions, ASSET_MANAGER_ROLE);
    }

    /**
     * @notice Grants the ASSET_MANAGER_ROLE to the specified account.
     * @param account The address to grant the role to.
     */
    function grantAssetManagerRole(address account) public onlyAuthorized {
        grantRole(ASSET_MANAGER_ROLE, account, 0);
    }

    /**
     * @notice Revokes the ASSET_MANAGER_ROLE from the specified account.
     * @param account The address to revoke the role from.
     */
    function revokeAssetManagerRole(address account) public onlyAuthorized {
        revokeRole(ASSET_MANAGER_ROLE, account);
    }

    /**
     * @notice Sets the target functions for the LIQUIDITY_MANAGER_ROLE for the specified contract.
     * @param contractAddress The address of the contract to set the target functions for.
     * @param targetFunctions The target functions to set.
     */
    function setLiquidityManagerRoleTargetFunctions(address contractAddress, bytes4[] calldata targetFunctions) public onlyAuthorized {
        setTargetFunctionRole(contractAddress, targetFunctions, LIQUIDITY_MANAGER_ROLE);
    }

    /**
     * @notice Grants the LIQUIDITY_MANAGER_ROLE to the specified account.
     * @param account The address to grant the role to.
     */
    function grantLiquidityManagerRole(address account) public onlyAuthorized {
        grantRole(LIQUIDITY_MANAGER_ROLE, account, 0);
    }

    /**
     * @notice Revokes the LIQUIDITY_MANAGER_ROLE from the specified account.
     * @param account The address to revoke the role from.
     */
    function revokeLiquidityManagerRole(address account) public onlyAuthorized {
        revokeRole(LIQUIDITY_MANAGER_ROLE, account);
    }

    /**
     * @notice Sets the target functions for the STAKING_MANAGER_ROLE for the specified contract.
     * @param contractAddress The address of the contract to set the target functions for.
     * @param targetFunctions The target functions to set.
     */
    function setStakingManagerRoleTargetFunctions(address contractAddress, bytes4[] calldata targetFunctions) public onlyAuthorized {
        setTargetFunctionRole(contractAddress, targetFunctions, STAKING_MANAGER_ROLE);
    }

    /**
     * @notice Grants the STAKING_MANAGER_ROLE to the specified account.
     * @param account The address to grant the role to.
     */
    function grantStakingManagerRole(address account) public onlyAuthorized {
        grantRole(STAKING_MANAGER_ROLE, account, 0);
    }

    /**
     * @notice Revokes the STAKING_MANAGER_ROLE from the specified account.
     * @param account The address to revoke the role from.
     */
    function revokeStakingManagerRole(address account) public onlyAuthorized {
        revokeRole(STAKING_MANAGER_ROLE, account);
    }
}