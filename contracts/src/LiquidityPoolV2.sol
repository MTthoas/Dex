// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import { AccessManagerUpgradeable } from '@openzeppelin/contracts-upgradeable/access/manager/AccessManagerUpgradeable.sol';
import { IAccessManager } from '@openzeppelin/contracts/access/manager/IAccessManager.sol';

interface IAccessManagerExtended is IAccessManager {
    function hasRole(uint64 roleId, address account) external view returns (bool, uint32);
}

contract LiquidityPoolV2 is Initializable, ReentrancyGuardUpgradeable {
    using Math for uint256;

    // Addresses of the tokens in the liquidity pool
    address public tokenA;
    address public tokenB;
    IAccessManagerExtended public accessManager;

    // Reserves of the tokens in the liquidity pool
    uint256 private reserveA;
    uint256 private reserveB;

    // Liquidity token balances and total supply
    mapping(address => uint256) private liquidityBalances;
    uint256 private totalLiquidity;

    // Platform fee (in basis points, e.g., 30 for 0.3%)
    uint256 public platformFee;

    // Events
    event LiquidityAdded(address indexed user, uint256 tokenAAmount, uint256 tokenBAmount);
    event LiquidityRemoved(address indexed user, uint256 tokenAAmount, uint256 tokenBAmount);
    event SwapExecuted(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);

    /**
     * @notice Initializer function (replaces constructor).
     * @param _tokenA Address of the first token.
     * @param _tokenB Address of the second token.
     * @param _accessManager Address of the access manager contract.
     */
    function initialize(address _tokenA, address _tokenB, address _accessManager) public initializer {
        require(_tokenA != address(0), 'LiquidityPool: invalid tokenA address');
        require(_tokenB != address(0), 'LiquidityPool: invalid tokenB address');
        require(_accessManager != address(0), 'LiquidityPool: invalid access manager address');
        tokenA = _tokenA;
        tokenB = _tokenB;
        accessManager = IAccessManagerExtended(_accessManager);
        __ReentrancyGuard_init();

        platformFee = 20; // Default platform fee is 0.2%
    }

    /**
     * @notice Modifier to restrict function access to accounts with a specific role.
     * @param roleId ID of the required role.
     */
    modifier onlyRole(uint64 roleId) {
        (bool hasRole, ) = accessManager.hasRole(roleId, msg.sender);
        require(hasRole, 'LiquidityPool: sender must have the required role');
        _;
    }

    /**
     * @notice Function to add liquidity to the pool.
     * @param tokenAAmount Amount of tokenA to add.
     * @param tokenBAmount Amount of tokenB to add.
     */
    function addLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external onlyRole(1) nonReentrant {
        require(tokenAAmount > 0 && tokenBAmount > 0, 'LiquidityPool: amounts must be greater than zero');

        // Transfer tokens from sender to the contract
        ERC20Upgradeable(tokenA).transferFrom(msg.sender, address(this), tokenAAmount);
        ERC20Upgradeable(tokenB).transferFrom(msg.sender, address(this), tokenBAmount);

        // Calculate liquidity tokens to mint
        uint256 liquidity;
        if (totalLiquidity == 0) {
            // For the first liquidity provider, mint liquidity tokens 1:1 with the provided tokens
            liquidity = Math.sqrt(tokenAAmount * tokenBAmount);
        } else {
            // For subsequent liquidity providers, mint liquidity tokens proportionally
            uint256 amountA = (tokenAAmount * totalLiquidity) / reserveA;
            uint256 amountB = (tokenBAmount * totalLiquidity) / reserveB;
            liquidity = Math.min(amountA, amountB);
        }
        require(liquidity > 0, 'LiquidityPool: insufficient liquidity minted');

        // Update reserves and mint liquidity tokens
        _updateReserves();
        liquidityBalances[msg.sender] += liquidity;
        totalLiquidity += liquidity;

        emit LiquidityAdded(msg.sender, tokenAAmount, tokenBAmount);
    }

    /**
     * @notice Function to remove liquidity from the pool.
     * @param liquidityTokens Amount of liquidity tokens to remove.
     */
    function removeLiquidity(uint256 liquidityTokens) external onlyRole(1) nonReentrant {
        require(liquidityTokens > 0, 'LiquidityPool: amount must be greater than zero');
        require(liquidityBalances[msg.sender] >= liquidityTokens, 'LiquidityPool: insufficient liquidity balance');

        // Calculate amounts of tokens to return to the user
        uint256 tokenAAmount = (liquidityTokens * reserveA) / totalLiquidity;
        uint256 tokenBAmount = (liquidityTokens * reserveB) / totalLiquidity;

        require(tokenAAmount > 0 && tokenBAmount > 0, 'LiquidityPool: insufficient token amounts');

        // Update reserves and burn liquidity tokens
        _updateReserves();
        liquidityBalances[msg.sender] -= liquidityTokens;
        totalLiquidity -= liquidityTokens;

        // Transfer tokens back to the user
        ERC20Upgradeable(tokenA).transfer(msg.sender, tokenAAmount);
        ERC20Upgradeable(tokenB).transfer(msg.sender, tokenBAmount);

        emit LiquidityRemoved(msg.sender, tokenAAmount, tokenBAmount);
    }

    /**
     * @notice Function to execute a swap.
     * @param tokenIn Address of the input token.
     * @param amountIn Amount of the input token.
     * @param minAmountOut Minimum amount of the output token.
     * @param recipient Address of the recipient.
     */
    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient
    ) external onlyRole(1) nonReentrant {
        require(amountIn > 0, 'LiquidityPool: amount must be greater than zero');
        require(tokenIn == tokenA || tokenIn == tokenB, 'LiquidityPool: invalid token address');

        address tokenOut = (tokenIn == tokenA) ? tokenB : tokenA;
        uint256 reserveIn = (tokenIn == tokenA) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == tokenA) ? reserveB : reserveA;

        // Transfer the input tokens from the user to the contract
        ERC20Upgradeable(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Calculate the output amount using the constant product formula, adjusted for the platform fee
        uint256 amountInWithFee = (amountIn * (10000 - platformFee)) / 10000;
        uint256 amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        require(amountOut >= minAmountOut, 'LiquidityPool: insufficient output amount');

        // Transfer the output tokens to the recipient
        ERC20Upgradeable(tokenOut).transfer(recipient, amountOut);

        // Update reserves
        _updateReserves();

        emit SwapExecuted(msg.sender, tokenIn, amountIn, tokenOut, amountOut);
    }

    /**
     * @notice Function to get the current reserves of the pool.
     * @return Reserves of tokenA and tokenB.
     */
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    /**
     * @notice Function to get the price of a token amount in the other token.
     * @param tokenIn Address of the input token.
     * @param amountIn Amount of the input token.
     * @return Amount of the output token.
     */
    function getPrice(address tokenIn, uint256 amountIn) external view returns (uint256) {
        require(tokenIn == tokenA || tokenIn == tokenB, 'LiquidityPool: invalid token address');

        uint256 reserveIn = (tokenIn == tokenA) ? reserveA : reserveB;
        uint256 reserveOut = (tokenIn == tokenA) ? reserveB : reserveA;

        uint256 amountInWithFee = (amountIn * (10000 - platformFee)) / 10000;
        uint256 amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        return amountOut;
    }

    /**
     * @notice Function to update the platform fee.
     * @param newFee New platform fee in basis points.
     */
    function updatePlatformFee(uint256 newFee) external onlyRole(0) {
        platformFee = newFee;
    }

    /**
     * @notice Internal function to update reserves based on the actual balances of tokens in the contract.
     */
    function _updateReserves() internal {
        reserveA = ERC20Upgradeable(tokenA).balanceOf(address(this));
        reserveB = ERC20Upgradeable(tokenB).balanceOf(address(this));
    }
}
