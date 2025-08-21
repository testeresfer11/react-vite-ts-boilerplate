const mongoose = require("mongoose")
const scehma = mongoose.Schema({
    machineId :{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'SlotMachine'
    },
    shiftId:{
        type:String,
        required:true
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'CustomerAttendent'
    },
    amount:{
        type:Number,
        required:true
    },
    floorAttendent:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'FloorAttendant'
    },
    status:{
        type:String,
        enum:["Active" ,"Inactive"],
        default:"Active"
    }
},{
    timestamps:true
})

const Shift = mongoose.model("ShiftManagement",scehma)
module.exports = { Shift }