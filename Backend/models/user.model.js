const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type:String,required:true},
    email: {type: String, unique: true,required:true},
    password: {type:String,required:true},
    age: Number,
    experience: Number,
    from: String,
    mobile: Number,
    status: {type: String, enum: ["available" , "not available"]},
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    canDrive: [{type:String, enum:["light", "semi", "heavy"]}],
    role: {type: String, enum: ['admin', 'manager', 'driver'], default:"manager"}
}, {timestamps: true});

const userModel = mongoose.model("User",userSchema);


module.exports = userModel;