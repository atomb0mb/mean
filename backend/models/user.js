const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, 
    },
);

userSchema.plugin(uniqueValidator); // to validate if user email that already existed

module.exports = mongoose.model('User', userSchema);