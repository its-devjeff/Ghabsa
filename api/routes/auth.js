const router = require("express").Router();
const User = require("../models/User")
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken')
const {verifyToken} = require("../utils/verifyToken")
const cookieParser = require('cookie-parser');
router.use(cookieParser());
//Register
router.post("/register",async (req,res)=>{
    
     const salt = await bcrypt.genSalt(10);
     const hashedPass = await bcrypt.hash(req.body.password,salt)
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            firstname:req.body.firstname,
            lastname:req.body.lastname,  
            phone:req.body.phone,
            studentId:req.body.studentId,
            dob:req.body.dob,
            level:req.body.level,
            programme:req.body.programme,
            password:hashedPass
           
        })
    try{
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        console.log(err)
        res.status(500).json({message:err});


    }
})




// Login route


// Login route
router.post("/login", async (req, res) => {
  const { studentId, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ studentId });
    if (!user) {
      return res.json({ success: false, message: "Invalid student ID or password" });
    }

    // Compare the provided password with the stored password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({ success: false, message: "Invalid student ID or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ studentId: user.studentId, isAdmin: user.isAdmin }, process.env.JWT);

    // Construct the userData object dynamically with all properties from the user object
    const userData = { ...user._doc };
    delete userData.password;

    // Set the token as an HTTP-only cookie with an expiration time
    res.cookie("access_token", token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

    // Send the success response with the token and user data
    res.json({ success: true, token, user: userData });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
});



// Example protected route
router.get("/protected", verifyToken, (req, res) => {
  // Your protected route logic here

  res.json({ success: true, message: "Access granted" });
});

// Middleware to check session expiration
const checkSessionExpiration = (req, res, next) => {
  const lastActivityTimestamp = req.lastActivityTimestamp;

  if (lastActivityTimestamp) {
    const now = Date.now();
    const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Calculate the elapsed time since the last activity
    const elapsedTime = now - lastActivityTimestamp;

    if (elapsedTime >= expirationTime) {
      // If the elapsed time is greater than or equal to the expiration time, clear the session
      res.clearCookie("access_token");
    }
  }

  next();
};

// Apply the checkSessionExpiration middleware to all routes after the verifyToken middleware
router.use(checkSessionExpiration);

// Example protected route that will check session expiration
router.get("/protected-with-session-expiration", verifyToken, (req, res) => {
  // Your protected route logic here

  res.json({ success: true, message: "Access granted" });
});

module.exports = router;