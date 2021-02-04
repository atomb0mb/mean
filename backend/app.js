const express = require('express');

const app = express();

// To prevent Cross Origin Resource Sharing errors
app.use('/api/posts', (req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); // all
    next();
})

app.use('/api/posts', (req, res, next) =>{
    const posts = [
        {id: '1001', title: 'Dummy #1', content: 'Data from server'},
        {id: '1002', title: 'Dummy #2', content: 'Data from server'}
    ];
    res.status(200).json({
        message: 'Posts fetched',
        posts: posts
    });

});

module.exports = app;