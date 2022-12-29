const express = require("express")
const follow = express.Router()
const { doFollow, getFollowers, getFollowings } = require("../controllers/follow.controller")
follow.post("/", doFollow)
follow.get("/getfollowers", getFollowers)
follow.get("/getfollowing", getFollowings)
module.exports = follow