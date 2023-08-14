const user = require("../models/user.model")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const otpModal = require("../models/otp.model");
const nodemaler = require("nodemailer")

const springedge = require('springedge');

const signup = async (req, res) => {
    try {
        let { name, email, phone, password } = req.body
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "name, email ,phone ,password are required" })
        }
        if (isNaN(phone)) {
            return res.status(400).json({ success: false, message: "invalid mobile number (NaN)" })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "password must be greater than 7 digit" })
        }
        if (phone.toString().length === 10) {
            const varify = await user.findOne({ phone })
            // return res.json({varify});
            if (varify) {
                if (varify.accountCreated) {
                    return res.status(401).json({ success: false, message: "User already exists" })
                } else {
                    // update
                    password = bcrypt.hashSync(password, 10);
                    const data = await user.findByIdAndUpdate(varify._id, { name, email, phone, password }, { new: true })
                    // sendOtp(req, res, data, "updated")
                    return res.status(200).json({ success: true, message: data })

                }
            } else {
                // create
                password = bcrypt.hashSync(password, 10);
                const data = await user.create({ name, email, phone, password })
                // sendOtp(req, res, data, "created")
                return res.status(200).json({ success: true, message: data })

            }
        } else {
            return res.status(400).json({ success: false, message: "invalid mobile number" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "email ,password are required" })
        }

        const data = await user.findOne({ email })
        if (!data) {
            return res.status(500).json({ success: false, message: "user don't exist with this email" })
        }
        if (!bcrypt.compareSync(password, data.password)) {
            return res.status(500).json({ success: false, message: "wrong password" })
        }
        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
        return res.status(200).json({ success: true, data: { id: data._id, email: data.email, name: data.name, dp: data.dp }, token })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const sendOtp = async (req, res, data, action) => {
    // create random otp
    const otp = Math.floor(100000 + Math.random() * 900000);
    // update in db
    const otpObj = await otpModal.updateOne({ email: data.email }, { otp, userid: data._id, email: data.email }, { upsert: true })
    // send
    var transport = nodemaler.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'dsdanishansari1117@gmail.com',
            pass: 'memppgtgladvrcmv'
        }
    })
    var mailOptions = {
        from: 'dsdanishansari1117@gmail.com',
        to: `ddanish1928@gmail.com`,
        subject: 'From KeyCards',
        text: `Mobile Number verification code is ${otp} Do not share it`
    }
    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            // console.log("mail has been send", info.response);
            return res.status(200).json({ success: true, message: "otp send" })

        }
    })
}

const varifyOtp = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await user.findOneAndUpdate({ _id: taskID }, req.body)
        if (!task) {
            return res.status(400).json({ success: false, message: "Incorrect id" })
        }
        res.status(200).json({ task })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

module.exports = {
    signup,
    login,
    varifyOtp
}