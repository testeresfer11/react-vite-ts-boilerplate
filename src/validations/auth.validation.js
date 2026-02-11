const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    countryCode: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    otp: Joi.string().required(),
  }),
};
const verifyotp = {
  params: Joi.object().keys({
    token: Joi.string().required(), // Token passed in URL
  }),
  body: Joi.object().keys({
    otp: Joi.string().required(), // OTP passed in body
  }),
}

const createAttendents = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    age: Joi.string().required(),
    phone: Joi.string().required(),
    tagId: Joi.string(),
    status: Joi.string()
  })
}

const resendOtp = {
  body: Joi.object().keys({
    emailToken: Joi.string().required()
  })
}

const editProfile = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    image: Joi.string()
  })
}

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
  })
}

const loginWithQr = {
  body: Joi.object().keys({
    tagId: Joi.string().required()
  })
}

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyotp,
  createAttendents,
  resendOtp,
  editProfile,
  changePassword,
  loginWithQr
};
