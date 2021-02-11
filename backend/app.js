

const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./models/post');
const app = express();
const key = require('./key');


// username & password need to be replace 
mongoose.connect('mongodb+srv://dbusr:'+ key.dbaccess.password +'@cluster0.xil5u.mongodb.net/node-angular?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to database')
})
.catch(() => {
    console.log('Connection failed.')
})

//npm install --save body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// To prevent Cross Origin Resource Sharing errors
app.use('/api/posts', (req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); // all


    
    next();
})

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    post.save();
    res.status(201).json({
        message: 'Post added successfully',
        posts: post
    });

})

app.get('/api/posts', (req, res, next) =>{
    Post.find().then(document =>{
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: document
            
        });
       

    })
    

})

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
      //console.log(result);
      res.status(200).json({ message: "Post deleted!" });
    });
  });
  

module.exports = app;