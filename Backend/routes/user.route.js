const express = require("express");
const {signUp,logIn,getDrivers,createDriver,deleteDriver,getUser,updateUser,getDriverByName,filterBystatus,filterByExp} = require("../controllers/user.controller");
const userRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware")

userRouter.post("/signup",signUp);//for signup
userRouter.post("/login",logIn);//for login
userRouter.get("/getUser",authMiddleware(["admin","manager"]),getUser);//to get the self
userRouter.get("/drivers",authMiddleware(["admin","manager"]),getDrivers);//for getting all the drivers
userRouter.post("/createDriver",authMiddleware(["manager","admin"]),createDriver)//for creating drive
userRouter.delete("/deleteDriver/:id",authMiddleware(["admin",'manager']),deleteDriver)//to delete a driver
userRouter.patch("/updateDriver/:id",authMiddleware(["admin","manager"]),updateUser);//updating the user info
userRouter.get("/getDriverByName/:name",authMiddleware(["admin","manager"]),getDriverByName)//get Driver by name
userRouter.get("/getDriverByExp/:exp",authMiddleware(["admin","manager"]),filterByExp)//get Driver by Experience
userRouter.get("/getDriverByStatus/:status",authMiddleware(["admin","manager"]),filterBystatus)//get Driver By status

module.exports = userRouter;