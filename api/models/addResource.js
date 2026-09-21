const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  coverPhoto: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
