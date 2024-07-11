// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";
import "../src/token/Token.sol";
import "../src/token/LiquidityPoolToken.sol";
import "../src/LiquidityPool.sol";
import "../src/LiquidityPoolFactory.sol";

contract DeployLiquidityPool is Script, Test {
    address admin;
    address admin2;
    address admin3;

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
        admin2 = vm.envAddress("ADMIN_ADDRESS2");
        admin3 = vm.envAddress("ADMIN_ADDRESS3");
    }

    function run() external {
        vm.startBroadcast(admin);

        // Deploy tokens
        Token tokenA = new Token("Genx", "GENX", 10000000 * 10 ** 18);
        Token tokenB = new Token("Gens", "GENS", 1000000 * 10 ** 18);
        Token tokenC = new Token("Donx", "DONX", 1500000 * 10 ** 18);

        // Deploy liquidity token
        LiquidityToken liquidityToken = new LiquidityToken();

        // Deploy liquidity pool factory
        LiquidityPoolFactory factory = new LiquidityPoolFactory(address(liquidityToken), admin, admin2, admin3);

        // Create liquidity pools
        factory.createPool(address(tokenA), address(tokenB), admin, 30, admin2, admin3);
        address pool = factory.createPool(address(tokenA), address(tokenC), admin, 30, admin2, admin3);

        // Mint tokens to admin account
        mintTokens(tokenA, tokenB, tokenC);

        vm.stopBroadcast();

        // Broadcasted transactions with admin as the tx.origin
        vm.startBroadcast(admin);

        // Approve the pool to spend tokens on behalf of the admin
        Token(tokenA).approve(pool, 1000 * 10 ** 18);
        Token(tokenC).approve(pool, 100 * 10 ** 18);

        // Add liquidity to pools
        addLiquidity(pool, address(tokenA), address(tokenC), 1000 * 10 ** 18, 100 * 10 ** 18);

        vm.stopBroadcast();
    }

    function mintTokens(Token tokenA, Token tokenB, Token tokenC) internal {
        // Mint tokens to the admin account
        tokenA.mint(admin, 2000 * 10 ** 18); // Mint more than needed for the test
        tokenB.mint(admin, 2000 * 10 ** 18); // Mint more than needed for the test
        tokenC.mint(admin, 2000 * 10 ** 18); // Mint more than needed for the test
    }

    function addLiquidity(
        address poolAddress,
        address tokenAAddress,
        address tokenBAddress,
        uint256 amountA,
        uint256 amountB
    ) internal {
        // Ensure the admin approves the pool to spend tokens on its behalf
        Token(tokenAAddress).approve(poolAddress, amountA);
        Token(tokenBAddress).approve(poolAddress, amountB);

        // Cast the pool address to the LiquidityPool contract
        LiquidityPool pool = LiquidityPool(poolAddress);

        // Add liquidity to the pool from the admin address
        pool.addLiquidity(amountA, amountB);
    }
}
