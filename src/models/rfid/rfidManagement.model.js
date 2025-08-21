const mongoose = require("mongoose");
const crypto = require("crypto"); 
const schema = mongoose.Schema({
    tagId: {
        type: String,
        unique: true, 
        required: true, 
    },
    role: {
        type: String,
        required: true,
        enum: ['Floor Attendant', 'Number Person', 'Customer']
    },
    blocked: { 
        type: Boolean, 
        default: false,  
    },
    issued:{
        type:Boolean,
        default:false
    },
    floorAttendent:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "FloorAttendant",
    },
    numberPerson:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "NumberPerson",
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "CustomerAttendent"
    },
    qrCode:{
        type:String
    }
}, {
    timestamps: true, 
});

const generateTagId = () => {
    return crypto.randomBytes(16).toString("hex"); 
};

const RFID = mongoose.model("RFID", schema);

schema.pre("save", async function(next) {
    if (!this.tagId) {
        this.tagId = generateTagId(); 
    }
    next();
});

module.exports = RFID;
