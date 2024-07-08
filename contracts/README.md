## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Deploy
1.Create wallet for deployer

```shell
$ cast wallet import deployer --interactive
```

2.Set environment variables and source them
```shell
$ source .env
```

3.Deploy AccessManager contract
```shell
$ forge script script/00_DeployAccessManager.s.sol:AccessManagerDeploymentScript --rpc-url $SEPOLIA_RPC --broadcast --verify --account deployer -vvvv
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## Setup

### Install dependencies

```shell
$ yarn install
```

### Install submodules

```shell
$ ../
$ git submodule update --init --recursive
```