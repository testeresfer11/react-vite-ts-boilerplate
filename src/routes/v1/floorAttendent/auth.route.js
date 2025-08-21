const { Router } = require("express");
const { login, forgotPassword, verifyOtp, resetPassword, resendOtp, authMe, editProfile, changePassword, loginWithQR, deleteAttendant } = require("../../../controllers/floorAttendent.controller/auth.controller");
const authAttendant = require("../../../middlewares/attendentAuth");
const validate = require("../../../middlewares/validate");
const { authValidation } = require("../../../validations");
const { filesUploads } = require("../../../controllers/floorAttendent.controller/customer.controller");
const upload = require("../../../middlewares/multer");

const authRouter = Router()
authRouter.post("/login",validate(authValidation.login) , login)
authRouter.post("/forgot-password",validate(authValidation.forgotPassword),forgotPassword)
authRouter.post("/verify-otp/:token",validate(authValidation.verifyotp),verifyOtp)
authRouter.post("/reset-password/:token",validate(authValidation.resetPassword),resetPassword)
authRouter.post("/resend-otp",validate(authValidation.resendOtp),resendOtp)
authRouter.get("/me" ,authAttendant(), authMe)
authRouter.post("/password",authAttendant(),validate(authValidation.changePassword), changePassword)
authRouter.route("/profile").post(authAttendant(), validate(authValidation.editProfile),editProfile)
authRouter.post('/filesUploads',upload.single('file'),filesUploads);
authRouter.post("/qr-login",validate(authValidation.loginWithQr),loginWithQR)
authRouter.delete("/delete" , authAttendant() , deleteAttendant)

module.exports = authRouter;

/**
 * @swagger
 * /attendant/auth/login:
 *   post:
 *     summary: Login Floor Attendant
 *     tags: [Floor Attendant Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@yopmail.com
 *               password:
 *                 type: string
 *                 example: test@123
 *     responses:
 *       200:
 *         description: User Logged In Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Logged In Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: user
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
 *                       example: 6780df7d001148ad4b6085ab
 *                     name:
 *                       type: string
 *                       example: Attendent
 *                     email:
 *                       type: string
 *                       example: attendent@yopmail.com
 *                     password:
 *                       type: string
 *                       example: $2a$08$f1.LsrNaUOjuCLtEENHJ9uSxvVT5m3GvbvCkarCYZ9DiPTPfcM0eG
 *                     age:
 *                       type: string
 *                       example: 2004-01-15T18:30:00.000Z
 *                     phone:
 *                       type: string
 *                       example: +879846541561
 *                     tagId:
 *                       type: string
 *                       example: 6780df7a001148ad4b6085a4
 *                     image:
 *                       type: string
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-10T08:51:09.704Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2025-01-10T08:51:09.704Z
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                         expires:
 *                           type: string
 *                           example: 2025-01-22T06:57:49.591Z
 *                     refresh:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                         expires:
 *                           type: string
 *                           example: 2033-04-08T04:57:49.593Z
 *       401:
 *         description: Incorrect Email or Password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect Email or Password
 */

/**
 * @swagger
 * /attendant/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags: [Floor Attendant Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin100@yopmail.com
 *     responses:
 *       200:
 *         description: OTP Sent Successfully
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
 *                     resetToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     emailToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     message:
 *                       type: string
 *                       example: Otp Sent
 *       404:
 *         description: No users found with this email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: No users found with this email
 *                
 */

/**
 * @swagger
 * /attendant/auth/verify-otp/{token}:
 *   post:
 *     summary: Verify OTP to reset password
 *     tags: [Floor Attendant Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The OTP verification token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzgwZGY3ZDAwMTE0OGFkNGI2MDg1YWIiLCJpYXQiOjE3MzczNDkzNjUsImV4cCI6MTczNzM1NTM2NSwidHlwZSI6InJlc2V0UGFzc3dvcmQifQ.UMoO7-sqSFNnily8DIqiHS3pZRDZisj4zVycfSId8qU
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: 461817
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid OTP
 */

/**
 * @swagger
 * /attendant/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Floor Attendant Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF0dGVuZGVudEB5b3BtYWlsLmNvbSIsImlhdCI6MTczNzM0OTUyOSwiZXhwIjoxNzM3MzUzMTI5fQ.hHF-VeFTAqoUST4nLH1GK-3KB8tF4k_FhT7EXXBXmJM
 *     responses:
 *       200:
 *         description: OTP Resent Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzgwZGY3ZDAwMTE0OGFkNGI2MDg1YWIiLCJpYXQiOjE3MzczNDk4OTksImV4cCI6MTczNzM1NTg5OSwidHlwZSI6InJlc2V0UGFzc3dvcmQifQ.207Lt6iMmbKP4IoY-ryoAJLQURusPBg6lZK5xxipC0M
 *                 message:
 *                   type: string
 *                   example: Otp Sent
 */

/**
 * @swagger
 * /attendant/auth/reset-password/{token}:
 *   post:
 *     summary: Reset Password of your account
 *     tags: [Floor Attendant Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The token to verify password reset
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzgwZGY3ZDAwMTE0OGFkNGI2MDg1YWIiLCJpYXQiOjE3MzczNDk4OTksImV4cCI6MTczNzM1NTg5OSwidHlwZSI6InJlc2V0UGFzc3dvcmQifQ.207Lt6iMmbKP4IoY-ryoAJLQURusPBg6lZK5xxipC0M
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: admin@1234
 *     responses:
 *       200:
 *         description: Password Reset Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password Reset Successfully
 *       400:
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Password reset failed
 */

