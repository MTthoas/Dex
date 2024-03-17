// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract UserRegistry is Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    mapping(address => User) public users;

    // Set to store registered user IDs
    EnumerableSet.UintSet private registeredUserIds;

    struct User {
        uint256 id;
        string name;
        bool isBanned;
    }

    constructor() Ownable(msg.sender) {}

    // Events to log
    event UserRegistered(address indexed userAddress, uint256 userId);
    event UserBanned(address indexed userAddress, uint256 userId);
    event UserUnbanned(address indexed userAddress, uint256 userId);

    function getRegisteredUserIds() public view returns (uint256[] memory) {
        return registeredUserIds.values();
    }

    function registerUser(string memory _name) public {
        require(users[msg.sender].id == 0, "User already registered");

        uint256 userId = registeredUserIds.length() + 1;
        users[msg.sender] = User(userId, _name, false);
        registeredUserIds.add(userId);

        emit UserRegistered(msg.sender, userId);
    }

    function isRegisteredUser(address _address) public view returns (bool) {
        return users[_address].id != 0;
    }

    function getUserId(address _address) public view returns (uint256) {
        return users[_address].id;
    }

    function banUser(address _userAddress) public onlyOwner {
        require(isRegisteredUser(_userAddress), "User not registered");

        users[_userAddress].isBanned = true;

        emit UserBanned(_userAddress, users[_userAddress].id);
    }

    function unbanUser(address _userAddress) public onlyOwner {
        require(isRegisteredUser(_userAddress), "User not registered");
        require(users[_userAddress].isBanned, "User not banned");

        users[_userAddress].isBanned = false;

        emit UserUnbanned(_userAddress, users[_userAddress].id);
    }

    function isUserBanned(address _userAddress) public view returns (bool) {
        return isRegisteredUser(_userAddress) && users[_userAddress].isBanned;
    }

    function transferUserId(address _oldAddress, address _newAddress) public onlyOwner {
        require(isRegisteredUser(_oldAddress), "Old address not registered");
        require(!isRegisteredUser(_newAddress), "New address already registered");

        uint256 userId = users[_oldAddress].id;
        string memory name = users[_oldAddress].name;

        delete users[_oldAddress];
        users[_newAddress] = User(userId, name, false);

        emit UserRegistered(_newAddress, userId);
    }
}