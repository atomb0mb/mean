const Post = require('../models/post');

// Create a new post
exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
        //this okay
    });

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
}


// Update a post
exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }).catch(error => {
        res.status(500).json({
            message: "Update post failed"
        })
    });
  }

// Get list of posts

exports.getPosts = (req, res, next) => {
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
    }).catch(error => {
        res.status(500).json({
            message: "Fetching posts failed"
        })
    })
}

exports.getSinglePost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  }).catch(error => {
    res.status(500).json({
        message: "Fetching a post by id failed"
    })
});
}

// Delete a post
exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
      result => {
        console.log(result);
        if (result.n > 0) {
          res.status(200).json({ message: "Deletion successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      }
    ).catch(error => {
        res.status(500).json({
            message: "Deleting post failed"
        })
    });
  }