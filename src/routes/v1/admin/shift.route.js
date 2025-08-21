const { Router } = require("express");
const auth = require("../../../middlewares/auth");
const { getAllShifts, getAllSummaries } = require("../../../controllers/admin.controller/shift.controller");

const shiftRouter = Router()

shiftRouter.use(auth())
shiftRouter.route("/").get(getAllShifts)
shiftRouter.route("/summary").get(getAllSummaries)

module.exports = shiftRouter