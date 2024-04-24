// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title UserRegistry
 * @dev This contract manages user registration, authentication, and administration for a decentralized exchange (DEX) platform.
 */
contract UserRegistry is Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    mapping(address => User) public users;
    EnumerableSet.UintSet private registeredUserIds;

    struct User {
        uint256 id;
        bool isBanned;
    }

    // Events to log
    event UserRegistered(address indexed userAddress, uint256 userId);
    event UserBanned(address indexed userAddress, uint256 userId);
    event UserUnbanned(address indexed userAddress, uint256 userId);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Gets the user IDs of all registered users.
     * @return uint256[] An array of user IDs.
     */
    function getRegisteredUserIds() public view returns (uint256[] memory) {
        return registeredUserIds.values();
    }

    /**
     * @notice Registers a new user.
     */
    function registerUser() public {
        require(users[msg.sender].id == 0, "User already registered");

        uint256 userId = registeredUserIds.length() + 1;
        users[msg.sender] = User(userId, false);
        registeredUserIds.add(userId);

        emit UserRegistered(msg.sender, userId);
    }

    /**
     * @notice Checks if the given address is a registered user.
     * @param _address The address to check.
     * @return bool True if the address is a registered user, false otherwise.
     */
    function isRegisteredUser(address _address) public view returns (bool) {
        return users[_address].id != 0;
    }

    /**
     * @notice Gets the user ID associated with the given address.
     * @param _address The address of the user.
     * @return uint256 The user ID.
     */
    function getUserId(address _address) public view returns (uint256) {
        return users[_address].id;
    }

    /**
     * @notice Bans the user with the given address.
     * @param _userAddress The address of the user to ban.
     */
    function banUser(address _userAddress) public onlyOwner {
        require(isRegisteredUser(_userAddress), "User not registered");

        users[_userAddress].isBanned = true;
        emit UserBanned(_userAddress, users[_userAddress].id);
    }

    /**
     * @notice Unbans the user with the given address.
     * @param _userAddress The address of the user to unban.
     */
    function unbanUser(address _userAddress) public onlyOwner {
        require(isRegisteredUser(_userAddress), "User not registered");
        require(users[_userAddress].isBanned, "User not banned");

        users[_userAddress].isBanned = false;
        emit UserUnbanned(_userAddress, users[_userAddress].id);
    }

    /**
     * @notice Checks if the given user is banned.
     * @param _userAddress The address of the user.
     * @return bool True if the user is banned, false otherwise.
     */
    function isUserBanned(address _userAddress) public view returns (bool) {
        return isRegisteredUser(_userAddress) && users[_userAddress].isBanned;
    }

    /**
     * @notice Transfers the user ID from the old address to the new address.
     * @param _oldAddress The old address of the user.
     * @param _newAddress The new address of the user.
     */
    function transferUserId(address _oldAddress, address _newAddress) public onlyOwner {
        require(isRegisteredUser(_oldAddress), "Old address not registered");
        require(!isRegisteredUser(_newAddress), "New address already registered");

        uint256 userId = users[_oldAddress].id;

        delete users[_oldAddress];
        users[_newAddress] = User(userId, false);

        emit UserRegistered(_newAddress, userId);
    }
}
