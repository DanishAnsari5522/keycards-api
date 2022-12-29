const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const follow = new mongoose.Schema({
    by: {
        type: ObjectId,
        required: true,
        ref: 'user'
    },
    to: {
        type: ObjectId,
        required: true,
        ref: 'user'
    },
    datetime: { type: Date, default: Date.now }

})

module.exports = mongoose.model("follow", follow)