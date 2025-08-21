const { Router } = require("express");
const auth = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const userValidation = require('../../../validations/auth.validation');
const { createNumberPerson, getNumberPerson, deleteNumberPerson, getAllNumberPerson, getNumberPersonById, editNumberPerson } = require("../../../controllers/admin.controller/numberPerson.controller");
const { adminValidation } = require("../../../validations");

const numberPersonRouter = Router();
numberPersonRouter.use(auth())
numberPersonRouter.route("/")
    .post(validate(userValidation.createAttendents), createNumberPerson)
    .get(getNumberPerson)
    .delete(validate(adminValidation.deleteIds) , deleteNumberPerson)
numberPersonRouter.route("/all").get(getAllNumberPerson)
numberPersonRouter.route("/:id").get(validate(adminValidation.getContent),getNumberPersonById)
numberPersonRouter.route("/edit/:id").post(validate(adminValidation.editAttendents),editNumberPerson)

module.exports = numberPersonRouter