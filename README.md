# 🔮 DeFutures - Decentralized Prediction Market

A full-stack decentralized prediction market platform built on Fluent Testnet. Users can create markets, place bets with ETH, and winners receive payouts automatically with a 2% platform fee.

## 🌟 Features

### For Users
- 📊 Browse active prediction markets
- 💰 Place bets with ETH (0.005 - 2 ETH)
- 📈 Real-time YES/NO percentage tracking
- 🏆 Automatic payout distribution for winners
- 💼 View bet history and market stats

### For Admins
- ➕ Create new prediction markets with custom duration
- ✅ Resolve markets (declare YES/NO winner)
- ❌ Cancel markets (auto-refund all participants)
- 📊 View comprehensive market statistics
- 💸 Withdraw accumulated platform fees (2%)

## 🛠️ Tech Stack

### Smart Contract
- **Solidity 0.8.20** - Smart contract development
- **Fluent Testnet** - Blockchain network
- **ethers.js** - Blockchain interaction

## 📋 Prerequisites

- Node.js v16 or higher
- MetaMask browser extension
- Fluent Testnet ETH (for testing)

## 🌐 Network Configuration

### Fluent Testnet Details

- **Network Name:** Fluent Testnet
- **RPC URL:** https://rpc.testnet.fluent.xyz/
- **Chain ID:** 20994
- **Symbol:** ETH
- **Explorer:** https://testnet.fluentscan.xyz/

### Add to MetaMask

1. Open MetaMask
2. Click Networks dropdown → Add Network
3. Enter the details above
4. Save

## 📝 Smart Contract

### Deployed Contract
- **Address:** `0x337BE1144D445486e1bEE6a2C16d99E9636CAb6A`
- **Network:** Fluent Testnet
- **Explorer:** [View on FluentScan](https://testnet.fluentscan.xyz/address/0x337BE1144D445486e1bEE6a2C16d99E9636CAb6A)



## 🎮 Usage

### Creating a Market (Admin)

1. Connect wallet (must be admin address)
2. Navigate to Admin Dashboard
3. Fill in market question and duration
4. Click "Create Market"
5. Confirm transaction in MetaMask

### Placing a Bet

1. Connect wallet with MetaMask
2. Browse markets on homepage
3. Click on a market to view details
4. Select YES or NO
5. Enter bet amount (0.005 - 2 ETH)
6. Click "Place Bet"
7. Confirm transaction

### Resolving a Market (Admin)

1. Go to Admin Dashboard
2. Find the ended market
3. Click "Resolve: YES" or "Resolve: NO"
4. Confirm transaction
5. Winners receive payouts automatically

## 💡 Platform Economics

- **Platform Fee:** 2% of total pool
- **Min Bet:** 0.005 ETH
- **Max Bet:** 2 ETH per user per market
- **One bet per user per market**
- **Winner payouts:** Proportional to bet size within winning side

### Payout Calculation Example

Total Pool: 10 ETH (6 ETH on YES, 4 ETH on NO)

If YES wins:
- Platform fee: 0.2 ETH (2%)
- Payout pool: 9.8 ETH
- User who bet 1 ETH on YES receives: (1/6) × 9.8 = 1.63 ETH

## 🔒 Security Features

- ✅ Admin-only functions for market management
- ✅ Reentrancy protection
- ✅ Bet limits enforcement (0.005 - 2 ETH)
- ✅ One bet per user per market
- ✅ Automatic winner distribution
- ✅ Safe refund mechanism for cancelled markets



## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Fluent Network for providing testnet infrastructure
- The Ethereum and Web3 community

---

**Built with ❤️ on Fluent Testnet**

