const mongoose = require("mongoose")
const { schema } = require("./token.model")
const scehma = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
},

    {
        timestamps: true,
    })
const FAQ = mongoose.model("Faq", scehma)

module.exports = { FAQ }