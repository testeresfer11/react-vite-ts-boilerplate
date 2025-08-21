const mongoose = require("mongoose");

const schema = mongoose.Schema({
    employeeId:{
        type:String,
        requried:true
    },
    designation:{
        type:String,
        requried:true
    },
    salary:{
        type:String,
        required:true
    }
},{
    timestamps:true
}) 
const Salary = mongoose.model("Salary",schema)
module.exports = Salary