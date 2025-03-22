const vehicleModel = require("../models/vehicle.model");


const getVehicles = async(req ,res) => {
    try{
        const vehicles = await vehicleModel.find({ownerId:req.user.userId}).populate("ownerId","username");
        res.status(200).json(vehicles);
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const postVehicles = async(req,res) => {
    try{
        const {make,model,licensePlate,mileage,manufacturingYear,type,status} = req.body;
        const newVehicle = await vehicleModel.create({
            make, model, licensePlate, mileage, manufacturingYear, type,status:"active", ownerId: req.user.userId
        });        
        res.status(201).json("New Vehicle Created");
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const updateVehicles = async(req,res) => {
    try{
        const {id} = req.params;
        const updatedVehicle = await vehicleModel.findByIdAndUpdate(id,req.body);
        res.status(201).json({message:"Vehicle updated",updatedVehicle});
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    } 
}


const deletevehicles = async(req ,res) => {
    try{
        const {id} = req.params;
        const deletedVehicle = await vehicleModel.findByIdAndDelete(id);
        res.status(201).json({message:"Vehicle deleted",deletedVehicle});
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    } 
}


module.exports = {getVehicles,postVehicles,updateVehicles,deletevehicles};