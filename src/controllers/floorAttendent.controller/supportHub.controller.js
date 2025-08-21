const httpStatus = require("http-status");
const { HelpNSupport } = require("../../models/help&support.model");
const catchAsync = require("../../utils/catchAsync");

const helpAndSupport = catchAsync(async (req,res) =>{
    const data = await HelpNSupport.create(req.body)
    return res.status(httpStatus.CREATED).send({message:"Messsage Sent",data})
})

module.exports = { helpAndSupport }