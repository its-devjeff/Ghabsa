const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketCode: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tableName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  amountPaid: {
    type: Number,
    required: true,
  }
 
});

module.exports = mongoose.model('Ticket', ticketSchema);
