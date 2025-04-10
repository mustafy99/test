const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    
    full_name:{
        type:String,
        required: true
    }, 
    email:{
        type:String,
        required: true,
        unique:true
    },

    password:{
        type:String,
        required: true,
    },

   natinalID:{
        type:String,
        required: false,
        unique:false
    },

    phone:{
        type:String,
        required: false,
        unique:false
    },

    role:{
        type:String,
        required: false,
        enum:['patint','nurse','SuberVisor','admin']
    },

},{timestamps:true});


module.exports = mongoose.model("userModel",UserSchema);