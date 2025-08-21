const mongoose = require("mongoose")
const scehma = mongoose.Schema({
    totalIn:{
        type:Number,
        required:true
    },
    totalOut:{
        type:Number,
        required:true
    },
    profit:{
        type:Number,
        required:true
    },
    payroll:{
        type:Number,
        default:0
    },
    match:{
        type:Number,
        default:0
    },
    misc:{
        type:Number,
        default:0
    },
    totalClear:{
        type:Number,
        default:0
    },
    actualMoney:{
        type:Number,
        default :0
    },
    short:{
        type:Number,
        default:0
    },
    matchPercentage:{
        type:Number,
        default:0
        // required:true
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

const ShiftSummary = mongoose.model("ShiftSummary",scehma)

module.exports = { ShiftSummary }