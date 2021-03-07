const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/check-file');
const PostController = require('../controllers/posts');


const router = express.Router();


// post a new post
router.post('',
    checkAuth,
    extractFile, PostController.createPost);

// update or edit the selected post with unique id
router.put('/:id',
    checkAuth,
    extractFile, PostController.updatePost);

// get post list
router.get('', PostController.getPosts);

// get post by id
router.get("/:id", PostController.getSinglePost);

// delete the post
router.delete("/:id", checkAuth, PostController.deletePost);
  
  
module.exports = router;