// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract DEX {
    struct Liquidity {
        uint256 tokenA;
        uint256 tokenB;
    }

    address[] private tokenPairs;
    mapping(address => mapping(address => Liquidity)) public pools;
    mapping(address => mapping(address => bool)) private pairExists;

    function getReserves(address tokenA, address tokenB) external view returns (uint256 reserveA, uint256 reserveB) {
        reserveA = pools[tokenA][tokenB].tokenA;
        reserveB = pools[tokenA][tokenB].tokenB;
    }

    function getAvailablePairs() external view returns (address[] memory) {
        return tokenPairs;
    }
}