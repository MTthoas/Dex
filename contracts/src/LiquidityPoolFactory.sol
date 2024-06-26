pragma solidity ^0.8.0;

import "./LiquidityPool.sol";

contract LiquidityPoolFactory {
    address public gensTokenAddress;
    address[] public allPools;

    constructor(address _gensTokenAddress) {
        gensTokenAddress = _gensTokenAddress;
    }

    function createLiquidityPool() external {
        LiquidityPool newPool = new LiquidityPool(gensTokenAddress);
        allPools.push(address(newPool));
    }

    function getNumberOfPools() external view returns (uint) {
        return allPools.length;
    }

    function getPoolAddress(uint _index) external view returns (address) {
        return allPools[_index];
    }
}
