const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const multer = require('multer');

// Set up multer upload
const upload = multer();

router.post('/newTicket', upload.none(), async (req, res) => {
  try {
    // Get the ticket details from the request body
    const { name, contact, email, tableName, amountPaid, ticketCode } = req.body;

    // Create a new ticket object
    const ticket = new Ticket({
      ticketCode,
      name,
      contact,
      email,
      tableName,
      amountPaid,
    });

    // Save the ticket to the database
    await ticket.save();

    res.json({ success: true });
  } catch (error) {
    // Handle errors
    console.error('Failed to generate ticket:', error);
    res.status(500).json({ success: false, message: 'Failed to generate ticket' });
  }
});

// Validate a ticket
router.get('/tickets/:ticketCode', async (req, res) => {
  try {
    const { ticketCode } = req.params;

    // Find the ticket in the database
    const ticket = await Ticket.findOne({ ticketCode });

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
    } else {
      res.json(ticket);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate ticket' });
  }
});

module.exports = router;
