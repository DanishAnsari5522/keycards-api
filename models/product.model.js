const mongoose = require('mongoose');

const product = new mongoose.Schema({
    companyName: {
        type: String,
        require: true
    },
    category: {
        type: Array,
        require: true,
    },
    logoURL: {
        type: String,
        required: true,
    },
    productLink: {
        type: String,
        require: true
    },
    discription: {
        type: String,
        require: true
    },
    comment: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("product", product)