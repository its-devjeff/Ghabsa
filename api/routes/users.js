const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { verifyToken, verifyUser, verifyAdmin } = require("../utils/verifyToken");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profile/'); // Specify the destination folder for storing the uploaded files
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext); // Generate a unique filename for each uploaded file
  }
});


// Middleware function to check if a field value already exists in the database
const checkDuplicateField = (model, field, excludeFields = []) => {
  return async (req, res, next) => {
    const fieldValue = req.body[field];

    // Exclude specified fields from duplicate check
    if (excludeFields.includes(field)) {
      return next();
    }

    const existingRecord = await model.findOne({ [field]: fieldValue });

    if (existingRecord) {
      return res.status(400).json({ error: `${field} already exists`, field });
    }

    next();
  };
};

const excludeFields = ['lastname', 'firstname'];

// Registration route with duplicate field checks
router.post(
  '/register',
  checkDuplicateField(User, 'username', excludeFields),
  checkDuplicateField(User, 'email', excludeFields),
  checkDuplicateField(User, 'phone', excludeFields),
  checkDuplicateField(User, 'studentId', excludeFields),
  async (req, res) => {
    try {
      // Extract form data from request body
      const {
        username,
        firstname,
        lastname,
        email,
        phone,
        studentId,
        password,
        confirmpassword,
        dob,
        level,
        programme,
      } = req.body;

      // Validate form data
      const errors = [];

      if (!level) {
        errors.push('Level is required');
      }

      if (password.length < 8) {
        errors.push('Minimum of 8 characters required for password');
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object
      const newUser = new User({
        username,
        firstname,
        lastname,
        email,
        phone,
        studentId,
        password: hashedPassword,
        dob,
        level,
        programme,
      });

      // Save the user to the database
      await newUser.save();

      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get user data route
// Route to retrieve user data
router.get('/auth-user', verifyToken, async (req, res, next) => {
  try {
    // Retrieve the user data from the database
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data in the response
    res.json({ userData: user });
  } catch (error) {
    next();
  }
});


// Create a Multer instance with the specified configuration
const upload = multer({ storage: storage });

// GET user profile
router.get('/profile', async (req, res) => {
  try {
    // Fetch the user data from the database
    const user = await User.findOne({}); // Replace with your actual logic to fetch user data

    if (user) {
      res.status(200).json({
        username: user.username,
        email: user.email,
        phone: user.phone,
        profilepic: user.profilePic ? user.profilePic.split('/').pop() : null, // Only return the filename of the profilepic
      });
    } else {
      // Handle case if no user is found
      res.status(404).json({
        error: 'User not found',
      });
    }
  } catch (error) {
    // Handle error if an exception occurs
    console.error(error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// PUT update user profile

router.put('/profile/update', upload.single('profileImage'), async (req, res) => {
  const { username, email, phone } = req.body;
  const profileImage = req.file;

  try {
    let user = await User.findOne();

    if (!user) {
      // If user does not exist, create a new user
      user = new User({
        username,
        email,
        phone,
        profilePic: profileImage ? profileImage.filename : null,
      });
    } else {
      // Update the user data
      user.username = username;
      user.email = email;
      user.phone = phone;
      user.profilePic = profileImage ? profileImage.filename : null;
    }

    await user.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to update user data:', error);
    res.sendStatus(500); // Internal server error
  }
});
router.get('/accounts', async (req, res) => {
  try {
    // Fetch all user accounts from the database
    const accounts = await User.find({});

    // Send the accounts in the response
    res.json({ accounts });
  } catch (error) {
    console.error('Failed to fetch user accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("hello,user, you are authenticated");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("hello,user, you are authenticated");
});

module.exports = router;
