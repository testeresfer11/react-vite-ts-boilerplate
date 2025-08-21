const express = require('express');
const floorRouter = require("./floorAttendent.route");
const rfidRouter = require('./rfid.route');
const numberPersonRouter = require('./numberPerson.route');
const customerRouter = require('./customer.route');
const slotRouter = require('./slotMachine.route');
const contentRouter = require('./content.route');
const FAQRouter = require('./faq.route');
const notificationRouter = require('./notification.route');
const salaryRouter = require('./salary.route');
const shiftRouter = require('./shift.route');
const dashboardRouter = require('./dashboard.route');
const router = express.Router();

router.use("/floorAttendent",floorRouter)
router.use("/rfid",rfidRouter)
router.use("/numberPerson",numberPersonRouter)
router.use("/customer",customerRouter)
router.use("/slotMachine" , slotRouter)
router.use("/content",contentRouter)
router.use("/faq" , FAQRouter)
router.use("/notification" , notificationRouter)
router.use("/salary",salaryRouter)
router.use("/shift", shiftRouter)
router.use("/dashboard",dashboardRouter)
module.exports = router