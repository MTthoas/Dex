// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/token/Token.sol";
import "../src/token/LiquidityPoolToken.sol";
import "../src/LiquidityPool.sol";
import "../src/LiquidityPoolFactory.sol";

contract DeployLiquidityPool is Script {
    address admin;
    address admin2;
    address admin3;

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
        admin2 = vm.envAddress("ADMIN_ADDRESS2");
        admin3 = vm.envAddress("ADMIN_ADDRESS3");
    }

    function run() external {
        vm.startBroadcast();

        // Déploiement des tokens et de la factory comme avant
        Token tokenA = new Token("Genx", "GENX", 10000000 * 10 ** 18);
        Token tokenB = new Token("Gens", "GENS", 1000000 * 10 ** 18);
        LiquidityPoolFactory factory = new LiquidityPoolFactory();

        address poolAB = factory.createPool(address(tokenA), address(tokenB), admin, 30, admin2, admin3);

        // Mint et approbation des tokens pour le swap
        tokenA.mint(address(this), 1000 * 10 ** 18);
        tokenB.mint(address(this), 500 * 10 ** 18);
        tokenA.approve(poolAB, 1000 * 10 ** 18);
        tokenB.approve(poolAB, 500 * 10 ** 18);

        // Ajout de liquidité pour initialiser les réserves
        LiquidityPool(poolAB).addLiquidity(1000 * 10 ** 18, 500 * 10 ** 18);

        // Effectuer un swap
        performSwap(poolAB, address(tokenA), address(tokenB), 100 * 10 ** 18);

        vm.stopBroadcast();
    }

    function performSwap(address poolAddress, address tokenIn, address tokenOut, uint256 amountIn) internal {
        LiquidityPool pool = LiquidityPool(poolAddress);
        uint256 minAmountOut = calculateMinAmountOut(pool, tokenIn, amountIn);
        pool.swap(tokenIn, amountIn, minAmountOut);
    }

    function calculateMinAmountOut(LiquidityPool pool, address tokenIn, uint256 amountIn) internal returns (uint256) {
        uint256 reserveIn = pool.getReserve(tokenIn);
        uint256 reserveOut = pool.getReserve(tokenIn == pool.tokenA() ? pool.tokenB() : pool.tokenA());
        uint256 amountInWithFee = amountIn.mul(997).div(1000); // Assuming a 0.3% trading fee
        uint256 amountOut = amountInWithFee.mul(reserveOut).div(reserveIn.add(amountInWithFee));
        return amountOut;
    }
}
