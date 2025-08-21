const { Router } = require("express");
const { helpAndSupport } = require("../../../controllers/floorAttendent.controller/supportHub.controller");
const attendentAuth = require("../../../middlewares/attendentAuth");
const validate = require("../../../middlewares/validate");
const { floorAttendentValidation } = require("../../../validations");

const supportRouter = Router()
// supportRouter.use(attendentAuth())
supportRouter.route("/").post(validate(floorAttendentValidation.helpNsupport), helpAndSupport)

module.exports = supportRouter

/**
 * @swagger
 * /attendant/support:
 *   post:
 *     summary: Help And Support
 *     tags: [Floor Attendant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin
 *               email:
 *                 type: string
 *                 example: admin1@yopmail.com
 *               phone:
 *                 type: string
 *                 example: 789461232
 *               message:
 *                 type: string
 *                 example: Help Help !
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Messsage Sent
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 678de110d838778645dbfb58
 *                     name:
 *                       type: string
 *                       example: Admin
 *                     email:
 *                       type: string
 *                       example: admin1@yopmail.com
 *                     phone:
 *                       type: string
 *                       example: 789461232
 *                     message:
 *                       type: string
 *                       example: Help Help !
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-20T05:37:20.690Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2025-01-20T05:37:20.690Z
 *                     __v:
 *                       type: integer
 *                       example: 0
 */

