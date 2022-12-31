const express = require("express");
const postroute = express.Router();


const { getPost, doReact, comment, getSubPosts, uploadPost, getUserPosts, getSpecificPost, deletePost, likeOncomment, dislikeOncomment, deleteComment, getComments } = require("../controllers/post.controller");

postroute.route("/").get(getPost)
// postroute.route("/comment").get(getComments)
postroute.post("/upload", uploadPost)
postroute.route("/react").put(doReact)
// postroute.route("/comment").put(comment)
// postroute.route("/comment/like").put(likeOncomment)
// postroute.route("/comment/dislike").put(dislikeOncomment)
// postroute.route("/delete-comment").delete(deleteComment)
postroute.route("/delete-post").delete(deletePost)

postroute.route("/getuserposts").get(getUserPosts)
postroute.route("/getsubpost").get(getSubPosts)
postroute.route("/getspecificpost").get(getSpecificPost)

module.exports = postroute