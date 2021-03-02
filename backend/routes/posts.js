const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


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
    multer({storage: storage}).single("image"),(req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
        //this okay
    });

    console.log(post);

    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id,
                // title: createdPost.title,
                // content: createdPost.content,
                // imagePath: createdPost.imagePath
            }
        });
    });


})

// update or edit the selected post with unique id
router.put('/:id',
    checkAuth,
    multer({storage: storage}).single("image"), 
    (req, res, next) => {
    let imageUrl = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get("host");
        imageUrl = url + "/images/" + req.file.filename;
    }
    const newPost = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imageUrl,
        creator: req.userData.userId 
    })
    Post.updateOne({_id: req.params.id, creator: req.userData.userId }, newPost ).then( result => {
        if(result.nModified > 0) {
            res.status(200).json({
                message: 'Post updated successfully',
            });
        } else  {
            res.status(401).json({
                message: 'Post update failed',
            });
        }
    })
    

})

// get post list
router.get('', (req, res, next) => {
    const pageSize = +req.query.pagesize; // *important* this is query name we set
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchPost;
    // to verify visit http://localhost:3000/api/posts?pagesize=2&page=2 
    if(pageSize && currentPage){
        // to display the posts 
        postQuery
        // to skip the previous page item depends on the current page
        .skip(pageSize * (currentPage - 1))
        // to narrow down the retrieve for current page
        .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchPost = documents;
        return Post.countDocuments();
    }).then(count => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: fetchPost,
            maxPosts: count
     
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

// delete the post
router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
      result => {
        console.log(result);
        if (result.n > 0) {
          res.status(200).json({ message: "Deletion successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      }
    );
  });
  
  
module.exports = router;