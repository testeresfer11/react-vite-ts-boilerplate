const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { User } = require('../models/user.model');
const { ShiftSummary } = require('../models/shiftSummary.model');
const { ShiftReport } = require('../models/shiftReport.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, model) => {
  return model.findById(id)
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email, model) => {
  return model.findOne({ email });
};
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, model) => {
  const user = await getUserById(userId, model);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await model.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
const storeOtp = async (userId, otp, model) => {
  const user = await model.findByIdAndUpdate(userId, {
    $set: { otp: otp }
  })
  return user
}
const checkOtp = async (userId, otp, model) => {
  const user = await getUserById(userId, model);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const storedOtp = user.otp;
  const otpExpiration = user.otpExpiration;
  if (!storedOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No OTP found for this user");
  }

  const currentTime = moment();
  if (currentTime.isAfter(otpExpiration)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired");
  }

  if (storedOtp !== otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }
  await model.updateOne(
    { _id: userId },
    { $unset: { otp: "" } }
  );

  return { success: true, message: "OTP verified successfully" };
};

function generateTicketNumber() {
  const ticketNumber = Math.floor(100000 + Math.random() * 900000);
  return ticketNumber;
}

const generateUniqueId = async (model, field) => {
  let id = generateTicketNumber();
  let existingRecord = await model.findOne({ [field]: id });
  while (existingRecord) {
    id = generateTicketNumber();
    existingRecord = await model.findOne({ [field]: id });
  }
  return id;
};

const summaryData = async (query, date = new Date().toISOString()) => {
  try {
    const existingSummary = await ShiftSummary.findOne(query)
    const getShiftReportData = await ShiftReport.find(query)
    const { totalIns, totalOuts } = calculateTotals(getShiftReportData);
    const stats = calculateSummaryStats(existingSummary, totalIns, totalOuts)

    if (existingSummary) {
      Object.assign(existingSummary, {
        totalIn: totalIns,
        totalOut: totalOuts,
        profit: stats.profit,
        short: stats.short,
        totalClear: stats.totalClear,
        matchPercentage: stats.matchPercentage,
      });
      await existingSummary.save()
    } else {
      await ShiftSummary.create({
        profit: stats.profit,
        totalIn: totalIns,
        totalOut: totalOuts,
        totalClear: stats.totalClear,
        short: stats.short,
        date,
        numberPersonId: query.numberPersonId
      })
    }
  } catch (error) {
    throw error
  }
}

const calculateTotals = (reports) => {
  return reports.reduce((totals, report) => {
    if (report.totalIn) totals.totalIns += report.totalIn;
    if (report.totalOut) totals.totalOuts += report.totalOut;
    return totals;
  }, { totalIns: 0, totalOuts: 0 });
};

const calculateSummaryStats = (summary, totalIns, totalOuts) => {
  const payroll = summary?.payroll ?? 0;
  const match = summary?.match ?? 0;
  const misc = summary?.misc ?? 0;
  const actualMoney = summary?.actualMoney ?? 0;

  const profit = totalOuts - totalIns;
  const totalClear = profit - payroll - match - misc;
  const short = totalClear - actualMoney;
  const matchPercentage = Number((match / totalIns).toFixed(2));
  return {
    payroll, profit, totalClear, short, matchPercentage, match, misc, actualMoney
  }
}



module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  storeOtp,
  checkOtp,
  generateTicketNumber,
  generateUniqueId,
  summaryData,
  calculateTotals,
  calculateSummaryStats
};
