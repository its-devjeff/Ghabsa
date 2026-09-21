const createError  = require('../utils/error')
const multer = require('multer');
const router = require('express').Router();
const path = require('path');
const fs = require('fs');

// Import the Upload model
const Upload = require('../models/addResource');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + '-' + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// File upload route
router.post('/upload', upload.fields([{ name: 'file' }, { name: 'coverPhoto' }]), (req, res) => {
  const files = req.files;
  const file = files['file'] ? files['file'][0] : null;
  const coverPhoto = files['coverPhoto'] ? files['coverPhoto'][0] : null;
  const level = req.body.level || '';
  const course = req.body.course || '';
  const title = req.body.title || '';
  const category = req.body.category || '';

  // Check if the files exist in the request
  if (!file || !coverPhoto) {
    res.status(400).json({ success: false, message: 'File or cover photo is missing in the request' });
    return;
  }

  // Create a new instance of the Upload model
  const upload = new Upload({
    file: file.path,
    coverPhoto: coverPhoto.path,
    level,
    course,
    title,
    category,
  });

  // Save the upload to MongoDB
  upload
    .save()
    .then((result) => {
      console.log('Upload saved:', result);
      res.json({ success: true, message: 'Upload successful' });
    })
    .catch((error) => {
      console.error('Error saving upload:', error);
      // Delete the uploaded files if an error occurred during saving
      fs.unlinkSync(file.path);
      fs.unlinkSync(coverPhoto.path);
      res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    });
});

// Search route
router.get('/search', (req, res) => {
  const { title, course } = req.query;

  // Construct the search query based on the provided parameters
  const query = {};

  if (title) {
    query.title = { $regex: title, $options: 'i' }; // Case-insensitive search for title
  }

  if (course) {
    query.course = { $regex: course, $options: 'i' }; // Case-insensitive search for course
  }

  // Perform the search using the constructed query
  Upload.find({ $or: [{ title: query.title }, { course: query.course }] })
    .then((results) => {
      results.forEach((result) => {
        result.fileSize = parseInt(result.fileSize); // Convert the fileSize to
      });
      res.json({ success: true, results });
      })
      .catch((error) => {
      console.error('Error searching files:', error);
      res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
      });
      });
      
      // Download route
      router.get('/download/:id', (req, res) => {
        const fileId = req.params.id;
      
        // Find the file in the database by its ID
        Upload.findById(fileId)
          .then((file) => {
            if (!file) {
              return res.status(404).json({ success: false, message: 'File not found' });
            }
            const filePath = file.file; // Retrieve the file path from the database
            const fileName = path.basename(filePath); // Extract the file name from the file path
      
            // Send the file to the client for download
            res.download(filePath, fileName, (error) => {
              if (error) {
                console.error('Error downloading file:', error);
                res.status(500).json({ success: false, message: 'An error occurred during download' });
              }
            });
          })
          .catch((error) => {
            console.error('Error finding file:', error);
            res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
          });
      });

  module.exports = router;    