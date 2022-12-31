const { default: mongoose } = require("mongoose");
const followModal = require("../models/follow.model");
const post = require("../models/post.model");
const user = require("../models/user.model");


// helper functons
const isPostExists = async (id) => {
    const data = await post.findById(id)
    return data
}
// ends

const getPost = async (req, res) => {
    try {
        const data = await post.find().populate('postedby', "_id name dp").select("-__v")
        res.status(200).json({ success: true, data })
    } catch (error) {
        res.status(500).json({ success: false, error: "server error" })
    }
}

const uploadPost = async (req, res) => {
    try {
        const { cardkey, description, validupto } = req.body;
        if (!cardkey && !description && !validupto) {
            return res.status(404).json({ success: false, message: "provide cardkey description and validupto" })
        }
        let data
        if (cardkey && description && validupto) {
            data = await post.create({ cardkey, description, validupto, postedby: req.userid })
        } else {
            return res.status(500).json({ success: false, message: "provide cardkey description and validupto are faild" })
        }
        return res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}


const doReact = async (req, res) => {
    // try {
    //     const { postid, action } = req.body
    //     if (!postid || !action) {
    //         return res.status(404).json({ success: false, message: "postid and action  is not provided" })
    //     }
    //     if (mongoose.Types.ObjectId.isValid(postid)) {
    //         const _id = mongoose.Types.ObjectId(postid)
    //         const isExist = await isPostExists(_id)
    //         if (isExist) {
    //             if (action === "like") {
    //                 const data = await post.findByIdAndUpdate(_id, { $push: { likes: { by: req.userid } } }, { new: true })
    //                 return res.status(200).json({ success: true, data: "liked" })
    //             } else if (action === "dislike") {
    //                 const data = await post.findByIdAndUpdate(_id, { $pull: { likes: { by: req.userid } } }, { new: true })
    //                 return res.status(200).json({ success: true, data: "disliked" })
    //             } else {
    //                 return res.status(200).json({ success: false, data: "invalid action" })
    //             }
    //         }
    //     }
    //     return res.status(401).json({ success: false, message: "invalid postid or post no longer exists" })
    // } catch (error) {
    //     return res.status(500).json({ success: false, message: "server error" })
    // }
}

const comment = async (req, res) => {
    // try {
    //     const { postid, comm } = req.body
    //     if (!postid || !comm) {
    //         return res.status(404).json({ success: false, message: "postid or comm is not provided" })
    //     }

    //     if (mongoose.Types.ObjectId.isValid(postid)) {
    //         const _id = mongoose.Types.ObjectId(postid)
    //         const isExist = await isPostExists(_id)
    //         if (isExist) {
    //             const data = await post.findByIdAndUpdate(_id, { $push: { comments: { by: req.userid, comm } } }, { new: true })
    //             return res.status(200).json({ success: true })
    //         }
    //     }
    //     return res.status(401).json({ success: false, message: "invalid postid or post no longer exists" })
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ success: false, message: "server error" })
    // }
}

const likeOncomment = async (req, res) => {
    // try {
    //     let { postid, commid } = req.body
    //     const myid = req.userid
    //     if (!postid || !commid) {
    //         return res.status(404).json({ success: false, message: "postid or commid is not provided" })
    //     }

    //     if (mongoose.Types.ObjectId.isValid(postid) && mongoose.Types.ObjectId.isValid(commid)) {
    //         postid = mongoose.Types.ObjectId(postid)
    //         commid = mongoose.Types.ObjectId(commid)
    //         const data = await post.updateOne({ _id: postid, "comments._id": commid },
    //             { $push: { "comments.$.likes": { by: myid } } },
    //             { new: true })
    //         if (!data.acknowledged) {
    //             return res.status(200).json({ success: false, message: "failed" })
    //         }
    //         return res.status(200).json({ success: true, data: data })
    //     } else {
    //         return res.status(401).json({ success: false, message: "invalid postid or commid" })
    //     }
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ success: false, message: "server error" })
    // }
}

