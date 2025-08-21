const mongoose = require("mongoose")

const scehma = mongoose.Schema({
    machineId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SlotMachine"
    },
    totalIn:{
        type:Number,
        required:true
    },
    totalOut:{
        type:Number,
        required:true
    },
    numberPersonId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"NumberPerson"
    },
    date:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})

const ShiftReport = mongoose.model("ShiftReport",scehma)
module.exports = { ShiftReport }