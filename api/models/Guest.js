const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  ticket: {
    type: String,
    required: true,
  },
  isTicketValid: {
    type: Boolean,
    default: false,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  tokenCreationDate: {
    type: Date,
    required: true,
  },
  ticketIssuer: {
    type: String,
    required: true,
  },
  additionalMembers: [{
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  }],
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
