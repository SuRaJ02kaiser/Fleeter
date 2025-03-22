require("dotenv").config();
const mongoose = require("mongoose");


const connectDb = async(req ,res) =>{
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDb");
    } catch(err){
        console.log("Error occured while connecting DB",err);
        process.exit(1);
    }
};


module.exports = connectDb;
