// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/token/Token.sol";
import "../src/token/LiquidityPoolToken.sol";
import "../src/LiquidityPool.sol";

contract LiquidityPoolTest is Test {
    Token tokenA;
    Token tokenB;
    LiquidityToken liquidityToken;
    LiquidityPool liquidityPool;
    address owner = address(0x123);
    address admin1 = address(0x456);
    address admin2 = address(0x789);
    address addr1 = address(0x234);
    address addr2 = address(0x567);

    function setUp() public {
        tokenA = new Token("TokenA", "TKA", 1000 ether);
        tokenB = new Token("TokenB", "TKB", 1000 ether);
        liquidityToken = new LiquidityToken();

        liquidityPool = new LiquidityPool();

        // Ensure the owner calls the initialize function
        vm.prank(owner);
        liquidityPool.initialize(address(tokenA), address(tokenB), address(liquidityToken), 30, 10, owner);

        // Mint and approve tokens
        tokenA.mint(addr1, 1000 ether);
        tokenB.mint(addr1, 1000 ether);
        vm.prank(addr1);
        tokenA.approve(address(liquidityPool), 1000 ether);
        vm.prank(addr1);
        tokenB.approve(address(liquidityPool), 1000 ether);

        tokenA.mint(addr2, 1000 ether);
        tokenB.mint(addr2, 1000 ether);
        vm.prank(addr2);
        tokenA.approve(address(liquidityPool), 1000 ether);
        vm.prank(addr2);
        tokenB.approve(address(liquidityPool), 1000 ether);
    }

    function testDeployment() public {
        assertEq(address(liquidityPool.tokenA()), address(tokenA));
        assertEq(address(liquidityPool.tokenB()), address(tokenB));
        assertEq(address(liquidityPool.liquidityToken()), address(liquidityToken));
    }

    function testAddLiquidity() public {
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        assertEq(tokenA.balanceOf(address(liquidityPool)), 100 ether);
        assertEq(tokenB.balanceOf(address(liquidityPool)), 100 ether);
    }

    function testRemoveLiquidity() public {
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        vm.prank(addr1);
        liquidityPool.removeLiquidity(10 ether);

        uint256 expectedTokenABalance = 90 ether;
        uint256 expectedTokenBBalance = 90 ether;
        uint256 actualTokenABalance = tokenA.balanceOf(address(liquidityPool));
        uint256 actualTokenBBalance = tokenB.balanceOf(address(liquidityPool));

        uint256 tolerance = 1 wei;

        assertTrue(
            actualTokenABalance >= expectedTokenABalance - tolerance &&
                actualTokenABalance <= expectedTokenABalance + tolerance,
            string(abi.encodePacked("Token A balance mismatch: ", actualTokenABalance))
        );

        assertTrue(
            actualTokenBBalance >= expectedTokenBBalance - tolerance &&
                actualTokenBBalance <= expectedTokenBBalance + tolerance,
            string(abi.encodePacked("Token B balance mismatch: ", actualTokenBBalance))
        );
    }

    function testSwap() public {
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        vm.prank(addr2);
        liquidityPool.swap(address(tokenA), 10 ether, 1);

        assertGt(tokenB.balanceOf(addr2), 0);
    }

    function testCalculateRewards() public {
        // Adding liquidity by addr1 and addr2
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        vm.prank(addr2);
        liquidityPool.addLiquidity(200 ether, 200 ether);

        (uint256 rewardA1, uint256 rewardB1) = liquidityPool.calculateRewards(addr1);
        (uint256 rewardA2, uint256 rewardB2) = liquidityPool.calculateRewards(addr2);

        assertGt(rewardA1, 0);
        assertGt(rewardB1, 0);
        assertGt(rewardA2, 0);
        assertGt(rewardB2, 0);
    }

    function testClaimRewards() public {
        // Adding liquidity by addr1
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        // Adding liquidity by addr2
        vm.prank(addr2);
        liquidityPool.addLiquidity(200 ether, 200 ether);

        // Claim rewards by addr1
        vm.prank(addr1);
        liquidityPool.claimRewards();

        // Claim rewards by addr2
        vm.prank(addr2);
        liquidityPool.claimRewards();

        (uint256 rewardA1, uint256 rewardB1) = liquidityPool.calculateRewards(addr1);
        (uint256 rewardA2, uint256 rewardB2) = liquidityPool.calculateRewards(addr2);

        assertEq(rewardA1, 0);
        assertEq(rewardB1, 0);
        assertEq(rewardA2, 0);
        assertEq(rewardB2, 0);
    }

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) private view returns (uint256) {
        uint256 amountInWithFee = (amountIn * (10000 - liquidityPool.platformFee())) / 10000;
        return (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
    }

    function testSwapAndCheckRatios() public {
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        // Calculer le ratio initial
        (uint256 initialReserveA, uint256 initialReserveB) = liquidityPool.getReserves();
        uint256 initialRatio = (initialReserveA * 1000) / initialReserveB;

        // Effectuer un swap
        vm.prank(addr2);
        liquidityPool.swap(address(tokenA), 10 ether, 1);

        // Vérifier les nouvelles réserves
        (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        uint256 newRatio = (reserveA * 1000) / reserveB;

        // Les ratios ne doivent pas nécessairement être égaux mais devraient suivre une certaine logique basée sur la formule du swap
        // Par exemple, vérifier si les ratios ont changé dans la direction attendue
        assertTrue(newRatio > initialRatio, "The ratio should have changed due to the swap");

        // Vous pouvez aussi calculer ce que vous attendez comme nouvelles réserves basées sur la formule de swap
        uint256 expectedReserveA = initialReserveA + 10 ether; // tokenA in
        uint256 amountOut = getAmountOut(10 ether, initialReserveA, initialReserveB);
        uint256 expectedReserveB = initialReserveB - amountOut; // tokenB out

        // Appliquer la tolérance pour la vérification
        uint256 tolerance = 1 wei;

        assertTrue(
            reserveA >= expectedReserveA - tolerance && reserveA <= expectedReserveA + tolerance,
            string(abi.encodePacked("Token A reserve mismatch: ", reserveA))
        );

        assertTrue(
            reserveB >= expectedReserveB - tolerance && reserveB <= expectedReserveB + tolerance,
            string(abi.encodePacked("Token B reserve mismatch: ", reserveB))
        );
    }
}
