const Category = require("../models/Category")
const Course = require("../models/Course")

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }



exports.createCategory = async (req, res) => {
	try {
		// fetch
		const { name, description } = req.body
		// Validate
		if (!name) {
			return res.status(400).json({
				success: false,
				message: "Fill fileds properly"
			})
		}
		// Creating entry on DB 
		const categoryDetails = await Category.create({
			name,
			description
		})
		console.log(categoryDetails)

		res.status(201).json({
			success: true,
			message: "Category created successfully"
		})


	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Category creation failed failed"
		})
	}
}


// Fetch all Category 

exports.showAllCategories = async (req, res) => {
	try {
		const allCategorys = await Category.find({})
		res.status(200).json({
			success: true,
			message: "All category returned successfully",
			data: allCategorys
		})


	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: "Something went wrong while getting all the category"
		})
	}
}



// Category page details 

exports.categoryPageDetails = async (req, res) => {
	try {
		// Fetch 
		const { categoryId } = req.body
		// get all cources for fetched category id 
		const selectedCategory = await Category.findById(categoryId)
		.populate({
			path: "courses",
			match: { status: "Published" },
			populate: "ratingAndReviews",
		})
		.exec()
		
		//Validation 
		if (!selectedCategory) {
			return res.status(404).json({
				success: false,
				message: 'No cource found for this category'
				
			})
		}
		
		// Handle the case when there are no courses
		if (selectedCategory.courses.length === 0) {
			console.log("No courses found for the selected category.")
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			})
		}
		
		
		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		})
		let differentCategory = await Category.findOne(
			categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
			._id
		)
		.populate({
			path: "courses",
			match: { status: "Published" },
		})
		.exec()
		//console.log("Different COURSE", differentCategory)
		// Get top-selling courses across all categories
		const allCategories = await Category.find()
		
		.populate({
			path: "courses",
			match: { status: "Published" },
			populate: {
				path: "instructor",
			},
		})
		.exec()
		const allCourses = allCategories.flatMap((category) => category.courses)
		const mostSellingCourses = allCourses
		.sort((a, b) => b.sold - a.sold)
		.slice(0, 10)
		// console.log("mostSellingCourses COURSE", mostSellingCourses)
		res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				differentCategory,
				mostSellingCourses,
			},
		})
		

	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: "Error while getting category page details "

		})
	}
}





