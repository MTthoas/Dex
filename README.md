# Decentralized Exchange

Annual project focused on creating a complete decentralized application (dApp) that simulates a digital asset exchange platform on the Ethereum blockchain. This project is designed to provide a comprehensive experience in the development of a modern, decentralized financial (DeFi) application.

## Prerequisites

- Node.js
- npm
- Wallet ( metamask / trust .. )

## Technologies

To the global web architecture we're using foundry.Foundry manages your dependencies, compiles your project, runs tests, deploys, and lets you interact with the chain from the command-line and via Solidity scripts.

1. **Smart Contracts**:

We're using Solidity to write the smart contracts and Truffle to compile, test and deploy them.

- Solidity,
- Truffle,
- TypeScript,

2. **API**:

We're using a Go API to get tokens Infos and to interact with the smart contracts. We're using Gin as a web framework, Gorm as an ORM and Go to interact with the Ethereum blockchain.

- Go,
- Gin,
- Gorm,

3. **Frontend**:

We're using React to create the frontend of the dApp. We're using TypeScript to write the code and TailwindCSS to style the components.

- React,
- TypeScript,
- TailwindCSS,
- Shadcn/ui

4. **Integration**:

We're using Docker to run the API and the smart contracts on the same network.

## Structure
```
├── contracts
│   ├── lib
│   ├── script
│   ├── src
│   └── test
│
├── api
│   ├── controller
│   ├── models
│   ├── services
│   ├── main.go
│   └── .env
│ 
└── frontend
    ├── src
    │    ├── assets 
    │    └── components
    │    └── lib
    │    └── styles
    ├── .env
    ├── tailwind.config.js
    ├── lib
    └── styles
```

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:MTthoas/Dex.git
```

### 2. Install the dependencies

```bash
cd Dex
npm install
```

### 3. Compile the smart contracts

```bash
npm run compile
```

### 4. Deploy the smart contracts

```bash
npm run deploy
```

### 5. Run frontend

```bash
cd ./frontend
npm i
npm start
```