/**
 * @swagger
 * /attendant/auth/me:
 *   get:
 *     summary: Get Profile Details
 *     tags: [Floor Attendant Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: user
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
 *                       example: 6780df7d001148ad4b6085ab
 *                     name:
 *                       type: string
 *                       example: Attendent
 *                     email:
 *                       type: string
 *                       example: attendent@yopmail.com
 *                     age:
 *                       type: string
 *                       example: 2004-01-15T18:30:00.000Z
 *                     phone:
 *                       type: string
 *                       example: +879846541561
 *                     tagId:
 *                       type: string
 *                       example: 6780df7a001148ad4b6085a4
 *                     image:
 *                       type: string
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-10T08:51:09.704Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2025-01-20T05:16:01.566Z
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     otp:
 *                       type: string
 *                       example: 319435
 */

/**
 * @swagger
 * /attendant/auth/password:
 *   post:
 *     summary: Floor Attendant can change password after login
 *     tags: [Floor Attendant Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: admin@123
 *               newPassword:
 *                 type: string
 *                 example: admin@1234
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: 
 *           - Wrong Old password
 *           - New password cannot be the same as the old password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wrong Old password or New password cannot be the same as the old password
 */

/**
 * @swagger
 * /attendant/auth/profile:
 *   post:
 *     summary: Floor Attendant Update Profile
 *     tags: [Floor Attendant Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Floor Attendents
 *               email:
 *                 type: string
 *                 example: attendent@yopmail.com
 *               phone:
 *                 type: string
 *                 example: 7845411332
 *               image:
 *                 type: string
 *                 example: http://localhost:3001/uploads/1736416908066.jpeg
 *     responses:
 *       200:
 *         description: Profile Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile Updated
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: user
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
 *                       example: 6780df7d001148ad4b6085ab
 *                     name:
 *                       type: string
 *                       example: Floor Attendents
 *                     email:
 *                       type: string
 *                       example: attendent@yopmail.com
 *                     phone:
 *                       type: string
 *                       example: 7845411332
 *                     image:
 *                       type: string
 *                       example: http://localhost:3001/uploads/1736416908066.jpeg
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-10T08:51:09.704Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2025-01-20T05:26:14.049Z
 *                     otp:
 *                       type: string
 *                       example: 319435
 */

/**
 * @swagger
 * /attendant/auth/filesUploads:
 *   post:
 *     summary: Upload image, files for further use
 *     tags: [Floor Attendant Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Image upload successfully
 *                 url:
 *                   type: string
 *                   example: http://vipankumar.in:4016/uploads/1737351021546.png
 */

/**
 * @swagger
 * /attendant/auth/qr-login:
 *   post:
 *     summary: Login via scanning QR
 *     tags: [Floor Attendant Auth]
 *     requestBody:  # Corrected term for Swagger 3.0+
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagId:
 *                 type: string
 *                 example: "82680771"
 *     responses:
 *       200:
 *         description: User Logged In Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Logged In Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         role:
 *                           type: string
 *                           example: "user"
 *                         isEmailVerified:
 *                           type: boolean
 *                           example: false
 *                         issued:
 *                           type: boolean
 *                           example: true
 *                         blocked:
 *                           type: boolean
 *                           example: false
 *                         status:
 *                           type: boolean
 *                           example: false
 *                         _id:
 *                           type: string
 *                           example: "6780df7d001148ad4b6085ab"
 *                         name:
 *                           type: string
 *                           example: "Floor Attendants"
 *                         email:
 *                           type: string
 *                           example: "attendent@yopmail.com"
 *                         password:
 *                           type: string
 *                           example: "$2a$08$/3jr9kQYuaNmSBjE9qPnUusD9Mcw3f3e9rjjOn7bxF8HoMd6RUBTy"
 *                         age:
 *                           type: string
 *                           example: "2004-01-15T18:30:00.000Z"
 *                         phone:
 *                           type: string
 *                           example: "7845411332"
 *                         tagId:
 *                           type: string
 *                           example: "67938a65c592aff238b75236"
 *                         image:
 *                           type: string
 *                           example: "http://localhost:3001/uploads/1736416908066.jpeg"
 *                         createdAt:
 *                           type: string
 *                           example: "2025-01-10T08:51:09.704Z"
 *                         updatedAt:
 *                           type: string
 *                           example: "2025-01-27T09:09:08.356Z"
 *                         __v:
 *                           type: integer
 *                           example: 0
 *                         otp:
 *                           type: string
 *                           example: "319435"
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         access:
 *                           type: object
 *                           properties:
 *                             token:
 *                               type: string
 *                               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzgwZGY3ZDAwMTE0OGFkNGI2MDg1YWIiLCJpYXQiOjE3MzgwNjM0OTUsImV4cCI6MTczODI0MzQ5NSwidHlwZSI6ImFjY2VzcyJ9.qO5eNhIFouu3RyfewrT5_9FPZ5IhxZs5hme32SSMMdQ"
 *                             expires:
 *                               type: string
 *                               example: "2025-01-30T13:24:55.774Z"
 *                         refresh:
 *                           type: object
 *                           properties:
 *                             token:
 *                               type: string
 *                               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzgwZGY3ZDAwMTE0OGFkNGI2MDg1YWIiLCJpYXQiOjE3MzgwNjM0OTUsImV4cCI6MTk5NzI2MzQ5NSwidHlwZSI6InJlZnJlc2gifQ.EsGevNgTTW2jpfi6Xj_EZk0gopr9UFFYPpN8rrC_RDY"
 *                             expires:
 *                               type: string
 *                               example: "2033-04-16T11:24:55.776Z"
 */
