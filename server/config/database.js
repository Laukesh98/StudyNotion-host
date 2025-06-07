const mongoose = require("mongoose")
require('dotenv').config()

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('Mongo db connected successfully')
    })
    .catch((err)=>{
        console.log(err)
        console.log('Error while connecting to the mongo DB ')
        process.exit(1)
    })
}