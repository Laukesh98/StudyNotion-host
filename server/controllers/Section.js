const Section = require("../models/Section")
const Course = require("../models/Course")
const SubSection = require('../models/SubSection')

exports.createSection = async (req, res) => {
	try {
		// Fetch and validate
		const { sectionName, courseId } = req.body

		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Fill fields properly"
			})
		}
		// New course creation 
		const newSection = await Section.create({ sectionName })

		// Updating course from created section object id 
		const updatedCourse = await Course.findByIdAndUpdate(courseId, {
			$push: {
				courseContent: newSection._id
			}
		}, { new: true })
			////checking is fields are properly polulated 
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection"
				}
			})


		return res.status(200).json({
			success: true,
			message: "New section created successfully",
			updatedCourse
		})

	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: "New section could not be created "
		})

	}
}





// Update section 
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId, courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		res.status(200).json({
			success: true,
			message: section,
			data: course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// Delete section 

exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId } = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if (!section) {
			return res.status(404).json({
				success: false,
				message: "Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({ _id: { $in: section.subSection } });

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path: "courseContent",
			populate: {
				path: "subSection"
			}
		})
			.exec();

		res.status(200).json({
			success: true,
			message: "Section deleted",
			data: course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   