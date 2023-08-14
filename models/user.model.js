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
    password: {
        type: String,
        require: true
    },
})

module.exports = mongoose.model("user", user)