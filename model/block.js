
const mongoose = require('mongoose');

/**
 * Block
 *
 * Is the system representation of a block
 * that closely reflects that used on the network.
 */
const Block = mongoose.model('Block', new mongoose.Schema({
  __v: { select: false, type: Number },
  bits: { required: true, type: String },
  confirmations: { required: true, type: Number },
  createdAt: { required: true, type: Date },
  diff: { required: true, type: String },
  //hash: { index: true, required: true, type: String, unique: true },
  hash: { index: true, required: true, type: String },
  height: { index: true, required: true, type: Number },
  merkle: { required: true, type: String },
  nonce: { required: true, type: Number },
  prev: { required: true, type: String },
  size: { type: Number },
  txs: { default: [], required: true, type: [String] },
  ver: { required: true, type: Number }
}, { versionKey: false }), 'blocks');

module.exports =  Block;
