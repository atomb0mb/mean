const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// create an account
exports.createrUser = (req, res, next) => {
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
                message: 'Invalid authentication credentials'
            })
        })
    })
}


// log into an account
exports.userLogin = (req, res, next) => {
    let fetchUser;
    User.findOne({ email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        fetchUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if(!result) {
            return res.status(401).json({
                message: 'Auth failed'
            }).catch(error => {
                res.status(500).json({
                    message: "Couldn''t' update post"
                })
            })
        }
        const token = jwt.sign({email: fetchUser.email, userId: fetchUser._id}, process.env.JWT_KEY, { expiresIn: '30m' });
        res.status(200).json({
            token: token,
            expiresIn: 1800,
            userId: fetchUser._id, // spent couple hours to find this issue... it was fetchUser.userId that gives me 'undefined'
        })
    }).catch(err => {
        return res.status(401).json({
            message: 'Err - Auth failed'
        })
    })


}