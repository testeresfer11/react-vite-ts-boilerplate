const express = require('express');
const adminController = require("../../../controllers/admin.controller/floorAttendent.controller");
const auth = require("../../../middlewares/auth");
const userValidation = require('../../../validations/auth.validation');
const validate = require('../../../middlewares/validate');
const { adminValidation } = require('../../../validations');

const router = express.Router();
router.use(auth());
router.route("/")
  .post( validate(userValidation.createAttendents), adminController.createAttendent)
  .get(adminController.getAttendants)
  .delete( validate(adminValidation.deleteIds),adminController.deleteAttendent)
router.route("/all").get(adminController.getAllAttendents)
router.route("/:id").get(validate(adminValidation.getContent),adminController.getAttendentById)
router.route("/edit/:id").post(validate(adminValidation.editAttendents),adminController.editAttendent)

module.exports = router;
