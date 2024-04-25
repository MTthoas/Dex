// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/manager/AccessManaged.sol";

/**
 * @title TokenManager
 * @author ronfflex
 * @notice This contract manages the listing and delisting of tokens on the decentralized exchange (DEX) platform.
 */
contract TokenManager is AccessManaged {
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

    constructor(address accessManager) AccessManaged(accessManager) { }

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
    ) public restricted {
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
    function delistToken(address _tokenAddress) public restricted {
        require(listedTokens.contains(_tokenAddress), "Token not listed");

        listedTokens.remove(_tokenAddress);
        delete tokenInfos[_tokenAddress];

        emit TokenDelisted(_tokenAddress);
    }

    /**
     * @notice Retrieves the token information for a given token address.
     * @param _tokenAddress The address of the token contract.
     * @return name The name of the token.
     * @return symbol The symbol of the token.
     * @return decimals The number of decimals of the token.
     */
    function getTokenInfo(
        address _tokenAddress
    )
        public
        view
        returns (string memory name, string memory symbol, uint8 decimals)
    {
        require(listedTokens.contains(_tokenAddress), "Token not listed");
        TokenInfo memory info = tokenInfos[_tokenAddress];
        return (info.name, info.symbol, info.decimals);
    }

    /**
     * @notice Retrieves the list of listed token addresses.
     * @return tokens An array of listed token addresses.
     */
    function getListedTokens() public view returns (address[] memory tokens) {
        uint256 count = listedTokens.length();
        tokens = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            tokens[i] = listedTokens.at(i);
        }
    }
}
