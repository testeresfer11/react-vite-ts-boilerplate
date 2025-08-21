const { Router } = require("express");
const auth = require("../../../middlewares/auth");
const { createSalary, getSalary, deleteSalary, getSalaryById, editSalary } = require("../../../controllers/admin.controller/salary.controller");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");

const salaryRouter = Router()

salaryRouter.use(auth())
salaryRouter.route("/")
    .post(validate(adminValidation.createSalary), createSalary)
    .get(getSalary)
    .delete(validate(adminValidation.deleteIds), deleteSalary)
salaryRouter.route("/:id").get(validate(adminValidation.getContent),getSalaryById)
salaryRouter.route("/edit/:id").post(validate(adminValidation.editSalary),editSalary)

module.exports = salaryRouter;