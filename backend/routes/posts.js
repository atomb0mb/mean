const express = require('express');
const Post = require('../models/post');
const multer = require('multer');


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
router.post('', multer({storage: storage}).single("image"),(req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost =>{
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    });


})

// update or edit the selected post with unique id
router.put('/:id', (req, res, next) => {
    const newPost = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({_id: req.params.id}, newPost ).then( result => {
        res.status(200).json({
            message: 'Post updated successfully',
        });
    })
    

})

// get post list
router.get('', (req, res, next) =>{
    Post.find().then(document =>{
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: document
     
        });
    })
})
// get a post
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Post not found!" });
        }
    })

});

// delete
router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
      //console.log(result);
      res.status(200).json({ message: "Post deleted!" });
    });
});
  
module.exports = router;