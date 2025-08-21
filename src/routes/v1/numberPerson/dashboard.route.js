const { Router } = require("express");
const { calulcateMahinesWeeklyData, graphsData } = require("../../../controllers/numberPerson.controller/dashboard.controller");
const personAuth = require("../../../middlewares/personAuth");

const dashBoardRouter = Router()
dashBoardRouter.use(personAuth())
dashBoardRouter.get("/", calulcateMahinesWeeklyData)
dashBoardRouter.get("/machine-revenue", graphsData)

module.exports = dashBoardRouter