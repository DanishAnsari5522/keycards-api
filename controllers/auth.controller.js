const user = require("../models/user.model")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const otpModal = require("../models/otp.model");
const nodemaler = require("nodemailer")

const springedge = require('springedge');

const signup = async (req, res) => {
    try {
        let { name, email, phone, gender, password } = req.body
        if (!name || !email || !phone || !gender || !password) {
            return res.status(400).json({ success: false, message: "name, email ,phone ,gender,password are required" })
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
                    const data = await user.findByIdAndUpdate(varify._id, { name, email, phone, gender, password }, { new: true })
                    sendOtp(req, res, data, "updated")
                }
            } else {
                // create
                password = bcrypt.hashSync(password, 10);
                const data = await user.create({ name, email, phone, gender, password })
                sendOtp(req, res, data, "created")
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
        let { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ success: false, message: "mobile ,password are required" })
        }

        const data = await user.findOne({ phone, accountCreated: true })
        if (!data) {
            return res.status(500).json({ success: false, message: "user don't exist with this mobile number" })
        }
        if (!bcrypt.compareSync(password, data.password)) {
            return res.status(500).json({ success: false, message: "wrong password" })
        }
        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
        return res.status(200).json({ success: true, data: { id: data._id, phone: data.phone, name: data.name, dp: data.dp }, token })
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
        to: `${data.email}`,
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
        const { email, otp } = req.body
        console.log(req.body.email);
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email id and otp is required" })
        }
        // if (email) {
        //     return res.status(400).json({ success: false, message: "invalid email Id (NaN)" })
        // }
        if (isNaN(otp)) {
            return res.status(400).json({ success: false, message: "invalid otp (NaN)" })
        }
        if (otp.toString().length !== 6) {
            return res.status(400).json({ success: false, message: "otp is invalid ( 6 digit otp)" })
        }

        const validOtp = await otpModal.findOne({ email, otp }).populate("userid")
        if (validOtp) {
            // send token
            await user.findByIdAndUpdate(validOtp.userid._id, { accountCreated: true })
            const token = jwt.sign({ id: validOtp.userid._id }, process.env.JWT_SECRET);
            //    delete otp
            await otpModal.findByIdAndDelete(validOtp._id)
            return res.status(200).json({ success: true, data: { id: validOtp.userid._id, email: validOtp.email, name: validOtp.userid.name, dp: validOtp.userid.dp }, token })
        }

        return res.status(400).json({ success: false, message: "wrong otp or Email number" })


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