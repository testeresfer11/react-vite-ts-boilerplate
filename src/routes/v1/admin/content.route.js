const { Router } = require("express");
const { createContent, getContent, getContentById, editContent, deleteContent } = require("../../../controllers/admin.controller/content.controller");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");
const auth = require("../../../middlewares/auth");

const contentRouter = Router()
contentRouter.route("/")
    .post(auth(),validate(adminValidation.postContent), createContent)
    .get(auth(),getContent)
    .delete(auth(),validate(adminValidation.deleteIds),deleteContent)
contentRouter.route("/:id").get(validate(adminValidation.getContent), getContentById)
contentRouter.route("/edit/:id").post(auth(),validate(adminValidation.editContent), editContent)

module.exports = contentRouter