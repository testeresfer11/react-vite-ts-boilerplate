const { Router } = require("express");
const authRouter = require("./auth.route");
const shiftRouter = require("./shiftReport.route");
const dashBoardRouter = require("./dashboard.route");

const personRouter = Router()
personRouter.use("/auth",authRouter)
personRouter.use("/shift", shiftRouter)
personRouter.use("/dashboard" , dashBoardRouter)

module.exports = personRouter