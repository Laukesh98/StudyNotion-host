const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const Profile = require('../models/Profile')
const jwt = require('jsonwebtoken')
require("dotenv").config()


// send otp 
exports.sendOTP = async (req, res) => {
    try {
        // Fetch email id from requrest 
        const { email } = req.body

        // check if user already exists
        const checkUserExists =await User.findOne({ email })

        if (checkUserExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // generate OTP 
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        })
        console.log('OTP generated --> ', otp)

        // Checking is otp is unique
        let result = await OTP.findOne({ otp: otp })

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false
            })
            result = await OTP.findOne({ otp: otp })
        }

        const otpPayload = { email, otp }

        // Making entry of otp in db 
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody)

        res.status(200).json({
            success: true,
            message: "Otp generated successfully",
            otp
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


// signup
exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            accountType,
            confirmPassword,
            contactNumber,
            otp
        } = req.body

        if (!firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp) {
            return res.status(403).send({
                success: false,
                message: "Please fill all the input fields properly"
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password do not match"
            })
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log("recentOtp", recentOtp)

        // validate otp
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found in db"
            })
        } else if (otp !== recentOtp[0].otp) {
            //Invalid otp
            return res.status(400).json({
                success: false,
                message: "Invalid OTP "
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        //Optional details which can be filled later on 
        const profileDetails = await Profile.create({
            gender: null,
            DOB: null,
            about: null,
            contactNumber: null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
            contactNumber

        })
        res.status(200).json({
            success: true,
            message: "Account created successfully",
            user
        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Your account could not be created",
        })
    }
}


// log in

exports.logIn = async (req, res) => {
    try {
        //Fetch data from req
        const { email, password } = req.body

        // Validate
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'Please fill all the fields properly'
            })
        }
        // Check if user exists in DB 
        const user = await User.findOne({ email }).populate("additionalDetails")
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exists"
            })
        }

        //Checking password 

        if (await bcrypt.compare(password, user.password)) {

            // Generate JWT 
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" })
            user.password = undefined
            user.token = token
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true             // Only accessible on backend 
            }

            res.cookie('token', token, options).status(200).json({
                success: true,
                message: "Log in successfully",
                token,
                user
            })

        } else {
            res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }




    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Login failed"
        })
    }

}



// change password 

exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({
                    success: false,
                    message: "The password is incorrect"
                });
        }

        // Match new password and confirm new password
        if (newPassword !== confirmNewPassword) {
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            });
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        // Send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};
























