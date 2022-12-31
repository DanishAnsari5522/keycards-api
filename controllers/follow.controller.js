const follow = require("../models/follow.model")
const user = require("../models/user.model")
const mongoose = require('mongoose');

const doFollow = async (req, res) => {
    try {
        let { action, to } = req.body
        if (!to) {
            return res.status(404).json({ success: false, message: "to id is not provided" })
        }
        if (!action) {
            return res.status(404).json({ success: false, message: "action is not provided" })
        }

        if (to.toString() == req.userid.toString()) {
            return res.status(401).json({ success: false, message: "you cannot follow or unfollow yourself" })
        }

        if (mongoose.Types.ObjectId.isValid(to)) {
            to = mongoose.Types.ObjectId(to)
            if (action === "follow") {
                const q = { to, by: req.userid }
                const data = await follow.findOneAndUpdate(q, q, { upsert: true })
                return res.status(200).json({ success: true, data: 'followed' })
            }
            if (action === "unfollow") {
                const data = await follow.findOneAndDelete({ to, by: req.userid })
                return res.status(200).json({ success: true, data: 'unfollowed' })
            }
            return res.status(200).json({ success: false, data: 'action should be follow or unfollow' })

        } else {
            return res.status(401).json({ success: false, message: "invalid id" })
        }

    } catch (e) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}


const getFollowers = async (req, res) => {
    try {
        let _id = req.query.id
        const skip = Number(req.query.skip) || 0

        if (!_id) {
            return res.status(404).json({ success: false, message: "id is not provided" })
        }
        if (mongoose.Types.ObjectId.isValid(_id)) {
            _id = mongoose.Types.ObjectId(_id)
            const userInfo = await user.findOne({ _id })
            if (!userInfo) {
                return res.status(404).json({ success: false, message: 'user not found' })
            }

            const followers = await follow.aggregate([
                { $match: { to: _id } },
                { $sort: { datetime: -1 } },
                { $skip: skip },
                { $limit: 20 },
                { $lookup: { from: 'users', localField: 'by', foreignField: '_id', as: 'by' } },
                { $unwind: '$by' },
                {
                    $project: {
                        _id: "$by._id",
                        name: "$by.name",
                        // dp: "$by.dp",
                        // dob: "$by.dob",
                        // about: "$by.about",
                        gender: "$by.gender",
                    }
                },
            ])


            return res.status(200).json({ success: true, data: followers })
        } else {
            return res.status(401).json({ success: false, message: "invalid id" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getFollowings = async (req, res) => {
    try {
        let _id = req.query.id
        const skip = Number(req.query.skip) || 0

        if (!_id) {
            return res.status(404).json({ success: false, message: "id is not provided" })
        }
        if (mongoose.Types.ObjectId.isValid(_id)) {
            _id = mongoose.Types.ObjectId(_id)
            const userInfo = await user.findOne({ _id })
            if (!userInfo) {
                return res.status(404).json({ success: false, message: 'user not found' })
            }

            const followers = await follow.aggregate([
                { $match: { by: _id } },
                { $sort: { datetime: -1 } },
                { $skip: skip },
                { $limit: 20 },
                { $lookup: { from: 'users', localField: 'to', foreignField: '_id', as: 'to' } },
                { $unwind: '$to' },
                {
                    $project: {
                        _id: "$to._id",
                        name: "$to.name",
                        // dp: "$to.dp",
                        // dob: "$to.dob",
                        // about: "$to.about",
                        gender: "$to.gender"
                    }
                },
            ])


            return res.status(200).json({ success: true, data: followers })
        } else {
            return res.status(401).json({ success: false, message: "invalid id" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}
module.exports = {
    doFollow,
    getFollowers,
    getFollowings
}