const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/posts');


const router = express.Router();

const MINE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MINE_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid){
            error = null;
        }
        callback(error, 'backend/images');
    },
    filename: (req, file, callback) => {
        // to construct an unique filename for the picture
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MINE_TYPE_MAP[file.mimetype];
        callback(null, name +  '-' + Date.now() + '.' + ext);
    }
});


// post a new post
router.post('',
    checkAuth,
    multer({storage: storage}).single("image"), PostController.createPost);

// update or edit the selected post with unique id
router.put('/:id',
    checkAuth,
    multer({storage: storage}).single("image"), PostController.updatePost);

// get post list
router.get('', PostController.getPosts);

// get post by id
router.get("/:id", PostController.getSinglePost);

// delete the post
router.delete("/:id", checkAuth, PostController.deletePost);
  
  
module.exports = router;