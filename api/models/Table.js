const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  maxLimit: {
    type: Number,
    required: true
  },
  tableType: {
    type: String,
    enum: ['Single', 'Couple', 'Ten'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  seatsTaken: {
    type: Number,
    default: 0,
  },
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
