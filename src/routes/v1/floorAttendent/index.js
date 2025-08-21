const { Router } = require("express");
const authRouter = require("./auth.route");
const customerRouter = require("./customer.route");
const supportRouter = require("./supportHub.route");

const attendentRouter = Router()

attendentRouter.use("/auth",authRouter)
attendentRouter.use("/customer",customerRouter)
attendentRouter.use("/support",supportRouter)

module.exports = attendentRouter;