const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
    gender: {
        type: String,
    },
    DOB: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    },
});

module.exports = mongoose.model("Profile", userProfile);
