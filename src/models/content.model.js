const mongoose = require("mongoose")
const scehma = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
},

    {
        timestamps: true,
    })
const Content = mongoose.model("Content", scehma)

module.exports = { Content }