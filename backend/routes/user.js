const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');

const router = express.Router();

// create an account
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

router.post('/login', (res, req, next) => {
    User.findOne({ email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if(!result) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        const token = jwt.sign({email: user.email, userId: user._id}, 'secret_this_is_longer', {expiresIn: '30m'});
    }).catch(err => {
        return res.status(401).json({
            message: 'Err - Auth failed'
        })
    })


})
module.exports = router;