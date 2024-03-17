// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

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
    }

    // Event to log user registration
    event UserRegistered(address indexed userAddress, uint256 userId);

    function registerUser(string memory _name) public {
        require(users[msg.sender].id == 0, "User already registered");

        uint256 userId = registeredUserIds.length() + 1;
        users[msg.sender] = User(userId, _name, false);
        registeredUserIds.add(userId);

        emit UserRegistered(msg.sender, userId);
    }

    // Check if an address is a registered user
    function isRegisteredUser(address _address) public view returns (bool) {
        return users[_address].id != 0;
    }

    // Get the user ID associated with an address
    function getUserId(address _address) public view returns (uint256) {
        return users[_address].id;
    }
}