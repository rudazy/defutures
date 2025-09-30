const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema({
  marketId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  question: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'ENDED', 'RESOLVED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  totalYesAmount: {
    type: String,
    default: '0'
  },
  totalNoAmount: {
    type: String,
    default: '0'
  },
  totalVolume: {
    type: String,
    default: '0'
  },
  participantCount: {
    type: Number,
    default: 0
  },
  resolved: {
    type: Boolean,
    default: false
  },
  winner: {
    type: String,
    enum: ['YES', 'NO', null],
    default: null
  },
  contractAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

MarketSchema.virtual('yesPercentage').get(function() {
  const total = parseFloat(this.totalYesAmount) + parseFloat(this.totalNoAmount);
  if (total === 0) return 50;
  return ((parseFloat(this.totalYesAmount) / total) * 100).toFixed(2);
});

MarketSchema.virtual('noPercentage').get(function() {
  const total = parseFloat(this.totalYesAmount) + parseFloat(this.totalNoAmount);
  if (total === 0) return 50;
  return ((parseFloat(this.totalNoAmount) / total) * 100).toFixed(2);
});

MarketSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.models.Market || mongoose.model('Market', MarketSchema);