const dislikeOncomment = async (req, res) => {
    // try {
    //     let { postid, commid } = req.body
    //     const myid = req.userid
    //     if (!postid || !commid) {
    //         return res.status(404).json({ success: false, message: "postid or commid is not provided" })
    //     }

    //     if (mongoose.Types.ObjectId.isValid(postid) && mongoose.Types.ObjectId.isValid(commid)) {
    //         postid = mongoose.Types.ObjectId(postid)
    //         commid = mongoose.Types.ObjectId(commid)
    //         const data = await post.updateOne({ _id: postid, "comments._id": commid },
    //             { $pull: { "comments.$.likes": { by: myid } } },
    //             { new: true })
    //         if (!data.acknowledged) {
    //             return res.status(200).json({ success: false, message: "failed" })
    //         }
    //         return res.status(200).json({ success: true, data: data })
    //     } else {
    //         return res.status(401).json({ success: false, message: "invalid postid or commid" })
    //     }
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ success: false, message: "server error" })
    // }
}

const deleteComment = async (req, res) => {
    // try {
    //     let { postid, commid } = req.body
    //     if (!postid || !commid) {
    //         return res.status(404).json({ success: false, message: "postid or commid is not provided" })
    //     }

    //     if (mongoose.Types.ObjectId.isValid(postid) && mongoose.Types.ObjectId(commid)) {
    //         postid = mongoose.Types.ObjectId(postid)
    //         commid = mongoose.Types.ObjectId(commid)
    //         const data = await post.findByIdAndUpdate({ _id: postid },
    //             { $pull: { comments: { by: req.userid, _id: commid } } },
    //             { new: true })
    //         return res.status(200).json({ success: true, data: "if comment exists and belongs to you then its deleted" })
    //     } else {
    //         return res.status(401).json({ success: false, message: "invalid postid" })
    //     }
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ success: false, message: "server error" })
    // }
}

