const express = require('express');
const Post = require('../models/post');
const router = express.Router();

// post a new post
router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdId =>{
        console.log(createdId)
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdId._id
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