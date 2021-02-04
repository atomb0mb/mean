const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) =>{
    const posts = [
        {id: '1001', title: 'Dummy #1', content: 'Data from server'},
        {id: '1002', title: 'Dummy #2', content: 'Data from server'}
    ];
    res.json({
        message: 'Posts fetched',
        posts: posts
    });

});

module.exports = app;