# 🔮 DeFutures - Decentralized Prediction Market

A full-stack decentralized prediction market platform built on Fluent Testnet. Users can create markets, place bets with ETH, and winners receive payouts automatically with a 2% platform fee.

![Fluent Testnet](https://img.shields.io/badge/Network-Fluent%20Testnet-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)

## 🌟 Features

### For Users
- 📊 Browse active prediction markets
- 💰 Place bets with ETH (0.005 - 2 ETH)
- 📈 Real-time YES/NO percentage tracking
- 🏆 Automatic payout distribution for winners
- 📱 Responsive design with dark/light mode
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

### Frontend
- **Next.js 15.5** - React framework
- **Tailwind CSS** - Styling
- **React Context API** - State management

### Backend
- **MongoDB** - Database
- **Mongoose** - ODM
- **Next.js API Routes** - RESTful API

## 📋 Prerequisites

- Node.js v16 or higher
- MetaMask browser extension
- Fluent Testnet ETH (for testing)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/rudazy/defutures.git
cd defutures/fluent-prediction-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create `.env.local` file:

```bash
MONGODB_URI=your_mongodb_connection_string

NEXT_PUBLIC_CONTRACT_ADDRESS=0x337BE1144D445486e1bEE6a2C16d99E9636CAb6A

NEXT_PUBLIC_FLUENT_RPC=https://rpc.testnet.fluent.xyz/
NEXT_PUBLIC_CHAIN_ID=20994


### 4. Run the development server

```bash
npm run dev
```



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

### Key Functions

```solidity
// Create a new market (Admin only)
function createMarket(string memory _question, uint256 _durationInSeconds)

// Place a bet
function placeBet(uint256 _marketId, Prediction _prediction) payable

// Resolve market and distribute winnings (Admin only)
function resolveMarket(uint256 _marketId, Prediction _winner)

// Cancel market and refund all (Admin only)
function cancelMarket(uint256 _marketId)
```

## 📊 API Routes

### Markets
- `GET /api/markets` - Get all markets (optional: ?status=ACTIVE)
- `GET /api/markets/[id]` - Get single market
- `POST /api/markets` - Create market (called by contract)
- `PATCH /api/markets/[id]` - Update market

### Bets
- `GET /api/bets` - Get bets (optional: ?marketId=1&userAddress=0x...)
- `POST /api/bets` - Place bet

### Stats
- `GET /api/stats` - Get platform statistics

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

## 📁 Project Structure

```
fluent-prediction-frontend/
├── app/
│   ├── admin/
│   │   └── page.js           # Admin dashboard
│   ├── api/
│   │   ├── markets/          # Market API routes
│   │   ├── bets/             # Bet API routes
│   │   └── stats/            # Stats API route
│   ├── market/
│   │   └── [id]/
│   │       └── page.js       # Market detail page
│   ├── layout.js             # Root layout
│   └── page.js               # Homepage
├── components/
│   ├── Navbar.js             # Navigation component
│   ├── MarketCard.js         # Market card component
│   └── StatsCard.js          # Stats card component
├── context/
│   └── Web3Context.js        # Web3 state management
├── lib/
│   ├── contracts/
│   │   └── PredictionMarket.json  # Contract ABI
│   ├── mongodb.js            # MongoDB connection
│   └── web3.js               # Web3 utilities
├── models/
│   ├── Market.js             # Market schema
│   ├── Bet.js                # Bet schema
│   └── User.js               # User schema
└── .env.local                # Environment variables
```

## 🔒 Security Features

- ✅ Admin-only functions for market management
- ✅ Reentrancy protection
- ✅ Bet limits enforcement (0.005 - 2 ETH)
- ✅ One bet per user per market
- ✅ Automatic winner distribution
- ✅ Safe refund mechanism for cancelled markets

## 🐛 Known Issues & Limitations

- Markets cannot be edited after creation
- No partial withdrawals (all-or-nothing bets)
- Platform fee is fixed at 2%
- Testnet only (not production-ready)

## 🚀 Future Enhancements

- [ ] Market categories (Sports, Crypto, Politics)
- [ ] User profile with bet history
- [ ] Leaderboard for top traders
- [ ] Market search and advanced filtering
- [ ] Email/push notifications for market events
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@defutures.com or join our Discord server.

## 🙏 Acknowledgments

- Fluent Network for providing testnet infrastructure
- Anthropic Claude for development assistance
- The Ethereum and Web3 community

---

**Built with ❤️ on Fluent Testnet**

