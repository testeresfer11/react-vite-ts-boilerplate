const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { NumberPerson, User } = require('../models/user.model');
const RFID = require('../models/rfid/rfidManagement.model');

const verifyCallback = async (req, tokenPayload, requiredRights) => {
    if (!tokenPayload || !tokenPayload.sub) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
    const findUser = await NumberPerson.findById(tokenPayload.sub);
    if (!findUser) {
        const findAdmin = await User.findById(tokenPayload.sub)
        if (!findAdmin) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Number person not found');
        }
    }
    if (findUser.status === "Inactive") {
        throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been suspended');
    }

    req.user = { ...tokenPayload, id: tokenPayload.sub };

    if (requiredRights.length) {
        const userRights = roleRights.get(req.user.role) || [];
        const hasRequiredRights = requiredRights.every((requiredRight) =>
            userRights.includes(requiredRight)
        );

        if (!hasRequiredRights && req.params.userId !== req.user.id) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
        }
    }
};

const personAuth = (...requiredRights) => async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access denied. No token provided.');
        }
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

        await verifyCallback(req, tokenPayload, requiredRights);

        next();
    } catch (error) {
        console.error('Error in sellerAuth middleware:', error);
        next(error);
    }
};

module.exports = personAuth;
