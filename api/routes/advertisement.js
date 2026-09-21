const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Advertisement = require('../models/advertisement');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'adverts/'); // save files to uploads directory
      },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // set unique filename
    }
  });
  
  // Set up multer upload
  const upload = multer({ storage: storage });
  
// Backend route to create a new advertisement
router.post('/Newadvert', upload.single('image'), async (req, res) => {
    try {
      const newAdvertisement = new Advertisement({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.file.filename, // use the filename in the database
        isToggled: req.body.isToggled,
        isDisplayed: req.body.isDisplayed
      });
      await newAdvertisement.save();
      res.status(201).json(newAdvertisement);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
// Get all advertisements
router.get('/listAdverts', async (req, res) => {
  try {
    const advertisements = await Advertisement.find();
    res.json(advertisements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle advertisement on/off
router.patch('/advert/:id/toggle', async (req, res) => {
    try {
      const advertisement = await Advertisement.findById(req.params.id);
      advertisement.isToggled = !advertisement.isToggled;
      await advertisement.save();
      res.json(advertisement);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  // Toggle advertisement display on/off
router.patch('/advert/:id/display', async (req, res) => {
    try {
      const advertisement = await Advertisement.findById(req.params.id);
      advertisement.isDisplayed = !advertisement.isDisplayed;
      await advertisement.save();
      res.json(advertisement);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// Backend route to create a new advertisement

  // Backend route to delete an advertisement by ID
router.delete('/deleteadvert/:id', async (req, res) => {
    try {
      const advertisement = await Advertisement.findByIdAndRemove(req.params.id);
      if (!advertisement) {
        return res.status(404).json({ message: 'Advertisement not found' });
      }
      res.status(200).json({ message: 'Advertisement deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  // Backend route to update an advertisement by ID
router.put('/updateAdvert/:id', async (req, res) => {
    try {
      const advertisement = await Advertisement.findByIdAndUpdate(req.params.id, req.body);
      if (!advertisement) {
        return res.status(404).json({ message: 'Advertisement not found' });
      }
      res.status(200).json({ message: 'Advertisement updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
