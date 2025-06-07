const { default: mongoose } = require('mongoose')
const Course = require('../models/Course')
const RatingAndReviews = require('../models/RatingAndReviews')

//Create rating
exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id
        const { rating, reviews, courseId } = req.body

        // check if user have course that is being reviewed
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentsEnrolled: { $elemMatch: { $eq: userId } }
            }
        )
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Studen not enrolled in this course'
            })
        }

        // Check if already reviewed 
        const alreadyReview = await RatingAndReviews.findOne({
            user: userId,
            course: courseId

        })
        if (alreadyReview) {
            return res.status(403).json({
                success: false,
                message: 'You already rated and reviewed this course'
            })
        }

        // Create rating and review
        const createdRatingAndReview = await RatingAndReviews.create({
            user: userId,
            rating,
            reviews,
            course: courseId
        })
 
        // Update course this newly created rating and reviews
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $push: {
                ratingAndReviews: createdRatingAndReview._id
            }
        }, { new: true })


        return res.status(200).json({
            success: true,
            message: 'Rating and response have been created',
            createdRatingAndReview,
            updatedCourse
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}



// Get avg ratings

exports.getAvgRating = async (req, res) => {
    try {
        // get id
        const courseId = req.body.courseId

        // Calculate avg rating
        const result = await RatingAndReviews.aggregate([
            {
                $match: {
                    course: mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null, // When we don't know on what basis we want to group
                    avgRating: { $avg: "$rating" }
                }
            }
        ])

        // Return rating 
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                avgRating: result[0].avgRating


            })
        }
        // If no rating exists 
        return res.status(200).json({
            success: false,
            message: 'Course not rated yet ',
            avgRating: 0
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get all rating and reviews 

exports.getAllRating = async (req, res) => {

    try {
        const allRating = await RatingAndReviews.find({})
            .sort({ rating: 'desc' })
            .populate({
                path: 'user',
                select: 'firstName lastName email image'
            })
            .populate({
                path: "course",
                select: "courseName"
            })
            .exec()

        return res.status(200).json({
            success: true,
            message: 'All rating and reviews fetched successfully',
            data: allRating
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}