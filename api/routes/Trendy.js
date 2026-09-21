const express = require('express');
const router = express.Router();
const multer = require('multer');
const {verifyToken, verifyUser,verifyAdmin} = require("../utils/verifyToken")
const {createTrendy,getTrendy,updateTrendy} = require("../controllers/Trendy")
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'trendyPhoto/'); // Folder where the images will be temporarily stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//endpoint to post trendy
router.post('/trendyupdate', upload.single('image'),createTrendy);

// Endpoint to fetch the trendy data
router.get('/getTrendy',getTrendy);

//endpoint to update trendy

router.post('/trendyupdate',verifyAdmin, upload.single('image'), updateTrendy);
  

module.exports = router;
