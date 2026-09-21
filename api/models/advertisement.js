// Advertisement model

const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isDisplayed: {
    type: Boolean,
    required: true,
    default: false,
  },
  isToggled: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
