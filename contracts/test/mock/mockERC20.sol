// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';

contract MockERC20 is ERC20Upgradeable {
    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
