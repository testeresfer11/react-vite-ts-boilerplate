const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const {
  unassignTagFromCurrentAttendant,
  createNewAttendant,
  paginate,
  unassignTagFromCurrentUser,
} = require('../../services/admin.service');
const RFID = require('../../models/rfid/rfidManagement.model');
const { CustomerAttendent } = require('../../models/user.model');
const { emailService } = require('../../services');

const getCustomer = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, search, status } = req.query;

  try {
    let query = {};
    if (search) {
      query = {
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }],
      };
    }
    if (status) {
      query.status = status;
    }
    const { data, pagination } = await paginate(CustomerAttendent, query, page, limit, '-password', [
      { path: 'tagId', select: 'tagId role qrCode' },
    ]);

    res.status(httpStatus.OK).send({
      success: true,
      message: search ? 'Filtered Customer Fetched Successfully' : 'All Customer Fetched Successfully',
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
const createCustomer = catchAsync(async (req, res) => {
  const { tagId } = req.body;
  if (!tagId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'RFID tag ID is required',
    });
  }
  const checkEmail = await CustomerAttendent.isEmailTaken(req.body.email);
  if (checkEmail) return res.status(httpStatus.BAD_REQUEST).send({ message: 'Email Already Taken' });
  const findTag = await RFID.findById(tagId);

  if (!findTag) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: 'RFID tag not found',
    });
  }

  if (findTag.issued) {
    await unassignTagFromCurrentAttendant(findTag, CustomerAttendent);
  }
  const newAttendent = await createNewAttendant(CustomerAttendent, req.body, findTag);
  if (findTag) {
    findTag.issued = true;
    findTag.customer = newAttendent._id;
    await findTag.save();
  }

  await emailService.sendAccountConfirmationEmail(req.body.email, req.body.email, req.body.password);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Attendant Created Successfully',
    data: newAttendent,
  });
});

const deleteCustomer = catchAsync(async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(httpStatus.BAD_REQUEST).send({ message: 'Unknown User' });
  const response = await CustomerAttendent.findByIdAndDelete(id);
  return res.status(httpStatus.OK).send({ message: 'Customer Deleted' });
});

const getAllCustomer = catchAsync(async (req, res) => {
  const data = await CustomerAttendent.find().select('-password');
  res.status(httpStatus.OK).send({ data: data });
});

const getCustomerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await CustomerAttendent.findById(id).select('-password').populate('tagId', 'tagId role');
  res.status(httpStatus.OK).send({ data });
});

const editCustomer = catchAsync(async (req, res) => {
  const { firstName, lastName, email, phone, address, tagId, image, status } = req.body;
  const { id } = req.params;
  if (!tagId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'RFID tag ID is required',
    });
  }

  const checkEmail = await CustomerAttendent.findOne({
    email: email,
    _id: { $ne: id },
  });
  if (checkEmail) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Email Already Taken' });
  }

  const findTag = await RFID.findById(tagId);
  if (!findTag) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: 'RFID tag not found',
    });
  }

  if (findTag.issued) {
    await unassignTagFromCurrentAttendant(findTag, CustomerAttendent);
  }

  let user = await CustomerAttendent.findById(id);

  if (user?.tagId) {
    await unassignTagFromCurrentUser(user?.tagId, 'customer');
  }

  const updateData = {
    $set: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      tagId: tagId,
      image: image,
      status: status,
    },
  };

  if (req.file) {
    updateData.$set.image = req.file.path;
  }

  const data = await CustomerAttendent.findByIdAndUpdate(id, updateData, { new: true });
  if (!data) return res.status(httpStatus.NOT_FOUND).send({ message: 'Customer not found' });
  if (findTag) {
    findTag.issued = true;
    findTag.customer = data._id;
    await findTag.save();
  }
  res.status(httpStatus.OK).send({ data });
});

module.exports = { getCustomer, createCustomer, deleteCustomer, getAllCustomer, editCustomer, getCustomerById };
