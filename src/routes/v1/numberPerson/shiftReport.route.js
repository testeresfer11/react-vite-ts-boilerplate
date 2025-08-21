const { Router } = require("express");
const personAuth = require("../../../middlewares/personAuth");
const { getAllMachines,  getCurrentDateSummary, editSummary, AddMachine, EditMachine, getMachines } = require("../../../controllers/numberPerson.controller/shift.controller");
const validate = require("../../../middlewares/validate");
const { numberPersonValidation } = require("../../../validations");

const shiftRouter = Router()

shiftRouter.use(personAuth())
shiftRouter.route("/machine")
    .post(validate(numberPersonValidation.addMachine), AddMachine)
    .get(validate(numberPersonValidation.getMachines), getAllMachines)
shiftRouter.route("/machine-list").get(getMachines)
shiftRouter.route("/edit-machine/:id").post(validate(numberPersonValidation.editMachine), EditMachine)
shiftRouter.route("/summary")
    .get(getCurrentDateSummary)
shiftRouter.route("/edit-summary/:summaryId").post(validate(numberPersonValidation.editSummary), editSummary)

module.exports = shiftRouter

/**
 * @swagger
 * /person/shift/machine:
 *   post:
 *     summary: Add machine for total in total out
 *     tags: [Number Person]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               machineId:
 *                 type: string
 *                 example: 677bb3baa125fc97d95f408d
 *               totalIn:
 *                 type: integer
 *                 example: 78945
 *               totalOut:
 *                 type: integer
 *                 example: 96548
 *     responses:
 *       201:
 *         description: Machine added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Machine Added
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 678de7282c78df9a8be912aa
 *                     machineId:
 *                       type: string
 *                       example: 67766a4d09438a41c0139066
 *                     totalIn:
 *                       type: integer
 *                       example: 78945
 *                     totalOut:
 *                       type: integer
 *                       example: 96548
 *                     date:
 *                       type: string
 *                       example: 2025-01-20T06:03:20.394Z
 *                     numberPersonId:
 *                       type: string
 *                       example: 677fbc81103275a2be98ca93
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-20T06:03:20.398Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2025-01-20T06:03:20.398Z
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Machine already exists or not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Machine Already Exists for today or Machine Not found
 */

/**
 * @swagger
 * /person/shift/machine:
 *  get:
 *    summary: Get All machines on the basis of month or date
 *    tags: [Number Person]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: startDate
 *        description: Start date in ISO 8601 format (e.g., 'YYYY-MM-DD')
 *        schema:
 *          type: string
 *          format: date
 *      - in: query
 *        name: endDate
 *        description: End date in ISO 8601 format (e.g., 'YYYY-MM-DD')
 *        schema:
 *          type: string
 *          format: date
 *      - in: query
 *        name: month
 *        description: format (e.g.,'YYYY-MM)
 *      - in: query
 *        name: page
 *      - in: query
 *        name: limit
 *    responses:
 *      200:
 *        description: Machine Lists
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Machine Lists"
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      machineId:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                          vendingPercentage:
 *                            type: integer
 *                          machineId:
 *                            type: string
 *                      totalIn:
 *                        type: integer
 *                      totalOut:
 *                        type: integer
 *                      date:
 *                        type: string
 *                        format: date-time
 *                      numberPersonId:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                          name:
 *                            type: string
 *                          email:
 *                            type: string
 *                          phone:
 *                            type: string
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                      updatedAt:
 *                        type: string
 *                        format: date-time
 *                      __v:
 *                        type: integer
 *                        example: 0
 */

/**
 * @swagger
 * /person/shift/edit-machine/{id}:
 *  post:
 *    summary: Edit machine for total-in total-out
 *    tags: [Number Person]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the machine to be edited
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              machineId:
 *                type: string
 *              totalIn:
 *                type: integer
 *              totalOut:
 *                type: integer
 *    responses:
 *      200:
 *        description: Machine Edited
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Machine Edited"
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    machineId:
 *                      type: string
 *                    totalIn:
 *                      type: integer
 *                    totalOut:
 *                      type: integer
 *                    date:
 *                      type: string
 *                      format: date-time
 *                    numberPersonId:
 *                      type: string
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *                    __v:
 *                      type: integer
 *                      example: 0
 *      400.1:
 *        description: Account Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Account Not found"
 *      400.2:
 *        description: Machine Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Machine Not found"
 */

/**
 * @swagger
 * /person/shift/summary:
 *  get:
 *    summary: Get Summary by Date
 *    tags: [Number Person]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: date
 *        schema:
 *          type: string
 *          format: date-time
 *    responses:
 *      200:
 *        description: Summary retrieved
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Summary retrieved"
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    totalIn:
 *                      type: integer
 *                    totalOut:
 *                      type: integer
 *                    profit:
 *                      type: integer
 *                    payroll:
 *                      type: integer
 *                    match:
 *                      type: integer
 *                    misc:
 *                      type: integer
 *                    totalClear:
 *                      type: integer
 *                    actualMoney:
 *                      type: integer
 *                    short:
 *                      type: integer
 *                    matchPercentage:
 *                      type: number
 *                      format: float
 *                    date:
 *                      type: string
 *                      format: date-time
 *                    numberPersonId:
 *                      type: string
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *                    __v:
 *                      type: integer
 *                      example: 0
 */

/**
 * @swagger
 * /person/shift/edit-summary/{summaryId}:
 *  post:
 *    summary: Edit Summary
 *    tags: [Number Person]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: summaryId
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the summary to be edited
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              payroll:
 *                type: integer
 *              match:
 *                type: integer
 *              misc:
 *                type: integer
 *              actualMoney:
 *                type: integer
 *    responses:
 *      200:
 *        description: Summary Edited
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    totalIn:
 *                      type: integer
 *                    totalOut:
 *                      type: integer
 *                    profit:
 *                      type: integer
 *                    payroll:
 *                      type: integer
 *                    match:
 *                      type: integer
 *                    misc:
 *                      type: integer
 *                    totalClear:
 *                      type: integer
 *                    actualMoney:
 *                      type: integer
 *                    short:
 *                      type: integer
 *                    matchPercentage:
 *                      type: number
 *                      format: float
 *                    date:
 *                      type: string
 *                      format: date-time
 *                    numberPersonId:
 *                      type: string
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *                    __v:
 *                      type: integer
 *                      example: 0
 *      404:
 *        description: Summary not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "Summary not found."
 *      400:
 *        description: No machine data found for the given criteria
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "No machine data found for the given criteria."
 */


