const mongoose = require("mongoose")

const contentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})

const Content = mongoose.model("Content", contentSchema)

module.exports = { Content }