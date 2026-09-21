const mongoose = require('mongoose');

const internshipRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  classYear: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  Location: {
    type: String,
    required: true
  },
  commencementDate: {
    type: String,
    required: true
  },
  completionDate: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const InternshipRequest = mongoose.model('InternshipRequest', internshipRequestSchema);
module.exports = InternshipRequest;
