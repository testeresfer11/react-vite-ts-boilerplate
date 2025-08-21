const { Router } = require("express");
const auth = require("../../../middlewares/auth");
const { createVendor, getVendors, deleteVendor } = require("../../../controllers/admin.controller/vendor.controller");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");

const vendorRouter = Router()

vendorRouter.use(auth())
vendorRouter.route("/")
    .post(validate(adminValidation.createVendor), createVendor)
    .get(getVendors)
    .delete(validate(adminValidation.deleteIds),deleteVendor)

module.exports = vendorRouter;