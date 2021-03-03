
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const key = require('./key');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


// username & password need to be replace 
mongoose.connect('mongodb+srv://'+ process.env.MONGO_DB_USR +':'+ process.env.MONGO_ATLAS_PW +'@cluster0.xil5u.mongodb.net/node-angular?retryWrites=true&w=majority', { useNewUrlParser: true })
.then(() => {
    console.log('Connected to database')
})
.catch(() => {
    console.log('Connection failed.')
})

//npm install --save body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));


// To prevent Cross Origin Resource Sharing errors
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); // all

    next();
    
})

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;