const router = require("express").Router();
const companyController = require("../controllers/company")
// Create a new company
// routes/companyRoutes.js

router.get('/companies', async (req, res) => {
    try {
      const { type } = req.query;
      let companies;
  
      if (type) {
        // If a type is specified, filter companies by type
        companies = await companyController.getCompaniesByType(type);
      } else {
        // If no type is specified, get all companies
        companies = await companyController.getAllCompanies();
      }
  
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
router.post('/new-company', async (req, res) => {
    try {
      // Extract the necessary data from req.body, including the new 'type' field
      const { companyName, companyLocation, internLimit, type } = req.body;
  
      // Call the createCompany function to save the data to the database
      const newCompany = await companyController.createCompany({
        companyName,
        companyLocation,
        internLimit,
        type, // Include the new 'type' field
      });
  
      // Respond with the saved company data
      res.json(newCompany);
    } catch (error) {
      console.error('Error saving company:', error);
      res.status(500).json({ error: 'Failed to save company' });
    }
  });
  
  

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await companyController.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single company by ID
router.get('/companies/:id', async (req, res) => {
  try {
    const company = await companyController.getCompanyById(req.params.id);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a company by ID
router.put('/companies/:id', async (req, res) => {
  try {
    const updatedCompany = await companyController.updateCompanyById(req.params.id, req.body);
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a company by ID
router.delete('/companies/:id', async (req, res) => {
  try {
    const deletedCompany = await companyController.deleteCompanyById(req.params.id);
    res.json(deletedCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
