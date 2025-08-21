const { Router } = require("express");
const { countAllRolesUser } = require("../../../controllers/admin.controller/dashboard.controller");
const auth = require("../../../middlewares/auth");

const dashboardRouter = Router()
dashboardRouter.use(auth())
dashboardRouter.route("/count").get(countAllRolesUser)

module.exports  = dashboardRouter