//yee
const deletePost = async (req, res) => {
    try {
        const { postid } = req.query
        const { userid } = req
        if (!postid) {
            return res.status(404).json({ success: false, message: "postid is not provided" })
        }
        if (!mongoose.Types.ObjectId.isValid(postid)) {
            return res.status(404).json({ success: false, message: "postid is not valid" })
        }


        const { postedby } = await post.findById(postid).select("postedby");
        if (postedby.toString() === userid) {
            const data = await post.findByIdAndDelete(postid, { new: true })
            return res.status(200).json({ success: true, data: "deleted" })
        } else {
            return res.status(401).json({ success: false, message: "this post doesnt belongs to you" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "post no longer exists" })
    }
}


//yee
const getUserPosts = async (req, res) => {
    try {
        let _id = req.query.id
        const now = Date.now()
        const skip = Number(req.query.skip) || 0
        if (!_id) {
            return res.status(404).json({ success: false, message: "id is not provided" })
        }
        if (mongoose.Types.ObjectId.isValid(_id)) {
            _id = mongoose.Types.ObjectId(_id)
            const data = await post.aggregate([
                { $match: { postedby: _id } },
                { $sort: { datetime: -1 } },
                { $skip: skip },
                { $limit: 9 },
                { $lookup: { from: 'users', localField: 'postedby', foreignField: '_id', as: 'postedby' } },
                { $unwind: '$postedby' },
                {
                    $project: {
                        cardkey: 1,
                        description: 1,
                        validupto: 1,
                        // isLiked: { $in: [mongoose.Types.ObjectId(req.userid), "$likes.by"] },
                        postedby: {
                            _id: 1,
                            name: 1,
                            gender: 1,
                        },
                        // likes: { $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 } },
                        // comments: { $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: 0 } },
                        now: now
                    }
                },
                { $addFields: { now: now } },
            ])
            return res.status(200).json({ success: true, data })
        } else {
            return res.status(401).json({ success: false, message: "invalid id" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}


//yee
const getSubPosts = async (req, res) => {
    try {
        const skip = Number(req.query.skip) || 0
        const now = Date.now()
        const follow = await followModal.find({ by: req.userid }).select("to")
        const myid = mongoose.Types.ObjectId(req.userid);

        const followArray = await follow.map(o => o.to)
        followArray.unshift(myid)
        const data = await post.aggregate([
            { $match: { postedby: { $in: followArray } } },
            { $sort: { datetime: -1 } },
            { $skip: skip },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: 'postedby', foreignField: '_id', as: 'postedby' } },
            { $unwind: '$postedby' },
            { $addFields: { now: now } },
            {
                $project: {
                    image: 1,
                    datetime: 1,
                    text: 1,
                    isLiked: { $in: [mongoose.Types.ObjectId(req.userid), "$likes.by"] },
                    postedby: {
                        _id: 1,
                        name: 1,
                        dp: 1,
                        dob: 1,
                        about: 1,
                        gender: 1,
                    },
                    likes: { $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 } },
                    comments: { $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: 0 } },
                    now: now
                }
            },
        ])
        return res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}


const getSpecificPost = async (req, res) => {
    try {
        let _id = req.query.id
        const now = Date.now()
        if (!_id) {
            return res.status(404).json({ success: false, message: "id is not provided" })
        }
        if (mongoose.Types.ObjectId.isValid(_id)) {
            _id = mongoose.Types.ObjectId(_id)
            const data = await post.aggregate([
                { $match: { _id: _id } },
                { $lookup: { from: 'users', localField: 'postedby', foreignField: '_id', as: 'postedby' } },
                { $unwind: '$postedby' },
                {
                    $project: {
                        image: 1,
                        datetime: 1,
                        text: 1,
                        isLiked: { $in: [mongoose.Types.ObjectId(req.userid), "$likes.by"] },
                        postedby: {
                            _id: 1,
                            name: 1,
                            dp: 1,
                            dob: 1,
                            about: 1,
                            gender: 1,
                        },
                        likes: { $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 } },
                        comments: { $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: 0 } },
                    }
                },
                { $addFields: { now: now } },
            ])
            return res.status(200).json({ success: true, data })
        } else {
            return res.status(401).json({ success: false, message: "invalid id" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}



const getComments = async (req, res) => {
    // try {
    //     let _id = req.query.id
    //     const now = Date.now()
    //     const skip = Number(req.query.skip) || 0
    //     if (!_id) {
    //         return res.status(404).json({ success: false, message: "id is not provided" })
    //     }
    //     if (mongoose.Types.ObjectId.isValid(_id)) {
    //         _id = mongoose.Types.ObjectId(_id)
    //         const data = await post.aggregate([
    //             { $match: { _id: _id } },
    //             {
    //                 $unwind: {
    //                     path: '$comments'
    //                 }
    //             },
    //             { $lookup: { from: 'users', localField: 'comments.by', foreignField: '_id', as: 'comments.by' } },
    //             { $unwind: '$comments.by' },
    //             {
    //                 $project: {
    //                     _id: "$comments._id",
    //                     comm: "$comments.comm",
    //                     isLiked: { $in: [mongoose.Types.ObjectId(req.userid), "$comments.likes.by"] },
    //                     likes: { $cond: { if: { $isArray: "$comments.likes" }, then: { $size: "$comments.likes" }, else: 0 } },
    //                     by: {
    //                         _id: "$comments.by._id",
    //                         name: "$comments.by.name",
    //                         dp: "$comments.by.dp"
    //                     },
    //                     datetime: "$comments.datetime"
    //                 }
    //             },
    //             { $addFields: { now: now } },
    //             { $sort: { datetime: -1 } },
    //             { $skip: skip },
    //             { $limit: 20 },
    //         ])
    //         return res.status(200).json({ success: true, data })
    //     } else {
    //         return res.status(401).json({ success: false, message: "invalid id" })
    //     }
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ success: false, message: "server error" })
    // }
}


module.exports = {
    getPost,
    doReact,
    comment,
    getSubPosts,
    uploadPost,
    getUserPosts,
    getSpecificPost,
    deletePost,
    likeOncomment,
    dislikeOncomment,
    deleteComment,
    getComments
}