const express = require("express")
const route = express.Router()
const { login, signup, varifyOtp } = require("../controllers/auth.controller")

route.post("/login", login)
route.post("/signup", signup)
route.post("/varify-otp", varifyOtp)
route.route('/varify-otp/:id').patch(varifyOtp);


module.exports = route