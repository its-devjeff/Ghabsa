const mongoose = require('mongoose');

const trendySchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
});

const Trendy = mongoose.model('Trendy', trendySchema);

module.exports = Trendy;
