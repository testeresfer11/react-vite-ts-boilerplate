const httpStatus = require('http-status');
const RFID = require('../../models/rfid/rfidManagement.model');
const catchAsync = require('../../utils/catchAsync');
const {
  paginate,
  unassignTagFromCurrentAttendant,
  createNewAttendant,
  assignTagToAttendant,
  unassignTagFromCurrentUser,
} = require('../../services/admin.service');
const { FloorAttendant } = require('../../models/user.model');
const { emailService } = require('../../services');

const createAttendent = catchAsync(async (req, res) => {
  const { tagId } = req.body;
  const findEmail = await FloorAttendant.isEmailTaken(req.body.email);
  if (findEmail) return res.status(httpStatus.BAD_REQUEST).send({ message: 'Email Already Taken' });
  if (!tagId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'RFID tag ID is required',
    });
  }

  const findTag = await RFID.findById(tagId);

  // If the tag is not found
  if (!findTag) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: 'RFID tag not found',
    });
  }

  let issued = false;

  if (findTag.issued) {
    await unassignTagFromCurrentAttendant(findTag, FloorAttendant);
  }
  const newAttendent = await createNewAttendant(FloorAttendant, req.body, findTag, issued);

  if (findTag) {
    await assignTagToAttendant(findTag, newAttendent);
  }

  await emailService.sendAccountConfirmationEmail(req.body.email, req.body.email, req.body.password);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Attendant Created Successfully',
    data: newAttendent,
  });
});

const deleteAttendent = catchAsync(async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(httpStatus.BAD_REQUEST).send({ message: 'Unknown User' });
  const response = await FloorAttendant.findByIdAndDelete(id);
  return res.status(httpStatus.OK).send({ message: 'Attendent Deleted' });
});

const getAttendants = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, search, status } = req.query;

  try {
    let query = {};
    if (search) {
      query = {
        $or: [{ name: { $regex: search, $options: 'i' } }],
      };
    }
    if (status) {
      query.status = status;
    }
    const { data, pagination } = await paginate(FloorAttendant, query, page, limit, '-password', [
      { path: 'tagId', select: 'tagId role qrCode' },
    ]);

    res.status(httpStatus.OK).send({
      success: true,
      message: search ? 'Filtered Attendants Fetched Successfully' : 'All Attendants Fetched Successfully',
      data,
      pagination,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'An error occurred while fetching the attendants',
      error: error.message,
    });
  }
});

const getAllAttendents = catchAsync(async (req, res) => {
  const data = await FloorAttendant.find().select('-password');
  res.status(httpStatus.OK).send({ success: true, data: data });
});

const getAttendentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await FloorAttendant.findById(id).select('-password').populate('tagId', 'tagId role ');
  res.status(httpStatus.OK).send({ data });
});

const editAttendent = catchAsync(async (req, res) => {
  const { name, email, phone, age, tagId, status } = req.body;
  const { id } = req.params;
  if (!tagId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'RFID tag ID is required',
    });
  }

  const checkEmail = await FloorAttendant.findOne({
    email: email,
    _id: { $ne: id },
  });
  if (checkEmail) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Email Already Taken' });
  }

  // Find the RFID tag
  const findTag = await RFID.findById(tagId);
  if (!findTag) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: 'RFID tag not found',
    });
  }
  const user = await FloorAttendant.findById(id);

  if (findTag.issued) {
    await unassignTagFromCurrentAttendant(findTag, FloorAttendant);
  }

  if (user?.tagId) {
    await unassignTagFromCurrentUser(user?.tagId, 'floorAttendent');
  }

  const updateData = {
    $set: {
      name: name,
      email: email,
      phone: phone,
      age: age,
      tagId: tagId,
      status: status,
    },
  };
  const data = await FloorAttendant.findByIdAndUpdate(id, updateData, { new: true });
  if (!data) return res.status(httpStatus.NOT_FOUND).send({ message: 'Attendent not found' });
  if (findTag) {
    findTag.issued = true;
    findTag.floorAttendent = data._id;
    await findTag.save();
  }
  res.status(httpStatus.OK).send({ data });
});

module.exports = { createAttendent, deleteAttendent, getAttendants, getAllAttendents, getAttendentById, editAttendent };
