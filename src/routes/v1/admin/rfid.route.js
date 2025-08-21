const { Router } = require("express");
const auth = require("../../../middlewares/auth");
const rfidController = require("../../../controllers/admin.controller/rfid.controller");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");

const rfidRouter = Router()

// rfidRouter.use(auth());
rfidRouter.route("/")
    .post(validate(adminValidation.tagId),rfidController.createNewTag)
    .get(auth() , rfidController.getTag)
rfidRouter.route("/tags").get(rfidController.getAllTags)
rfidRouter.route("/user").get(rfidController.getAllUsers)
rfidRouter.route("/issue").post(auth(),validate(adminValidation.issueTagToUser) , rfidController.issueTagToUser)
rfidRouter.route("/block").put(auth(),validate(adminValidation.blockTag), rfidController.toggleBlockTag)
module.exports = rfidRouter;