const { Router } = require("express");
const { adminValidation } = require("../../../validations");
const auth = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { getSecurityPersonnel, createSecurityPersonnel, deleteSecurityPersonnel } = require("../../../controllers/admin.controller/security.controller");

const securityRouter = Router()

securityRouter.use(auth())
securityRouter.route("/")
    .post(validate(adminValidation.createSecurity), createSecurityPersonnel)
    .get(getSecurityPersonnel)
    .delete(validate(adminValidation.deleteIds),deleteSecurityPersonnel)

module.exports = securityRouter;