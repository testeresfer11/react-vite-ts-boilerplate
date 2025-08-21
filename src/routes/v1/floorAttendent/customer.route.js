const { Router } = require('express');
const {
  addCustomerAttendent,
  getCustomerAttendentById,
  getAllCustomerAttendent,
  deletCustomerById,
  editCustomerAttendent,
  scanCustomer,
  linkCustomer,
  assignMatch,
  getShiftDetailsById,
  getAllShiftsDetails,
  getAllMachines,
} = require('../../../controllers/floorAttendent.controller/customer.controller');
const attendentAuth = require('../../../middlewares/attendentAuth');
const validate = require('../../../middlewares/validate');
const { floorAttendentValidation } = require('../../../validations');
const customerRouter = Router();
customerRouter.use(attendentAuth());
customerRouter
  .route('/')
  .post(validate(floorAttendentValidation.addCustomer), addCustomerAttendent)
  .get(validate(floorAttendentValidation.getCustomerById), getCustomerAttendentById)
  .delete(validate(floorAttendentValidation.deletCustomerById), deletCustomerById);

customerRouter.route('/all').get(validate(floorAttendentValidation.allCustomer), getAllCustomerAttendent);
customerRouter.route('/all-machines').get(getAllMachines);
customerRouter.route('/scan').post(validate(floorAttendentValidation.scanCustomer), scanCustomer);

customerRouter.route('/link').post(validate(floorAttendentValidation.linkCustomer), linkCustomer);

customerRouter
  .route('/assign')
  .post(validate(floorAttendentValidation.assignMatch), assignMatch)
  .get(validate(floorAttendentValidation.getCustomerById), getShiftDetailsById);

customerRouter.route('/shifts').get(validate(floorAttendentValidation.getAllShiftsDetails), getAllShiftsDetails);

customerRouter.route('/:id').post(validate(floorAttendentValidation.editCustomer), editCustomerAttendent);

module.exports = customerRouter;

/**
 * @swagger
 * /attendant/customer/scan:
 *   post:
 *     summary: Scan customer
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagId:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Customer Fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerFetchedResponse'
 *       400:
 *         description: RFID Tag not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "RFID Tag not found"
 */

/**
 * @swagger
 * /attendent/customer:
 *   post:
 *     summary: Add a customer
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "2nd Customer"
 *               lastName:
 *                 type: string
 *                 example: "Customer"
 *               email:
 *                 type: string
 *                 example: "customer111@yopmail.com"
 *               age:
 *                 type: string
 *                 example: "12-07-2005"
 *               phone:
 *                 type: string
 *                 example: "+784521036"
 *               dl:
 *                 type: string
 *                 example: "8976456132123"
 *               address:
 *                 type: string
 *                 example: "An apple street 7878"
 *               tagId:
 *                 type: string
 *                 example: "6784ee34eca0ae07f897fb22"
 *               image:
 *                 type: string
 *                 example: "http://vipankumar.in:4016/uploads/1736772570903.png"
 *     responses:
 *       201:
 *         description: Customer Added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer Added"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: false
 *                     issued:
 *                       type: boolean
 *                       example: true
 *                     blocked:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: "678654227a41e99d9bcbf1a5"
 *                     firstName:
 *                       type: string
 *                       example: "2nd Customer"
 *                     lastName:
 *                       type: string
 *                       example: "Customer"
 *                     email:
 *                       type: string
 *                       example: "customer111mm@yopmail.com"
 *                     age:
 *                       type: string
 *                       example: "12-07-2005"
 *                     phone:
 *                       type: string
 *                       example: "+784521036"
 *                     dl:
 *                       type: string
 *                       example: "8976456132123"
 *                     address:
 *                       type: string
 *                       example: "An apple street 7878"
 *                     tagId:
 *                       type: string
 *                       example: "6784ee34eca0ae07f897fb22"
 *                     image:
 *                       type: string
 *                       example: "http://vipankumar.in:4016/uploads/1736772570903.png"
 *                     floorAttendant:
 *                       type: string
 *                       example: "6780df7d001148ad4b6085ab"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-14T12:10:10.745Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-14T12:10:10.745Z"
 *       400:
 *         description: Bad Request (Email Already Taken or RFID Already Issued)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Email Already Taken"
 *                     - "RFID Already Issued to a Customer"
 *                   example: "Email Already Taken or RFID Already Issued to a Customer"
 */

