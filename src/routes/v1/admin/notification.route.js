const { Router } = require("express");
const { sendNotification, recieveNotification, deleteNotification, deleteAllNotification, deleteSelectedNotification, markedAsRead, markedAllAsRead } = require("../../../controllers/notification.controller");
const auth = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");

const notificationRouter = Router()

// notificationRouter.use(auth())
notificationRouter.route("/")
    .post(sendNotification)
    .get(auth(), recieveNotification)
    .delete(auth(), validate(adminValidation.deleteIds), deleteNotification)
notificationRouter.route("/all").delete(auth(), deleteAllNotification).post(auth() , markedAllAsRead)
notificationRouter.route("/selected").delete(auth(), deleteSelectedNotification).post(auth(), markedAsRead)


module.exports = notificationRouter;