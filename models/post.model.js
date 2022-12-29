const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const post = new mongoose.Schema({
    cardkey: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
    },
    validupto: {
        type: String,
        require: true
    },
    postedby: {
        type: ObjectId,
        ref: 'user'
    },
    datetime: { type: Date, default: Date.now }

})

module.exports = mongoose.model("post", post)