/**
 * @swagger
 * /attendant/customer/all:
 *   get:
 *     summary: Get All Customer
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: "search"
 *         description: Search term for filtering customers
 *     responses:
 *       200:
 *         description: Filtered Customers Fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Filtered Customers Fetched Successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       isEmailVerified:
 *                         type: boolean
 *                         example: false
 *                       issued:
 *                         type: boolean
 *                         example: true
 *                       blocked:
 *                         type: boolean
 *                         example: false
 *                       status:
 *                         type: boolean
 *                         example: false
 *                       _id:
 *                         type: string
 *                         example: "6784e6eab31173ee7dc09392"
 *                       firstName:
 *                         type: string
 *                         example: "Customer"
 *                       lastName:
 *                         type: string
 *                         example: "Twu"
 *                       email:
 *                         type: string
 *                         example: "customer121@yopmail.com"
 *                       age:
 *                         type: string
 *                         example: "12-07-2005"
 *                       phone:
 *                         type: string
 *                         example: "+784521036"
 *                       dl:
 *                         type: string
 *                         example: "8976456132123"
 *                       address:
 *                         type: string
 *                         example: "654sad6as4d6 564as56d4as56d4as"
 *                       tagId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6784e708b31173ee7dc0939d"
 *                           tagId:
 *                             type: string
 *                             example: "54333823"
 *                           role:
 *                             type: string
 *                             example: "Floor Attendant"
 *                       image:
 *                         type: string
 *                         example: "http://localhost:3001/uploads/1736415315913.jpeg"
 *                       floorAttendent:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6780df7d001148ad4b6085ab"
 *                           name:
 *                             type: string
 *                             example: "Attendent"
 *                           email:
 *                             type: string
 *                             example: "attendent@yopmail.com"
 *                       createdAt:
 *                         type: string
 *                         example: "2025-01-13T10:11:54.663Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2025-01-13T10:17:10.855Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     totalRecords:
 *                       type: integer
 *                       example: 2
 *                     pageSize:
 *                       type: integer
 *                       example: 1
 */

/**
 * @swagger
 * /attendant/customer:
 *   get:
 *     summary: Get Customer By Id
 *     tags: [Floor Attendant]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The ID of the customer to fetch
 *         required: true
 *         schema:
 *           type: string
 *           example: 67850c384f4a9d6b74c5da1e
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer Fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer Fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: false
 *                     issued:
 *                       type: boolean
 *                       example: true
 *                     blocked:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: "67850c384f4a9d6b74c5da1e"
 *                     firstName:
 *                       type: string
 *                       example: "Customer"
 *                     lastName:
 *                       type: string
 *                       example: "Twu"
 *                     email:
 *                       type: string
 *                       example: "customer111@yopmail.com"
 *                     age:
 *                       type: string
 *                       example: "12-07-2005"
 *                     phone:
 *                       type: string
 *                       example: "+784521036"
 *                     dl:
 *                       type: string
 *                       example: "8976456132123"
 *                     address:
 *                       type: string
 *                       example: "654sad6as4d6 564as56d4as56d4as"
 *                     tagId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6784ee2aeca0ae07f897fb1f"
 *                         tagId:
 *                           type: string
 *                           example: "21794963"
 *                         role:
 *                           type: string
 *                           example: "Floor Attendant"
 *                     image:
 *                       type: string
 *                       example: "http://vipankumar.in:4016/uploads/1736772570903.png"
 *                     floorAttendent:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6780df7d001148ad4b6085ab"
 *                         name:
 *                           type: string
 *                           example: "Attendant"
 *                         email:
 *                           type: string
 *                           example: "attendent@yopmail.com"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-13T12:51:04.318Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-13T12:52:02.982Z"
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 */

