const mongoose = require("mongoose")

const InternPostSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        
    },
    title:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        default:"",
    
    },
    desc:{
        type:String,
        required:true,
      
    }

},{timestamps:true}
);

module.exports = mongoose.model("InternPost",InternPostSchema);