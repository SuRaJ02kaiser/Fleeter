const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    licensePlate: { type: String, unique: true, required: true },
    mileage: { type: Number, required: true },
    manufacturingYear: { type: Number, required: true },
    type: { type: String, enum: ["light","heavy"], required: true },
    status: { type: String, enum: ["active", "maintenance"], default: "active"},
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
},{
    timestamps:true
});

const vehicleModel = mongoose.model("Vehicle",vehicleSchema);

module.exports = vehicleModel;