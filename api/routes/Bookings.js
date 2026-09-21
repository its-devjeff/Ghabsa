// Server-side route and model for creating reservations

const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');


router.post('/reservation', async (req, res) => {
  try {
    // Retrieve the reservation data from the request body
    const reservationData = req.body;

    // Create a new reservation document using the Reservation model
    const reservation = new Reservation(reservationData);

    // Save the reservation document to the database
    const savedReservation = await reservation.save();

    // Send a response indicating the reservation was saved successfully
    res.status(200).json({ reservationId: savedReservation._id });
  } catch (error) {
    // Handle any errors that occurred during the saving process
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving the reservation.' });
  }
});

router.get('/table/:tableName', async (req, res) => {
  try {
    // Retrieve the table name from the request parameters
    const tableName = req.params.tableName;

    // Find all reservations for the specified table name
    const reservations = await Reservation.find({ tableName });

    // Extract the usernames from the reservations
    const usernames = reservations.map((reservation) => reservation.username);

    // Send the usernames as the response
    res.status(200).json({ usernames });
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the reservations.' });
  }
});






router.get('/verify-token', async (req, res) => {
    try {
      const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'
  
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
  
      // Verify the token and decode the payload
      const decodedToken = jwt.verify(token, secretKey);
  
      // Extract the guest information from the decoded token
      const { guestName, guestEmail, guestPhone } = decodedToken;
  
      // Send the guest information in the response
      res.json({ guestName, guestEmail, guestPhone });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).json({ error: 'Failed to verify token' });
    }
  });
  

// POST /api/reservation/submit
router.post('/submit', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.json({ reservationId: reservation._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error submitting reservation' });
  }
});

router.get('/reservations/search', async (req, res) => {
  try {
    const { searchTerm } = req.query;

    // Find reservations that match the search term
    const reservations = await Reservation.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { tablename: { $regex: searchTerm, $options: 'i' } },
      ],
    });

    res.json(reservations);
  } catch (error) {
    console.error('Error searching reservations:', error);
    res.status(500).json({ error: 'Failed to search reservations' });
  }
});


// Route to get all reservations
router.get('/get-reservations', async (req, res) => {
  try {
    // Fetch all reservations from the database
    const reservations = await Reservation.find();

    // Send the reservations as the response
    res.json(reservations);
  } catch (error) {
    console.error('Error retrieving reservations:', error);
    res.status(500).json({ error: 'Failed to retrieve reservations' });
  }
});

// Edit reservation
router.put('/reservation/:reservationId', async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const { hasPaid } = req.body;

    // Find the reservation with the matching reservationId
    const reservationToUpdate = await Reservation.findById(reservationId);

    // Check if the reservation exists and hasPaid is false
    if (reservationToUpdate && !reservationToUpdate.hasPaid) {
      reservationToUpdate.hasPaid = hasPaid;

      // Save the updated reservation to the database
      const updatedReservation = await reservationToUpdate.save();

      res.json(updatedReservation);
    } else {
      res.status(404).json({ message: 'Reservation not found or has already been paid.' });
    }
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Delete reservation
router.delete('/reservation/:reservationId', async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    // Find the reservation with the matching reservationId
    const reservationToDelete = await Reservation.findById(reservationId);

    // Check if the reservation exists and hasPaid is false
    if (reservationToDelete && !reservationToDelete.hasPaid) {
      // Delete the reservation from the database
      await reservationToDelete.remove();

      res.json({ message: 'Reservation deleted successfully' });
    } else {
      res.status(404).json({ message: 'Reservation not found or has already been paid.' });
    }
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

// ...

module.exports = router;
