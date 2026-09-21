const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Get all events
router.get('/listEvent', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error getting events', error });
  }
});

// Get a single event by ID
router.get('/listEvent/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
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
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
});

// Update an event by ID
router.put('/updateEvents/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const event = await Event.findByIdAndDelete(req.params.id);
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
