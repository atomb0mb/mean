const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', (res, req, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,

        })
        user.save() // save to the database
        .then(result => {
            res.status(201).json({
                message: 'User created!',
                result: result
            });
        }) 
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    })
})

module.exports = router;