const express = require('express');
const router = express.Router();
const GhabsaEvent = require('../models/ghabsaevent');

// Get all events
router.get('/listEvent', async (req, res) => {
  try {
    const events = await GhabsaEvent.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error getting events', error });
  }
});

// Get a single event by ID
router.get('/listAnEvent/:id', async (req, res) => {
  try {
    const event = await GhabsaEvent.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.json(event);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error getting event', error });
  }
});

// Create a new event
router.post('/addEvent', async (req, res) => {
  try {
    const event = new GhabsaEvent(req.body);
    const savedEvent = await event.save();
    res.json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
});

// Update an event by ID
router.put('/updateEvents/:id', async (req, res) => {
  try {
    const event = await GhabsaEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.json(event);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
});

// Delete an event by ID
router.delete('/deleteEvents/:id', async (req, res) => {
  try {
    const event = await GhabsaEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.json({ message: 'Event deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
});

module.exports = router;
