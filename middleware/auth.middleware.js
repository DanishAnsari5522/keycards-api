const jwt = require("jsonwebtoken")
require("dotenv").config()

const authlogin = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer ")) {
        const token = authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.userid = decoded.id

        } catch (error) {
            return res.status(401).json({ success: false, message: "you are not authorize to access this route" })
        }
    } else {
        return res.status(401).json({ success: false, message: "no token provided ,hence not authorize to access this route" })
    }
    next()
}
module.exports = authlogin