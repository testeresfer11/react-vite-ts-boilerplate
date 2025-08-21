const httpStatus = require('http-status');
const FloorAttendent = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const RFID = require('../models/rfid/rfidManagement.model');
const createFloorAttendent = async (userBody) => {
  if (await FloorAttendent.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return FloorAttendent.create(userBody);
};

const paginate = async (model, query = {}, page = 1, limit = 10, selectFields = '', populateFields = []) => {
  const pageNumber = parseInt(page, 10);
  const pageLimit = parseInt(limit, 10);

  if (pageNumber <= 0 || pageLimit <= 0) {
    throw new Error('Invalid page or limit values');
  }

  const skip = (pageNumber - 1) * pageLimit;

  let queryBuilder = model.find(query).select(selectFields).skip(skip).limit(pageLimit).sort({ createdAt: -1 });

  // Apply populate if `populateFields` is provided
  if (populateFields.length > 0) {
    populateFields.forEach((field) => {
      queryBuilder = queryBuilder.populate(field);
    });
  }

  const [data, totalCount] = await Promise.all([queryBuilder.exec(), model.countDocuments(query)]);
  const totalPages = Math.ceil(totalCount / pageLimit);
  const result = {
    data: data,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalRecords: totalCount,
      pageSize: pageLimit,
    },
  };

  return {
    data: result,
  };
};

async function unassignTagFromCurrentAttendant(tag, model) {
  const existingFloorAttendant = await model.findOne({ tagId: tag._id });

  if (existingFloorAttendant) {
    existingFloorAttendant.tagId = null;
    existingFloorAttendant.issued = false;
    await existingFloorAttendant.save();
  }

  tag.issued = false;
  tag.userId = null;
  tag.floorAttendent = null;
  await tag.save();
}

async function unassignTagFromCurrentUser(id, model) {
  const existingTag = await RFID.findOne({ _id: id, issued: true });
  if (existingTag) {
    await RFID.updateOne(
      { _id: id },
      {
        [model]: null,
        issued: false,
      }
    );
  }
  return;
}
async function createNewAttendant(model, body, tag) {
  return await model.create({
    ...body,
    tagId: tag ? tag._id : null,
    issued: true,
  });
}

async function assignTagToAttendant(tag, attendant) {
  tag.issued = true;
  tag.floorAttendent = attendant._id;
  await tag.save();
}

const loginWithModel = async (email, password, model) => {
  try {
    const user = await model.findOne({ email });
    if (!user) {
      return { success: false, message: 'Incorrect Email or Password' };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Incorrect Email or Password' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error in loginWithModel:', error);
    throw new Error('An error occurred during login');
  }
};

module.exports = {
  createFloorAttendent,
  paginate,
  unassignTagFromCurrentAttendant,
  createNewAttendant,
  assignTagToAttendant,
  loginWithModel,
  unassignTagFromCurrentUser,
};