/**
 * @swagger
 * /attendant/customer:
 *   get:
 *     summary: Get Customer By Id
 *     tags: [Floor Attendant]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The ID of the customer to fetch
 *         required: true
 *         schema:
 *           type: string
 *           example: 67850c384f4a9d6b74c5da1e
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer Fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer Fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: false
 *                     issued:
 *                       type: boolean
 *                       example: true
 *                     blocked:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: "67850c384f4a9d6b74c5da1e"
 *                     firstName:
 *                       type: string
 *                       example: "Customer"
 *                     lastName:
 *                       type: string
 *                       example: "Twu"
 *                     email:
 *                       type: string
 *                       example: "customer111@yopmail.com"
 *                     age:
 *                       type: string
 *                       example: "12-07-2005"
 *                     phone:
 *                       type: string
 *                       example: "+784521036"
 *                     dl:
 *                       type: string
 *                       example: "8976456132123"
 *                     address:
 *                       type: string
 *                       example: "654sad6as4d6 564as56d4as56d4as"
 *                     tagId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6784ee2aeca0ae07f897fb1f"
 *                         tagId:
 *                           type: string
 *                           example: "21794963"
 *                         role:
 *                           type: string
 *                           example: "Floor Attendant"
 *                     image:
 *                       type: string
 *                       example: "http://vipankumar.in:4016/uploads/1736772570903.png"
 *                     floorAttendent:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6780df7d001148ad4b6085ab"
 *                         name:
 *                           type: string
 *                           example: "Attendant"
 *                         email:
 *                           type: string
 *                           example: "attendent@yopmail.com"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-13T12:51:04.318Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-13T12:52:02.982Z"
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 */

/**
 * @swagger
 * /attendant/customer/{id}:
 *   post:
 *     summary: Use this to edit customer details
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the customer to update
 *         required: true
 *         schema:
 *           type: string
 *           example: "67850c384f4a9d6b74c5da1e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Customer"
 *               lastName:
 *                 type: string
 *                 example: "Twu"
 *               email:
 *                 type: string
 *                 example: "customer111@yopmail.com"
 *               age:
 *                 type: string
 *                 example: "12-07-2005"
 *               phone:
 *                 type: string
 *                 example: "+784521036"
 *               dl:
 *                 type: string
 *                 example: "8976456132123"
 *               address:
 *                 type: string
 *                 example: "654sad6as4d6 564as56d4as56d4as"
 *               tagId:
 *                 type: string
 *                 example: "6784ee2aeca0ae07f897fb1f"
 *               image:
 *                 type: string
 *                 example: "http://localhost:3001/uploads/1736415517379.jpeg"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: false
 *                     issued:
 *                       type: boolean
 *                       example: true
 *                     blocked:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: "67850c384f4a9d6b74c5da1e"
 *                     firstName:
 *                       type: string
 *                       example: "Customer"
 *                     lastName:
 *                       type: string
 *                       example: "Twu"
 *                     email:
 *                       type: string
 *                       example: "customer111@yopmail.com"
 *                     age:
 *                       type: string
 *                       example: "12-07-2005"
 *                     phone:
 *                       type: string
 *                       example: "+784521036"
 *                     dl:
 *                       type: string
 *                       example: "8976456132123"
 *                     address:
 *                       type: string
 *                       example: "654sad6as4d6 564as56d4as56d4as"
 *                     tagId:
 *                       type: string
 *                       example: "6784ea8a45dd5ff8bc001c03"
 *                     image:
 *                       type: string
 *                       example: "http://localhost:3001/uploads/1736415517379.jpeg"
 *                     floorAttendent:
 *                       type: string
 *                       example: "6780df7d001148ad4b6085ab"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-13T12:51:04.318Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-14T12:43:17.456Z"
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 *       400:
 *         description: RFID already issued to another customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "RFID Already Issued to Another Customer"
 */

/**
 * @swagger
 * /attendant/customer:
 *   delete:
 *     summary: Delete a Customer
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "6780ff0e4a7ddc1dfe726674"
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customers Deleted"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: false
 *                     issued:
 *                       type: boolean
 *                       example: true
 *                     blocked:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: "678654227a41e99d9bcbf1a5"
 *                     firstName:
 *                       type: string
 *                       example: "2nd Customer"
 *                     lastName:
 *                       type: string
 *                       example: "Customer"
 *                     email:
 *                       type: string
 *                       example: "customer111mm@yopmail.com"
 *                     age:
 *                       type: string
 *                       example: "12-07-2005"
 *                     phone:
 *                       type: string
 *                       example: "+784521036"
 *                     dl:
 *                       type: string
 *                       example: "8976456132123"
 *                     address:
 *                       type: string
 *                       example: "An appple strret 7878"
 *                     tagId:
 *                       type: string
 *                       example: "6784ee34eca0ae07f897fb22"
 *                     image:
 *                       type: string
 *                       example: "http://vipankumar.in:4016/uploads/1736772570903.png"
 *                     floorAttendent:
 *                       type: string
 *                       example: "6780df7d001148ad4b6085ab"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-14T12:10:10.745Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-14T12:10:10.745Z"
 *       400:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 */

