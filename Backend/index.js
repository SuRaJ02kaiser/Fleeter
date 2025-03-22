const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./config/db");
const app = express();
const path = require("path");
const userRouter = require("./routes/user.route");
const vehicleRouter = require("./routes/vehicle.route");
const routeRouter = require("./routes/route.route");

app.use(cors());

app.use(express.json());

app.use(express.static('public'));

connectDb();

app.get("/test",(req,res) => {
    res.send("Healthy");
})

app.use("/user",userRouter);

app.use("/vehicle",vehicleRouter);

app.use("/route",routeRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("Server is running on port",PORT));
