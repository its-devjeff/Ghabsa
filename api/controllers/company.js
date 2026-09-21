const Company = require('../models/company');

//const Company = require('../models/companymodel');
// Get companies by type
const getCompaniesByType = async (type) => {
    try {
      const companies = await Company.find({ type });
      return companies;
    } catch (error) {
      throw error;
    }
  };
// Create a new company
const createCompany = async (companyData) => {
    try {
      // Extract the necessary data, including the new 'type' field
      const { companyName, companyLocation, internLimit, type } = companyData;
  
      // Create a new instance of the Company model with the extracted data
      const newCompany = new Company({
        companyName,
        companyLocation,
        internLimit,
        type, // Include the new 'type' field
      });
  
      // Save the new company to the database
      await newCompany.save();
  
      // Return the newly created company
      return newCompany;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  };
  // Get all companies
  const getAllCompanies = async () => {
    try {
      const companies = await Company.find();
      return companies;
    } catch (error) {
      throw error;
    }
  };
  
// Get a single company by ID
const getCompanyById = async (companyId) => {
  try {
    const company = await Company.findById(companyId);
    return company;
  } catch (error) {
    throw error;
  }
};

// Update a company by ID
const updateCompanyById = async (companyId, updatedData) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(companyId, updatedData, {
      new: true,
      runValidators: true,
    });
    return updatedCompany;
  } catch (error) {
    throw error;
  }
};

// Delete a company by ID
const deleteCompanyById = async (companyId) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(companyId);
    return deletedCompany;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
  getCompaniesByType,
};
