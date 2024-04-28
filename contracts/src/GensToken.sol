pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GensToken is ERC20 {
    // Initializes the contract and mints all tokens to the deployer
    constructor() ERC20("Geness", "GEN") {
        _mint(msg.sender, 1_000_000_000 * (10 ** uint256(decimals())));
    }
}
