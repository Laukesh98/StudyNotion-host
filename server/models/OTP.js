const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')
const mailTemplate = require('../mail/templates/emailVerificationTemplate')

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60             // In seconds this is 5 minutes
    }
})

// ---> Function to send mail 
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email,
            'Your OTP for verification on Study Notion',
            mailTemplate(otp)
            )
        console.log('Email send successfully', mailResponse)

    } catch (error) {
        console.log('Error while trying to send email', error)
        throw error;
    }
}

OtpSchema.pre('save', async function(next){
    await sendVerificationEmail(this.email, this.otp)
    next();
})


module.exports = mongoose.model("OTP", OtpSchema)