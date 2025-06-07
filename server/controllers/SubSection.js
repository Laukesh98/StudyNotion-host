const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const { uploadImageToCloudinary } = require('../utils/imageUploader')

// Creating subsection 
exports.createSubSection = async (req, res) => {
    try {
        const { title, description, sectionId } = req.body
        const video = req.files.video

        if (!title ||
            !description ||
            !video ||
            !sectionId
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // Upload lecture to the clodinary
        const uploadVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        // Create new subsection 
        const newSubSection = await SubSection.create({
            title: title,
            timeDuration: `${uploadVideo.duration}`,
            description: description,
            videoURL: uploadVideo.secure_url
        })

        // provide new created subsection id to the section 
        const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId }, {
            $push: {
                subSection: newSubSection._id
            }
        }, { new: true })
            .populate("subSection")

        return res.status(200).json({
            success: true,
            message: "New sub section created successfully",
            data: updatedSection
        })  





    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Something went wrong while creating new sub section ',
            error: error.message
        })
    }
}


// Update subsection 

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate("subSection")


        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        })
    }
}




// Delete subsection 

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            data: updatedSection,
            message: "SubSection deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        })
    }
}