const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: String,
    jobTitle: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;