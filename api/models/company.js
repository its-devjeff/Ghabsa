
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyLocation: { type: String, required: true },
  internLimit: { type: Number, required: true },
  type: { type: String, required: true }, // New field 'type'
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
