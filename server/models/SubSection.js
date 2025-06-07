const mongoose = require("mongoose")

const subSection = new mongoose.Schema({
    title: {
        type: String,
    },
    timeDuration: {
        type: Number,
    },
    description: {
        type: String
    },
    videoURL: {
        type: String
    }
})

module.exports = mongoose.model("SubSection", subSection)