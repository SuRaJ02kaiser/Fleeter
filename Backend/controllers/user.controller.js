const userModel = require("../models/user.model");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const signUp = async(req,res) => {
    try {
        const {username, email, password} = req.body;
        
        const user = await userModel.findOne({email});

        if(user){
            return res.status(409).json("user already avaialble, please login")
        }

        const salt = parseInt(process.env.SALT)||10;
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = await userModel.create({username,email,password:hashedPassword,role:"manager"});
        res.status(201).json({message:'User registered successfully'});
    } catch (err) {
        res.status(500).json({message:"something went wrong", error:err.message});
    }
};


const logIn = async(req ,res) => {
    try {
        const {email,password } = req.body;
        const user = await userModel.findOne({email});
        if (!user || !(await bcrypt.compare(password,user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({token, role:user.role});
    } catch (err) {
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const getDrivers = async(req ,res) =>{
    try{
        const drivers = await userModel.find({createdBy:req.user.userId}).populate("createdBy","username");
        if(drivers.length == 0){
           return res.status(404).json("You havent registered any driver");
        }
        res.status(200).json(drivers);
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const createDriver = async(req ,res) => {
    try {
        const {username, email, password, age, experience, from, mobile, canDrive} = req.body;
        
        const user = await userModel.findOne({email});

        if(user){
            return res.status(300).json("driver already avaialble")
        }

        const salt = parseInt(process.env.SALT);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newDriver = await userModel.create({username,email,password:hashedPassword,age, experience, from, mobile, canDrive, createdBy:req.user.userId ,role:"driver",status:"available"});
        res.status(201).json({message:'Driver added successfully'});
    } catch (err) {
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const deleteDriver = async(req,res) => {
    try{
        const {id} = req.params;
        const deletedDriver = await userModel.findByIdAndDelete(id);
        res.status(201).json({message:"driver deleted",deletedDriver});
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const getUser = async(req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const updateUser = async(req,res) => {
    try{
        const {id} = req.params;
        const updatedUser = await userModel.findByIdAndUpdate(id,req.body);
        res.status(201).json({message:"User updated",updatedUser});
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    } 
}

const getDriverByName = async (req, res) => {
    try {
        const name = req.params.name.toLowerCase();

        const drivers = await userModel.find({createdBy: req.user.userId});

        if(drivers.length === 0){
            return res.status(404).json({ message: "No drivers found for this user." });
        }

        const matchingDrivers = drivers.filter(driver => driver.username.toLowerCase() === name);

        if(matchingDrivers.length === 0){
            return res.status(404).json({ message: "Driver with this name is not available." });
        }

        res.status(200).json(matchingDrivers);
    } catch(err){
        console.error("Error in getDriverByName:", err);

        res.status(500).json({ message: "Something went wrong.", error: err.message });
    }
};


const filterBystatus = async(req,res) => {
    try{
        const filter = req.params.status;
        const drivers = await userModel.find({createdBy:req.user.userId,status:filter})
        if(drivers.length == 0){
           return res.status(404).json("You havent registered any driver");
        }
        res.status(200).json(drivers);
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}

const filterByExp = async (req, res) => {
    try {
        const exp = parseInt(req.params.exp);

        if(isNaN(exp)){
            return res.status(400).json({ message: "Invalid experience value. Please provide a number." });
        }

        const drivers = await userModel.find({ createdBy: req.user.userId, experience: { $gte: exp }});

        if(drivers.length === 0){
            return res.status(404).json({ message: "No drivers found with the specified experience or higher." });
        }

        res.status(200).json(drivers);
    } catch(err){
        console.error("Error in filterByExp:", err);
        res.status(500).json({ message: "Something went wrong.", error: err.message });
    }
};

module.exports = { filterByExp };

module.exports = {signUp,logIn,getDrivers,createDriver,deleteDriver,getUser,updateUser,getDriverByName,filterBystatus,filterByExp};