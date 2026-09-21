// Import required modules
const express = require('express');
const router = express.Router();

// Import the Table model
const Table = require('../models/Table');

const multer = require('multer');



// Configure multer middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Dinner/'); // Folder where the images will be temporarily stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route handler for creating a table
router.post('/createTable', upload.single('image'), async (req, res) => {
  try {
    const { tableName, maxLimit, tableType, price, description } = req.body;

    // Check if a file was uploaded
    let image = '';
    if (req.file) {
      image = req.file.filename;
    }

    // Create a new table instance using the Table model
    const table = new Table({
      tableName,
      maxLimit,
      tableType,
      price,
      image,
      description
    });

    // Save the table to the database
    await table.save();

    res.status(201).json(table);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Other routes...

module.exports = router;



router.get('/tables', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'An error occurred while fetching tables' });
  }
});

  

 
  
router.get('/tables/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch the table data based on the ID
    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    res.status(200).json(table);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});


  
  router.delete('/tables/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the table by ID and delete it
      await Table.findByIdAndDelete(id);
  
      res.json({ message: 'Table deleted successfully' });
    } catch (error) {
      console.error('Error deleting table:', error);
      res.status(500).json({ error: 'An error occurred while deleting the table.' });
    }
  });
  

  router.put('/tables/update/:id', upload.single('image'), async (req, res) => {
    try {
      const { id } = req.params;
      const { tableName, maxLimit, tableType, price, description } = req.body;
  
      // Find the table in the database based on the ID
      const table = await Table.findById(id);
  
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
  
      // Update the table properties
      table.tableName = tableName;
      table.maxLimit = maxLimit;
      table.tableType = tableType;
      table.price = price;
      table.description = description;
  
      // Check if a new image file was uploaded
      if (req.file) {
        table.image = req.file.filename;
      }
  
      // Save the updated table
      await table.save();
  
      res.status(200).json({ message: 'Table updated successfully', table });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });


  router.put('/table/:tableName', async (req, res) => {
    try {
      const { tableName } = req.params;
      const { seatsTaken } = req.body;
  
      // Find the table with the matching tableName
      const table = await Table.findOne({ tableName });
  
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
  
      // Update the seatsTaken field
      table.seatsTaken = seatsTaken;
  
      // Save the updated table
      await table.save();
  
      res.json({ message: 'Table updated successfully' });
    } catch (error) {
      console.error('Failed to update table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Route handler for updating the seatsTaken field of a table
router.put('/tables/updateSeatsTaken/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { seatsTaken } = req.body;

    // Find the table in the database based on the ID
    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Update the seatsTaken field
    table.seatsTaken = seatsTaken;

    // Save the updated table
    await table.save();

    res.status(200).json({ message: 'Seats taken updated successfully', table });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

  
// Export the router
module.exports = router;
