// timer.js

const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: true,
  },
  countdownDate: {
    type: Date,
    required: true,
  },
});

const Timer = mongoose.model('Timer', timerSchema);

module.exports = Timer;
