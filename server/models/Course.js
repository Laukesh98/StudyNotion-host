const mongoose = require("mongoose")



const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true
    },
    courseDescription: {
        type: String,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"

    }],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    tag: {
        type: [String],
        required: true
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    instructions: {
        type: [String],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    status: {
        type: String,
        enum: ["Draft", "Published"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Course", courseSchema)

