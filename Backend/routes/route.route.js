const express = require("express");
const authMiddleware = require("../middleware/auth.middleware")
const routeModel = require("../models/route.model")
const routeRouter = express.Router();



routeRouter.post("/create", authMiddleware(["admin", "manager"]), async (req, res) => {
    try{
        const {start, destination} = req.body;

        if(!req.user || !req.user.userId){
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const newRoute = await routeModel.create({
            start,
            destination,
            createdBy: req.user.userId 
        });

        res.status(201).json({ message: "Journey saved successfully", data: newRoute });
    } catch(err){
        console.error("Error saving journey:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});

routeRouter.get("/get", authMiddleware(["admin","manager"]), async (req ,res) => {
    try{
        const routes = await routeModel.find({createdBy:req.user.userId})
        res.status(200).json(routes)
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
})

routeRouter.delete("/delete/:id", authMiddleware(["admin","manager"]), async (req ,res) => {
    try{
        const {id} = req.params;
        const deleted = await routeModel.findByIdAndDelete(id);
        res.status(200).json("route deleted")
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
})


module.exports = routeRouter;