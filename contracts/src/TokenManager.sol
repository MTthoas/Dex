// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title TokenManager
 * @author ronfflex
 * @notice This contract manages the listing and delisting of tokens on the decentralized exchange (DEX) platform.
 */
contract TokenManager is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => TokenInfo) public tokenInfos;

    // Set to store listed token addresses
    EnumerableSet.AddressSet private listedTokens;

    struct TokenInfo {
        string name;
        string symbol;
        uint8 decimals;
    }

    event TokenListed(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint8 decimals
    );
    event TokenDelisted(address indexed tokenAddress);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Lists a new token on the DEX platform.
     * @param _tokenAddress The address of the token contract.
     * @param _name The name of the token.
     * @param _symbol The symbol of the token.
     * @param _decimals The number of decimals of the token.
     */
    function listToken(
        address _tokenAddress,
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) public onlyOwner {
        require(!listedTokens.contains(_tokenAddress), "Token already listed");
        require(_tokenAddress != address(0), "Invalid token address");

        listedTokens.add(_tokenAddress);
        tokenInfos[_tokenAddress] = TokenInfo(_name, _symbol, _decimals);

        emit TokenListed(_tokenAddress, _name, _symbol, _decimals);
    }

    /**
     * @notice Delists a token from the DEX platform.
     * @param _tokenAddress The address of the token contract to delist.
     */
    function delistToken(address _tokenAddress) public onlyOwner {
        require(listedTokens.contains(_tokenAddress), "Token not listed");

        listedTokens.remove(_tokenAddress);
        delete tokenInfos[_tokenAddress];

        emit TokenDelisted(_tokenAddress);
    }
}
