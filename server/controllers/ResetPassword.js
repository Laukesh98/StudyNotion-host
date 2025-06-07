const User = require("../models/User")
const mailSender = require('../utils/mailSender')
const bcrypt = require('bcrypt')

// reset password token 
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not registered with us"
            })
        }
        // generate token 
        const token = crypto.randomUUID();
        // update user by adding token and expiration time 
        const updatedDetails = await User.findOneAndUpdate({ email: email }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
        }, { new: true })

        // New url 
        const url = `http://localhost:3000/update-password/${token}`

        // send mail with the url 
        await mailSender(email,
            "Your password reset link is - ",
            `Click here to rest your password ${url}`)
        return res.status(200).json({
            success: true,
            message: "Reset link have been send to your email"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset link"
        })
    }
}

// reset password

exports.resetPassword = async (req, res) => {
    try {
        // Fetch
        const { password, confirmPassword, token } = req.body

        // Validate
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password do not match"
            })
        }
        const userDetails = await User.findOne({ token: token })
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            })
        }
        // Check if token is expired or not 
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(200).json({
                success: false,
                message: "Link expired"
            })
        }

        // hash password 
        const hashPassword = await bcrypt.hash(password, 10)

        // Password update
        await User.findOneAndUpdate(
            { token: token },               // Find doc on the basis of this 
            { password: hashPassword },    // And update
            { new: true }      // Return updated doc
        )

        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Password could not be resetted "
        })
    }
}