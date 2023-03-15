const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  version: { type: String },
  artist: { type: String },
  isrc: { type: String, required: true },
  pLine: { type: String },
  aliases: [{ type: String }],
  contractId: { type: mongoose.Schema.Types.Mixed,  },
});
const Contract = mongoose.model('Contract', contractSchema);
const Track = mongoose.model('Track', trackSchema);

module.exports = { Contract, Track };
