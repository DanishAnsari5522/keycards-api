const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    accountCreated: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model("user", user)