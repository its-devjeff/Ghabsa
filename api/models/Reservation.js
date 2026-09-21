const mongoose = require('mongoose');


const reservationSchema = new mongoose.Schema({
  tableName: { type: String, required: true },
  priceToBePaid: { type: Number, required: true },
  username: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  additionalGuests: [
    {
      guestName: { type: String },
      contact: { type: String },
      email: { type: String },
    },
  ],
  dateCreated: { type: Date, default: Date.now },
  hasPaid: { type: Boolean, default: false },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
