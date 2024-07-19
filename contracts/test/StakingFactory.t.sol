// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/StakingFactory.sol";
import "../src/token/Token.sol";

contract StakingFactoryTest is Test {
    Token token;
    StakingFactory factory;
    address user = address(0x123);
    uint256 initialRewardReserve = 1000 ether;

    function setUp() public {
        token = new Token("Test Token", "TST", 10000 ether);
        factory = new StakingFactory();
    }

    function testCreateStakingContract() public {
        // Créer un nouveau contrat de staking
        address stakingAddress = factory.createStakingContract(address(token), initialRewardReserve);
        
        // Vérifier que l'adresse du nouveau contrat est correcte
        assertTrue(stakingAddress != address(0));

        // Vérifier que le nouveau contrat de staking est ajouté au tableau
        address[] memory stakingContracts = factory.getAllStakingContracts();
        assertEq(stakingContracts.length, 1);
        assertEq(stakingContracts[0], stakingAddress);
        
        // Vérifier que le token de staking est correctement initialisé
        Staking staking = Staking(stakingAddress);
        assertEq(address(staking.stakingToken()), address(token));
        assertEq(staking.rewardReserve(), initialRewardReserve);
    }

    function testStakeThroughFactoryCreatedContract() public {
        // Créer un nouveau contrat de staking
        address stakingAddress = factory.createStakingContract(address(token), initialRewardReserve);
        Staking staking = Staking(stakingAddress);

        // Transférer des tokens à l'utilisateur
        token.transfer(user, 100 ether);
        
        // Utilisateur stake des tokens
        vm.startPrank(user);
        token.approve(stakingAddress, 50 ether);
        staking.stake(50 ether);

        // Vérifier les montants stakés
        assertEq(staking.getStakedAmount(user), 50 ether);
        assertEq(token.balanceOf(user), 50 ether);
        assertEq(token.balanceOf(stakingAddress), 50 ether);
        vm.stopPrank();
    }

    function testUnstakeThroughFactoryCreatedContract() public {
        // Créer un nouveau contrat de staking
        address stakingAddress = factory.createStakingContract(address(token), initialRewardReserve);
        Staking staking = Staking(stakingAddress);

        // Transférer des tokens à l'utilisateur
        token.transfer(user, 100 ether);
        
        // Utilisateur stake des tokens
        vm.startPrank(user);
        token.approve(stakingAddress, 50 ether);
        staking.stake(50 ether);
        
        // Avancer dans le temps
        vm.warp(block.timestamp + 1 days);

        // Utilisateur unstake des tokens
        staking.unstake(50 ether);

        // Vérifier les montants après unstaking
        assertEq(staking.getStakedAmount(user), 0);
        assertEq(token.balanceOf(user), 100 ether);
        assertEq(token.balanceOf(stakingAddress), 0);
        vm.stopPrank();
    }

    function testPendingRewardsThroughFactoryCreatedContract() public {
        // Créer un nouveau contrat de staking
        address stakingAddress = factory.createStakingContract(address(token), initialRewardReserve);
        Staking staking = Staking(stakingAddress);

        // Transférer des tokens à l'utilisateur
        token.transfer(user, 100 ether);
        
        // Utilisateur stake des tokens
        vm.startPrank(user);
        token.approve(stakingAddress, 50 ether);
        staking.stake(50 ether);

        // Vérifier les montants stakés
        assertEq(staking.getStakedAmount(user), 50 ether);

        // Avancer dans le temps
        vm.warp(block.timestamp + 1 days);

        // Vérifier les récompenses en attente
        uint256 pending = staking.pendingRewards(user);
        console.log("Pending rewards:", pending);  // Log pending rewards
        assertEq(pending, 50 ether * 1 / 100); // 1% de 50 ether
        vm.stopPrank();
    }

    function testGetAllStakingStats() public {
        // Créer deux nouveaux contrats de staking
        address stakingAddress1 = factory.createStakingContract(address(token), initialRewardReserve);
        address stakingAddress2 = factory.createStakingContract(address(token), initialRewardReserve);
        Staking staking1 = Staking(stakingAddress1);
        Staking staking2 = Staking(stakingAddress2);

        // Transférer des tokens à l'utilisateur
        token.transfer(user, 200 ether);

        // Utilisateur stake des tokens dans les deux contrats de staking
        vm.startPrank(user);
        token.approve(stakingAddress1, 100 ether);
        token.approve(stakingAddress2, 100 ether);
        staking1.stake(50 ether);
        staking2.stake(50 ether);
        vm.stopPrank();

        // Avancer dans le temps pour accumuler des récompenses
        vm.warp(block.timestamp + 1 days);

        // Vérifier les montants stakés dans chaque contrat
        assertEq(staking1.getStakedAmount(user), 50 ether);
        assertEq(staking2.getStakedAmount(user), 50 ether);

        // Vérifier les statistiques globales de staking
        (uint256 totalStaked, uint256 totalRewardRate) = factory.getAllStakingStats();
        assertEq(totalStaked, 100 ether);
        assertEq(totalRewardRate, 200);
    }
}
