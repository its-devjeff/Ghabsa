const express = require('express');
const router = express.Router();
const multer = require('multer');
const Timer = require('../models/Timer');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder where you want to store the uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, uniqueSuffix + '.' + fileExtension); // Set the filename for the uploaded file
  },
});

// Create a Multer upload instance
const upload = multer({ storage: storage });

// Create a new timer
router.post('/create-newTimer', upload.single('image'), async (req, res) => {
  try {
    const { countdownDate } = req.body;
    const imagePath = req.file.path; // Retrieve the path of the uploaded file

    // Create a new timer object
    const timer = new Timer({
      imagePath,
      countdownDate,
    });

    // Save the timer to the database
    await timer.save();

    res.status(201).json({ message: 'Timer saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving timer' });
  }
});

router.get('/all-timers', async (req, res) => {
    try {
      const timers = await Timer.find(); // Retrieve all timers from the database
      res.json(timers);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving timers' });
    }
  });
  

// Get the countdown time and image URL
router.get('/get-countdownAndImage', async (req, res) => {
  try {
    const timer = await Timer.findOne().sort({ createdAt: -1 }).exec();
    if (!timer) {
      return res.status(404).json({ error: 'No timer found' });
    }

    const { countdownDate, imagePath } = timer;
    res.json({ countdownDate, imagePath });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving countdown and image' });
  }
});
// Update an existing timer
// Update an existing timer
router.put('/update-timer/:timerId', upload.single('image'), async (req, res) => {
    try {
      const { countdownDate } = req.body;
      const imagePath = req.file ? req.file.path : ''; // Retrieve the new path of the uploaded file
  
      const timerId = req.params.timerId;
  
      // Find the existing timer by ID
      const timer = await Timer.findById(timerId);
      if (!timer) {
        return res.status(404).json({ error: 'Timer not found' });
      }
  
      // Update the timer properties
      timer.imagePath = req.file ? imagePath : timer.imagePath; // Update the image path only if a new image is provided
      timer.countdownDate = countdownDate;
  
      // Save the updated timer
      await timer.save();
  
      res.json({ message: 'Timer updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating timer' });
    }
  });
    // Delete an existing timer
  router.delete('/delete-timer/:timerId', async (req, res) => {
    try {
      const timerId = req.params.timerId;
  
      // Find the existing timer by ID
      const timer = await Timer.findById(timerId);
      if (!timer) {
        return res.status(404).json({ error: 'Timer not found' });
      }
  
      // Delete the timer
      await timer.remove();
  
      res.json({ message: 'Timer deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting timer' });
    }
  });
  
module.exports = router;
