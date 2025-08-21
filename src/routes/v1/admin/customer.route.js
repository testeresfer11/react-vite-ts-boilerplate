const { Router } = require("express");
const auth = require("../../../middlewares/auth");
const upload = require("../../../middlewares/multer");
const { getCustomer, createCustomer, deleteCustomer, getAllCustomer, getCustomerById, editCustomer } = require("../../../controllers/admin.controller/customer.controller");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");

const customerRouter = Router();

customerRouter.use(auth());
customerRouter.route("/")
    .post(validate(adminValidation.createCustomer), createCustomer)
    .get(getCustomer)
    .delete(validate(adminValidation.deleteIds), deleteCustomer);
customerRouter.route("/all").get(getAllCustomer)
customerRouter.route("/:id").get(validate(adminValidation.getContent),getCustomerById)
customerRouter.route("/edit/:id").post(validate(adminValidation.editCustomer), editCustomer)
module.exports = customerRouter;