/**
 * @swagger
 * /attendant/customer/link:
 *   post:
 *     summary: Link Customer to RFID tag
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagId:
 *                 type: string
 *                 example: "6784ee2aeca0ae07f897fb1f"
 *               customerId:
 *                 type: string
 *                 example: "6784e6eab31173ee7dc09392"
 *     responses:
 *       200:
 *         description: RFID tag issued to customer successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "RFID issued to Customer"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: false
 *                     issued:
 *                       type: boolean
 *                       example: true
 *                     blocked:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: "6784e6eab31173ee7dc09392"
 *                     firstName:
 *                       type: string
 *                       example: "Customer"
 *                     lastName:
 *                       type: string
 *                       example: "Twu"
 *                     email:
 *                       type: string
 *                       example: "customer121@yopmail.com"
 *                     age:
 *                       type: string
 *                       example: "12-07-2005"
 *                     phone:
 *                       type: string
 *                       example: "+784521036"
 *                     dl:
 *                       type: string
 *                       example: "8976456132123"
 *                     address:
 *                       type: string
 *                       example: "654sad6as4d6 564as56d4as56d4as"
 *                     tagId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6784ee2aeca0ae07f897fb1f"
 *                         tagId:
 *                           type: string
 *                           example: "21794963"
 *                         role:
 *                           type: string
 *                           example: "Floor Attendant"
 *                     image:
 *                       type: string
 *                       example: "http://localhost:3001/uploads/1736415315913.jpeg"
 *                     floorAttendent:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6780df7d001148ad4b6085ab"
 *                         name:
 *                           type: string
 *                           example: "Attendant"
 *                         email:
 *                           type: string
 *                           example: "attendant@yopmail.com"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-13T10:11:54.663Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-14T13:11:36.089Z"
 *       400:
 *         description: RFID tag is already issued to another customer or tag not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "RFID already issued to a customer"
 *       404:
 *         description: RFID tag not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "RFID Tag not found"
 */

/**
 * @swagger
 * /admin/rfid:
 *   post:
 *     summary: Create a new RFID Tag
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "Floor Attendant"
 *     responses:
 *       200:
 *         description: RFID Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         blocked:
 *                           type: boolean
 *                           example: false
 *                         issued:
 *                           type: boolean
 *                           example: false
 *                         _id:
 *                           type: string
 *                           example: "678664a3fdf82ad9f7a4afa0"
 *                         tagId:
 *                           type: string
 *                           example: "27106527"
 *                         role:
 *                           type: string
 *                           example: "Floor Attendant"
 *                         qrCode:
 *                           type: string
 *                           example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKwSURBVO3BQY7cQAwEwSxC//9yeo88NSBIM17TjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qEkfJPKHUk4UTlJwjepPFGsUYo1SrFGuXiZypuS8IRKl4QnVN6UhDcVa5RijVKsUS4+LAl3qNyRhE6lS8InJeEOlU8q1ijFGqVYo1z8Z1QmK9YoxRqlWKNc/GeScKLyLyvWKMUapVijXHyYyjcloVM5ScITKr9JsUYp1ijFGuXiZUn4m1S6JHQqTyThNyvWKMUapVijXDyk8pskoVPpknCHyr+kWKMUa5RijXLxUBI6lS4Jb1LpVLoknKh0SThJwptUPqlYoxRrlGKNEn/woiScqJwkoVP5pCR0KidJ6FROknCHyhPFGqVYoxRrlIuHktCpdEnoknCi0iWhU+mS0Kl0SThR6ZLQqXQqXRJ+k2KNUqxRijVK/MEXJaFTuSMJJyqflIQTlS4JnconFWuUYo1SrFEuHkrCHSpdEjqVLglPJOFEpUtCp9KpdEn4TYo1SrFGKdYo8Qf/sCR8k8pJEu5QeVOxRinWKMUaJf7ggSR8k8odSehUuiR0Kl0STlROktCpfFKxRinWKMUa5eJlKm9KwkkS7kjCSRJOVE6S0KmcJKFTeaJYoxRrlGKNcvFhSbhD5QmVLgmdSpeETuUkCZ3KSRI6lU7lTcUapVijFGuUi2GS0Kl8k8rfVKxRijVKsUa5GEblJAmdSpeETqVT6ZLQqXRJ6FQ+qVijFGuUYo1y8WEqn6TSJeFE5UTlJAlPJKFTeVOxRinWKMUa5eJlSfimJNyRhE6lS0Kn0ql0SbhD5ZOKNUqxRinWKPEHa4xijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKP8ATgaCPPX/XcdAAAAAElFTkSuQmCC"
 *                         createdAt:
 *                           type: string
 *                           example: "2025-01-14T13:20:35.752Z"
 *                         updatedAt:
 *                           type: string
 *                           example: "2025-01-14T13:20:35.752Z"
 *                         __v:
 *                           type: integer
 *                           example: 0
 */

