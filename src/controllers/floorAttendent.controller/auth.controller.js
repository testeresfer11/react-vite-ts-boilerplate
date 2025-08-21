const httpStatus = require("http-status");
const { FloorAttendant } = require("../../models/user.model");
const { loginWithModel } = require("../../services/admin.service");
const catchAsync = require("../../utils/catchAsync");
const { tokenService, emailService, userService, authService } = require("../../services");
const { generateEmailToken } = require("../../services/auth.service");
const { tokenTypes } = require("../../config/tokens");
const { checkOtp, getUserById } = require("../../services/user.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const RFID = require("../../models/rfid/rfidManagement.model");

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginWithModel(email, password, FloorAttendant);
    if (!result.success) {
        return res.status(httpStatus.UNAUTHORIZED).send({ message: result.message });
    }
    if (result.user.status == "Inactive") return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: "Account is not active" })

    const tokens = await tokenService.generateAuthTokens(result.user);
    const data = {
        data: result.user,
        tokens
    }
    return res.status(httpStatus.OK).send({
        message: "User Logged In Successfully",
        data
    });
});

const forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email, FloorAttendant);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    const emailToken = await generateEmailToken(req.body.email, FloorAttendant)
    res.status(200).send({
        success: true, data: {
            resetToken: resetPasswordToken.resetPasswordToken,
            emailToken,
            message: "Otp Sent"
        }
    });
});


const verifyOtp = catchAsync(async (req, res) => {
    const { otp } = req.body
    const resetPasswordTokenDoc = await tokenService.verifyToken(req.params.token, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user, FloorAttendant);
    if (!user) {
        throw new Error();
    }
    const validOtp = await checkOtp(user._id, otp, FloorAttendant)
    res.status(200).send(validOtp)
})

const resetPassword = catchAsync(async (req, res) => {
    const data = await authService.resetPassword(req.params.token, req.body.password, FloorAttendant);
    if (data?.message) return res.status(httpStatus.BAD_REQUEST).send({ message: data.message });
    res.status(httpStatus.OK).send({ success: true, message: "Password Reset Successfully" });
});


const resendOtp = catchAsync(async (req, res) => {
    const { emailToken } = req.body;
    if (!emailToken) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const decoded = jwt.verify(emailToken, process.env.JWT_SECRET);
    const resetPasswordToken = await tokenService.generateResetPasswordToken(decoded.email, FloorAttendant);

    await emailService.sendResetPasswordEmail(decoded.email, resetPasswordToken);

    res.status(200).send({ success: true, data: resetPasswordToken.resetPasswordToken, message: "Otp Sent" });
})
const authMe = catchAsync(async (req, res) => {
    const data = await getUserById(req.user.id, FloorAttendant)
    res.send({ data: data })
})

const editProfile = catchAsync(async (req, res) => {
    const { name, image, email, phone } = req.body;
    const { id } = req.user
    let updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (image !== undefined) updateFields.image = image;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    const findEmail = await FloorAttendant.findOne({ email })
    if (findEmail && findEmail._id.toString() !== id) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "Email Is Already Taken" })
    }
    const data = await FloorAttendant.findByIdAndUpdate(id, {
        $set: updateFields
    }, { new: true });

    return res.status(200).json({ message: "Profile Updated", data });
});

const changePassword = catchAsync(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await FloorAttendant.findById(req.user.id);
    if (!user) {
        return res.status(httpStatus.NOT_FOUND).send({ message: "User not found" });
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "Wrong Old password" });
    }

    if (oldPassword === newPassword) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "New password cannot be the same as the old password" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 8);

    const updatedUser = await FloorAttendant.findByIdAndUpdate(req.user.id, {
        $set: { password: hashPassword },
    }, { new: true });

    if (!updatedUser) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Failed to change password" });
    }

    res.status(httpStatus.OK).send({ message: "Password changed successfully" });
});

const loginWithQR = catchAsync(async (req, res) => {
    const { tagId } = req.body
    const findTagId = await RFID.findOne({ tagId })
    if (!findTagId) return res.status(httpStatus.BAD_REQUEST).send({ message: "Invalid Tag Id" })
    const login = await FloorAttendant.findById(findTagId.floorAttendent)
    if (!login) return res.status(httpStatus.BAD_REQUEST).send({ message: "Account Not found" })
    if (login.status == "Inactive") return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: "Account is not active" })

    const findTag = await RFID.findById(login.tagId)
    if (findTag.blocked) return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: "Your RFID is blocked" })

    const tokens = await tokenService.generateAuthTokens(login)
    const data = {
        data: login,
        tokens
    }
    return res.status(httpStatus.OK).send({
        message: "User Logged In Successfully",
        data
    });
})

const deleteAttendant = catchAsync(async (req, res) => {
    const { id } = req.user
    const data = await FloorAttendant.findByIdAndDelete(id)
    if (!data) return res.status(httpStatus.BAD_REQUEST).send({ message: "Account Not Found" })
    let tagId = await RFID.findOne({floorAttendent:id})
    if(tagId){
        await RFID.deleteOne({_id:tagId?._id})
    }
    return res.status(httpStatus.OK).send({ message: "Account Deleted", data })
})


module.exports = { login, forgotPassword, verifyOtp, resetPassword, resendOtp, authMe, editProfile, changePassword, loginWithQR, deleteAttendant }