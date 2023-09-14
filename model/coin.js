
const mongoose = require('mongoose');

/**
 * Coin
 *
 * Represents the state of the coin in general.
 */
const Coin = mongoose.model('Coin', new mongoose.Schema({
  __v: { select: false, type: Number },
  blocks: { required: true, type: Number },
  btc: { required: true, type: Number },
  cap: { required: false, type: Number },
  createdAt: { index: true, required: true, type: Date },
  diff: { required: true, type: Number },
  mnsOff: { required: false, type: Number },
  mnsOn: { required: false, type: Number },
  netHash: { required: false, type: Number },
  peers: { required: true, type: Number },
  status: { required: true, type: String },
  supply: { required: true, type: Number },
  usd: { required: true, type: Number }
}, { versionKey: false }), 'coins');

module.exports =  Coin;
