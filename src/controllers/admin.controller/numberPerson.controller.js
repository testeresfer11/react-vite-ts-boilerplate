const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const {
  paginate,
  unassignTagFromCurrentAttendant,
  createNewAttendant,
  assignTagToAttendant,
  unassignTagFromCurrentUser,
} = require('../../services/admin.service');
const RFID = require('../../models/rfid/rfidManagement.model');
const { NumberPerson } = require('../../models/user.model');
const { emailService } = require('../../services');

const createNumberPerson = catchAsync(async (req, res) => {
  const { tagId } = req.body;

  if (!tagId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'RFID tag ID is required',
    });
  }
  const checkEmail = await NumberPerson.isEmailTaken(req.body.email);
  if (checkEmail) return res.status(httpStatus.BAD_REQUEST).send({ message: 'Email Already Taken' });
  const findTag = await RFID.findById(tagId);

  if (!findTag) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: 'RFID tag not found',
    });
  }
  let issued = false;

  if (findTag.issued) {
    await unassignTagFromCurrentAttendant(findTag, NumberPerson);
  }
  const newAttendent = await createNewAttendant(NumberPerson, req.body, findTag, issued);
  if (findTag) {
    // await assignTagToAttendant(findTag, newAttendent);
    findTag.issued = true;
    findTag.numberPerson = newAttendent._id;
    await findTag.save();
  }
  await emailService.sendAccountConfirmationEmail(req.body.email, req.body.email, req.body.password);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Attendant Created Successfully',
    data: newAttendent,
  });
});

const deleteNumberPerson = catchAsync(async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(httpStatus.BAD_REQUEST).send({ message: 'Unknown User' });
  const response = await NumberPerson.findByIdAndDelete(id);
  return res.status(httpStatus.OK).send({ message: 'Person Deleted' });
});

const getNumberPerson = catchAsync(async (req, res) => {
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
    const { data, pagination } = await paginate(NumberPerson, query, page, limit, '-password', [
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

const getAllNumberPerson = catchAsync(async (req, res) => {
  const data = await NumberPerson.find().select('-password');
  res.status(httpStatus.OK).send({ success: true, data: data });
});

const getNumberPersonById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await NumberPerson.findById(id).select('-password').populate('tagId', 'tagId role ');
  res.status(httpStatus.OK).send({ data });
});

const editNumberPerson = catchAsync(async (req, res) => {
  const { name, email, phone, age, tagId } = req.body;
  const { id } = req.params;
  if (!tagId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'RFID tag ID is required',
    });
  }

  const checkEmail = await NumberPerson.findOne({
    email: email,
    _id: { $ne: id },
  });
  if (checkEmail) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Email Already Taken' });
  }

  // Find the RFID tag
  const findTag = await RFID.findById(tagId);
  const user = await NumberPerson.findById(id);
  if (!findTag) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: 'RFID tag not found',
    });
  }

  // Handle issued RFID tags
  if (findTag.issued) {
    await unassignTagFromCurrentAttendant(findTag, NumberPerson);
  }
  if (user?.tagId) {
    await unassignTagFromCurrentUser(user?.tagId, 'numberPerson');
  }

  const updateData = {
    $set: {
      name: name,
      email: email,
      phone: phone,
      age: age,
      tagId: tagId,
    },
  };

  const data = await NumberPerson.findByIdAndUpdate(id, updateData, { new: true });
  if (!data) return res.status(httpStatus.NOT_FOUND).send({ message: 'Attendent not found' });
  if (findTag) {
    findTag.issued = true;
    findTag.numberPerson = data._id;
    await findTag.save();
  }
  res.status(httpStatus.OK).send({ data });
});

module.exports = {
  createNumberPerson,
  deleteNumberPerson,
  getNumberPerson,
  getAllNumberPerson,
  getNumberPersonById,
  editNumberPerson,
};
