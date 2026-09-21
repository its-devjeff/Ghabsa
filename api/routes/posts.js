const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save files to uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // set unique filename
  }
});

// Set up multer upload
const upload = multer({ storage: storage });

// Create a new post
router.post('/addPosts', upload.single('image'), async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.file.filename // save the image filename
    });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Update an existing post
router.put('/Singlepost/:id', upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      image: req.file.filename, // save the image filename
      updatedAt: Date.now()
    });
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete a post
router.delete('/deletepost/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Fetch all posts
router.get('/listPosts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
module.exports = router;
