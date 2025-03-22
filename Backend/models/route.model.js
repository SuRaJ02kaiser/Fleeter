const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    start: {type:String, required:true},
    destination: {type:String, required:true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref:"User"}
},{
    timestamps:true
});

const routeModel = mongoose.model("Route",routeSchema);

module.exports = routeModel;