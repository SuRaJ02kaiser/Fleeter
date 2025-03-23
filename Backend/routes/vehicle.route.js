const express = require("express");
const {getVehicles,postVehicles,updateVehicles,deletevehicles,getVehicleByName,filterBystatus,filterByMileage}= require("../controllers/vehicle.controller")
const vehicleRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware");


vehicleRouter.get("/getVehicles",authMiddleware(["admin","manager"]),getVehicles);//getting the vehicles
vehicleRouter.post("/create",authMiddleware(["admin","manager"]),postVehicles);//creating the vehicle data from admin/manager side
vehicleRouter.patch("/update/:id",authMiddleware(["admin","manager"]),updateVehicles);//updating the vehicle info
vehicleRouter.delete("/delete/:id",authMiddleware(["admin","manager"]),deletevehicles);//deleting a particular info
vehicleRouter.get("/getVehicleByName/:make/:model",authMiddleware(["admin","manager"]),getVehicleByName);//getting a vehicle by its name
vehicleRouter.get("/getVehicleByStatus/:status",authMiddleware(["admin","manager"]),filterBystatus);//getting the vehicles by status 
vehicleRouter.get("/getVehicleByMileage/:mileage",authMiddleware(["admin","manager"]),filterByMileage);//getting the vehicles by mileage


module.exports = vehicleRouter;
