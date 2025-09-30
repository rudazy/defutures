const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  marketId: {
    type: Number,
    required: true,
    index: true
  },
  userAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  amount: {
    type: String,
    required: true
  },
  prediction: {
    type: String,
    enum: ['YES', 'NO'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  claimed: {
    type: Boolean,
    default: false
  },
  winnings: {
    type: String,
    default: '0'
  }
}, {
  timestamps: true
});

BetSchema.index({ marketId: 1, userAddress: 1 });

module.exports = mongoose.models.Bet || mongoose.model('Bet', BetSchema);