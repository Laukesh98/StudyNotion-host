const express = require('express')
const app  = express()

require('dotenv').config()

// Routes 
const Course = require('./routes/Course')
const Payments = require('./routes/Payments')
const Profile = require('./routes/Profile')
const User = require('./routes/User')
const contactUsRoute = require("./routes/Contact");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const {cloudinaryConnect} = require('./config/cloudinary')
const fileupload = require('express-fileupload')

const PORT = process.env.PORT || 4000

// Connect DB 
const db = require('./config/database')
db.connect()

// Middleware 
app.use(express.json())     // body parser
app.use(cookieParser())
app.use(
    cors({
    origin:'https://study-notion-host-laukeshs-projects.vercel.app/',
    credentials:true        // This allows cookie jwt other senstive info flow with requests 
}))

app.use(
    fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp'
}))

// Cloudinary connection 
cloudinaryConnect();


// Routes -- API 
app.use('/api/v1/auth', User)
app.use('/api/v1/course',Course )
app.use('/api/v1/payment',Payments )
app.use('/api/v1/profile',Profile )
app.use('/api/v1/reach', contactUsRoute)

// default route 
app.get('/', (req,res)=>{
    return res.json({
        success: true,
        message: "Default route"
    })
} )

app.listen(PORT, ()=>{
    console.log(`Server started at post no: ${PORT}`)
})
