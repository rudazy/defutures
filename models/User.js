const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  totalBets: {
    type: Number,
    default: 0
  },
  totalVolume: {
    type: String,
    default: '0'
  },
  marketsParticipated: [{
    type: Number
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);