/**
 * @swagger
 * /attendant/customer/assign:
 *   get:
 *     summary: Get shift details by id
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the shift to retrieve details for.
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Shift Details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Shift Details
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 678506086313ff5cc8ae41b0
 *                     machineId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6776686e09438a41c0138faa
 *                         vendingPercentage:
 *                           type: integer
 *                           example: 100
 *                         machineId:
 *                           type: string
 *                           example: 172803
 *                     customerId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6784e6eab31173ee7dc09392
 *                         firstName:
 *                           type: string
 *                           example: Customer
 *                         lastName:
 *                           type: string
 *                           example: Twu
 *                         phone:
 *                           type: string
 *                           example: +784521036
 *                         address:
 *                           type: string
 *                           example: 654sad6as4d6 564as56d4as56d4as
 *                     amount:
 *                       type: integer
 *                       example: 200
 *                     ticket:
 *                       type: string
 *                       example: 779409
 *                     shiftId:
 *                       type: string
 *                       example: 839171
 *                     floorAttendent:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6780df7d001148ad4b6085ab
 *                         name:
 *                           type: string
 *                           example: Attendent
 *                         email:
 *                           type: string
 *                           example: attendent@yopmail.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-13T12:24:40.784Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-13T12:24:40.784Z
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /attendant/customer/assign:
 *   post:
 *     summary: Assign Slot Machine to Customer
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Details for assigning a slot machine to a customer
 *         schema:
 *           type: object
 *           properties:
 *             machineId:
 *               type: string
 *             customerId:
 *               type: string
 *             amount:
 *               type: integer
 *     responses:
 *       200:
 *         description: Match Assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Match Assigned"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6788ebd7f26f461688fc7ef8"
 *                     machineId:
 *                       type: string
 *                       example: "6776686e09438a41c0138faa"
 *                     customerId:
 *                       type: string
 *                       example: "6787b545f2e15c5bfcede172"
 *                     amount:
 *                       type: integer
 *                       example: 200
 *                     ticket:
 *                       type: string
 *                       example: "911515"
 *                     shiftId:
 *                       type: string
 *                       example: "557885"
 *                     floorAttendent:
 *                       type: string
 *                       example: "6780df7d001148ad4b6085ab"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-16T11:21:59.553Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-16T11:21:59.553Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 */

/**
 * @swagger
 * /attendant/customer/shifts:
 *   get:
 *     summary: Get All shifts (Apply filter also on firstname and date)
 *     tags: [Floor Attendant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: firstName
 *         in: query
 *         description: Filter shifts by customer's first name
 *         required: false
 *         type: string
 *       - name: startDate
 *         in: query
 *         description: Filter shifts by start date (ISO format)
 *         required: false
 *         type: string
 *         format: date-time
 *       - name: endDate
 *         in: query
 *         description: Filter shifts by end date (ISO format)
 *         required: false
 *         type: string
 *         format: date-time
 *     responses:
 *       200:
 *         description: Filtered Shifts Details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       machineId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           vendingPercentage:
 *                             type: integer
 *                           machineId:
 *                             type: string
 *                       customerId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                       amount:
 *                         type: integer
 *                       ticket:
 *                         type: string
 *                       shiftId:
 *                         type: string
 *                       floorAttendent:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad Request - Invalid query parameters
 *       404:
 *         description: Not Found - No data found matching the filter
 *       500:
 *         description: Internal Server Error
 */
