const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const InternshipRequest = require('../models/InternshipRequest');
const PDFDocument = require('pdfkit');

router.post('/requestForm', async (req, res) => {
  try {
    const {
      fullName,
      gender,
      classYear,
      companyName,
      Location,
      commencementDate,
      completionDate
    } = req.body;

    const internshipRequest = new InternshipRequest({
      fullName,
      gender,
      classYear,
      companyName,
      Location,
      commencementDate,
      completionDate
    });

    await internshipRequest.save();
    res.status(201).json(internshipRequest);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// Get all internship request forms
router.get('/listRequest', async (req, res) => {
  try {
    const internshipRequests = await InternshipRequest.find();
    res.json(internshipRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an internship request form
router.delete('/deleteRequest/:id', async (req, res) => {
  try {
    const internshipRequest = await InternshipRequest.findById(req.params.id);
    if (!internshipRequest) {
      return res.status(404).json({ message: 'Internship request form not found' });
    }
    await internshipRequest.remove();
    res.json({ message: 'Internship request form deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define the route for generating and retrieving the letter content
// router.get('/printRequest/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const internshipRequest = await InternshipRequest.findById(id);

//     if (!internshipRequest) {
//       return res.status(404).json({ error: 'Internship request not found' });
//     }

//     // Read the letter template file
//     //Get the path to the client folder
// const clientPath = path.join(__dirname, '../../client');

// // Construct the path to the LetterTemplate.jsx file
// const templatePath = path.join(clientPath, 'src/Components/LetterTemplate/LetterTemplate.jsx');

// // Read the contents of the LetterTemplate.jsx file
// const letterTemplate = fs.readFileSync(templatePath, 'utf8');
//     // Replace placeholders in the letter template with form data
//     const letterContent = letterTemplate
//       .replace('{{fullName}}', internshipRequest.fullName)
//       .replace('{{classYear}}', internshipRequest.classYear)
//       .replace('{{companyName}}', internshipRequest.companyName)
//       .replace('{{commencementDate}}', internshipRequest.commencementDate)
//       .replace('{{completionDate}}', internshipRequest.completionDate);

//     res.status(200).send(letterContent);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while generating the letter' });
//   }
// });

module.exports = router;
