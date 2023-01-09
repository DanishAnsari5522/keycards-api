const user = require("../models/user.model")
const post = require("../models/post.model")
const follow = require("../models/follow.model")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")

const mongoose = require('mongoose');


const getLoggedInUserInfo = async (req, res) => {
    try {
        let _id = req.userid
        if (!_id) {
            return res.status(404).json({ success: false, message: "id is not found in token" })
        }
        if (mongoose.Types.ObjectId.isValid(_id)) {
            _id = mongoose.Types.ObjectId(_id)
            const data = await user.findOne({ _id }).select('_id name email phone gender')
            if (!data) {
                return res.status(404).json({ success: false, message: 'user not found' })
            }
            return res.status(200).json({
                success: true, data: {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    gender: data.gender,
                }
            })
        } else {
            return res.status(401).json({ success: false, message: "invalid id in token" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}
const getUserById = async (req, res) => {
    try {
        let _id = req.query.id
        if (!_id) {
            return res.status(404).json({ success: false, message: "id is not provided" })
        }
        if (mongoose.Types.ObjectId.isValid(_id)) {
            _id = mongoose.Types.ObjectId(_id)
            const userInfo = await user.findOne({ _id }).select('_id name email phone gender')
            if (!userInfo) {
                return res.status(404).json({ success: false, message: 'user not found' })
            }
            const posts = await post.find({ postedby: _id }).count()
            const ifollow = await follow.findOne({ to: _id, by: req.userid }).count()
            const followers = await follow.find({ to: _id }).count()
            const followings = await follow.find({ by: _id }).count()

            return res.status(200).json({
                success: true, data: {
                    name: userInfo.name,
                    _id: userInfo._id,
                    email: userInfo.email,
                    posts: posts,
                    // dp: userInfo.dp,
                    phone: userInfo.phone,
                    ifollow: ifollow == 0 ? false : true,
                    followers,
                    followings,
                    gender: userInfo.gender,
                }
            })
        } else {
            return res.status(401).json({ success: false, message: "invalid id" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const liveSearch = async (req, res) => {
    try {
        const { name } = req.query
        const skip = Number(req.query.skip) || 0

        const data = await user.find({ name: { $regex: '^' + name, $options: 'i' } }).select("name dp gender _id ").sort({ datetime: -1 }).skip(skip).limit(20)
        res.status(200).json({ success: true, data })
        console.log(data);
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}



const editProfile = async (req, res) => {
    // try {
    //     const { userid } = req;
    //     let { name, dob, gender, about, newpass, password } = req.body
    //     if (!password) {
    //         return res.status(404).json({ success: false, message: "old password should not be empty" })
    //     }
    //     const data = await user.findById(userid).select("password")
    //     if (!bcrypt.compareSync(password, data.password)) {
    //         return res.status(500).json({ success: false, message: "wrong password" })
    //     }
    //     var changeData = {}
    //     if (newpass) {
    //         let np = bcrypt.hashSync(newpass, 10);
    //         changeData["password"] = np
    //     }
    //     if (name) {
    //         changeData["name"] = name
    //     }
    //     if (dob) {
    //         changeData["dob"] = new Date(dob)
    //     }
    //     if (gender) {
    //         changeData["gender"] = gender
    //     }
    //     if (about) {
    //         changeData["about"] = about
    //     }
    //     if (Object.keys(changeData).length == 0) {
    //         return res.status(500).json({ success: false, message: "Enter any field to edit user profile" })

    //     }
    //     const d = await user.findByIdAndUpdate(userid, changeData, { new: true }).select("name dp")
    //     return res.status(200).json({ success: true, data: { id: d._id, name: d.name, dp: d.dp } })
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ success: false, message: "server error" })
    // }
}

const updateDp = async (req, res) => {
    try {
        const { dp } = req.body
        if (!dp) {
            return res.status(404).json({ success: false, message: "dp is not provided" })
        }
        const d = await user.findByIdAndUpdate(req.userid, { dp }, { new: true }).select("name dp")
        return res.status(200).json({ success: true, data: { id: d._id, name: d.name, dp: d.dp } })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "server error" })
    }
}


const discoverPeople = async (req, res) => {
    try {
        const skip = Number(req.query.skip) || 0
        const data = await user.find({ _id: { $nin: req.userid } }).select("-password -mobile -chats").sort({ datetime: -1 }).skip(skip).limit(20)
        return res.status(200).json({ success: true, data })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

module.exports = {
    getLoggedInUserInfo,
    getUserById,
    liveSearch,
    editProfile,
    updateDp,
    discoverPeople,
}