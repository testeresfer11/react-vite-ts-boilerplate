const mongoose = require("mongoose")
const scehma = mongoose.Schema({
    machineId: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
    },
    vendingPercentage: {
        type: Number,
        // required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String
    },
    question: {
        type: String,
    },
    answer: {
        type: String
    },
    status:{
        type:String,
        enum:["Active" ,"Inactive"],
        default:"Inactive"
    }
},

    {
        timestamps: true,
    })
const SlotMachine = mongoose.model("SlotMachine", scehma)

module.exports = { SlotMachine }