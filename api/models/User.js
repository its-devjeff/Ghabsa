const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minlength: 4,
        maxlength: 100,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/,

    },
     firstname:{
        type:String,
        required:true,
        unique:false,
      
    },
    lastname:{
        type:String,
        required:true,
        unique:false,
    },
    phone:{
        type:String,
        required:true,
        unique:true

    },
    studentId:{
        type:String,
        required:true,
        unique:true

    },
    dob:{
        type:String,
        required:true,
    },
    level:{
        type:String,
        required:true,

    },
    programme:{
        type:String,
        required:true,
        

    },
    password:{
        type:String,
        required:true,
        minlength: 8 // Minimum length of 8 characters
        
     
    }, 
    isAdmin:{
        type:Boolean,
        default:false
    }, 
    hasPaidDues:{
        type:Boolean,
        default:false
    },
    profilePic:{
        type:String,
        default:''
    }

},{timestamps:true}
);

module.exports = mongoose.model("User",UserSchema);