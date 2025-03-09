# Flash Loan Hardhat Project

This repository contains a **Hardhat-based** project for developing, testing, and deploying smart contracts for flash loans.

## 🚀 Project Setup

### Prerequisites
Make sure you have the following installed:
- **Node.js** (>= 16.0.0)
- **npm** (or yarn)

### Installation
Clone the repository and install dependencies:

```sh
git clone https://github.com/yourusername/flash-loan-contract.git
cd flash-loan-contract
npm install
```

## 🛠 Hardhat Setup

### 1. Initialize Hardhat (if not already initialized)
```sh
npx hardhat
```
Choose **"Create a JavaScript project"** when prompted.

### 2. Run a Local Blockchain
Start a local Ethereum node for development:

```sh
npx hardhat node
```

### 3. Compile the Smart Contracts
```sh
npx hardhat compile
```

### 4. Deploy the Smart Contract
Modify `scripts/deploy.js` as needed, then run:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Run Tests
```sh
npx hardhat test
```

## 📂 Project Structure

```sh
/flash-loan-contract
│── contracts/         # Solidity smart contracts
│── scripts/           # Deployment scripts
│── test/              # Test files
│── hardhat.config.js  # Hardhat configuration
│── package.json       # Node.js dependencies
```

## 🌍 Deploying to a Testnet/Mainnet

To deploy to a network like **Goerli** or **Ethereum Mainnet**, update `hardhat.config.js` with your **Alchemy/Infura** API key and **private key**, then run:

```sh
npx hardhat run scripts/deploy.js --network goerli
```

## 📜 License

This project is licensed under the MIT License.

---

**Contributors:** Feel free to submit PRs! 🚀

