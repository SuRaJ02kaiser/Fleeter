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


const getVehicleByName = async (req, res) => {
    try {
        const make = req.params.make;
        const model = req.params.model;

        const vehicles = await vehicleModel.find({
            ownerId: req.user.userId,
            make: { $regex: new RegExp(`^${make}$`, 'i') },
            model: { $regex: new RegExp(`^${model}$`, 'i') }
        });

        if(vehicles.length === 0){
            return res.status(404).json({ message: "No vehicles found with the specified make and model." });
        }

        res.status(200).json(vehicles);
    } catch (err) {
        console.error("Error in getVehicleByName:", err);
        res.status(500).json({ message: "Something went wrong.", error: err.message });
    }
};


const filterBystatus = async(req,res) => {
    try{
        const filter = req.params.status.toLowerCase();
        const vehicles = await vehicleModel.find({ownerId:req.user.userId,status:filter})
        if(vehicles.length == 0){
           return res.status(404).json(`You dont have any vehicles with ${filter} status`);
        }
        res.status(200).json(vehicles);
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const filterByMileage = async (req, res) => {
    try {
        const mil = parseInt(req.params.mileage);

        if(isNaN(mil)){
            return res.status(400).json({ message: "Invalid mileage value. Please provide a number." });
        }

        const vehicles = await vehicleModel.find({ ownerId: req.user.userId,mileage : { $gte: mil }});

        if(vehicles.length === 0){
            return res.status(404).json({ message: "No vehicles found with the specified mileage or higher." });
        }

        res.status(200).json(vehicles);
    } catch(err){
        console.error("Error in filterByMileage:", err);
        res.status(500).json({ message: "Something went wrong.", error: err.message });
    }
};



module.exports = {getVehicles,postVehicles,updateVehicles,deletevehicles,getVehicleByName,filterBystatus,filterByMileage};