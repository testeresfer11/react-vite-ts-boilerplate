const httpStatus = require('http-status');
const { CustomerAttendent } = require('../../models/user.model');
const catchAsync = require('../../utils/catchAsync');
const RFID = require('../../models/rfid/rfidManagement.model');
const { paginate } = require('../../services/admin.service');
const { SlotMachine } = require('../../models/slotMachine.model');
const { generateRandomTagId } = require('../admin.controller/rfid.controller');
const { generateTicketNumber, generateUniqueId } = require('../../services/user.service');
const { Shift } = require('../../models/shift.model');
const Notification = require('../../models/notifications.model');

const addCustomerAttendent = catchAsync(async (req, res) => {
  // const checkEmail = await CustomerAttendent.findOne({ email: req.body.email });
  // console.log(checkEmail,req.body.email,req.body,"sdasdasdsadasd");
  // if (checkEmail)
  //     return res.status(httpStatus.BAD_REQUEST).send({ message: "Email Already Taken" });

  let findTagid = await RFID.findOne({ tagId: req.body.tagId });
  if (!findTagid) {
    await RFID.create({
      role: 'Customer',
      tagId: req.body.tagId,
    });
    findTagid = await RFID.findOne({ tagId: req.body.tagId });
  } else {
    if (findTagid?.issued) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID Already Issued to a Customer' });
    }
    if (findTagid?.blocked) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID is blocked' });
    }

    if (findTagid?.role !== 'Customer') {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID is not for customer' });
    }
  }
  let field = { ...req.body, issued: true, status: 'Active', floorAttendent: req.user.id, tagId: findTagid?._id };
  const data = await CustomerAttendent.create(field);

  await RFID.updateOne(
    { tagId: req.body.tagId },
    {
      issued: true,
      customer: data?._id,
    }
  );
  await Notification.create({
    title: 'New Customer Registered',
    message: `${data.firstName} has been registered as a customer`,
    sentBy: data._id,
    type: 'push',
  });

  return res.status(httpStatus.CREATED).send({ message: 'Customer Added', data });
});

const getCustomerAttendentById = catchAsync(async (req, res) => {
  const { id } = req.query;
  const data = await CustomerAttendent.findById(id).populate('floorAttendent', 'name email').populate('tagId', 'tagId role');
  if (!data) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Customer not found' });
  }
  return res.status(httpStatus.OK).send({ message: 'Customer Fetched', data });
});

const getAllCustomerAttendent = catchAsync(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  try {
    let query = {};

    if (search) {
      query = {
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }],
      };
    }

    const { data } = await paginate(CustomerAttendent, query, page, limit, '-password', [
      { path: 'tagId', select: 'tagId role' },
      { path: 'floorAttendent', select: 'name email' },
    ]);
    return res.status(httpStatus.OK).send({
      message: search ? 'Filtered Customers Fetched Successfully' : 'All Customers Fetched Successfully',
      data: data.data,
      pagination: data.pagination,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred while fetching customers',
      error: error.message,
    });
  }
});

const deletCustomerById = catchAsync(async (req, res) => {
  const { id } = req.body;
  const data = await CustomerAttendent.findByIdAndDelete(id);
  await RFID.deleteOne({ customer: id });
  if (!data) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Customer not found' });
  }
  return res.status(httpStatus.OK).send({ message: 'Customers Deleted', data });
});

const editCustomerAttendent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, age, phone, dl, tagId, address, image } = req.body;

  const customer = await CustomerAttendent.findById(id);
  if (!customer) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Customer not found' });
  }
  // const checkEmail = await CustomerAttendent.findOne({ email })
  // if (checkEmail && checkEmail._id.toString() !== id) return res.status(httpStatus.BAD_REQUEST).send({ message: "Email Already Taken" })
  const updateFields = {
    firstName,
    lastName,
    email,
    age,
    phone,
    dl,
    tagId,
    address,
    image: image ? image : customer.image,
  };

  for (let key in updateFields) {
    if (updateFields[key] === undefined || updateFields[key] === null) {
      delete updateFields[key];
    }
  }

  let findTagid = await RFID.findOne({ tagId });
  if (!findTagid) {
    await RFID.create({
      role: 'Customer',
      tagId: req.body.tagId,
    });
    findTagid = await RFID.findOne({ tagId: req.body.tagId });
  } else {
    if (findTagid?.issued && findTagid?.customer != id) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID Already Issued to a Customer' });
    }
    if (findTagid?.blocked) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID is blocked' });
    }

    if (findTagid?.role !== 'Customer') {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID is not for customer' });
    }
  }
  updateFields['tagId'] = findTagid?._id;
  const updatedCustomer = await CustomerAttendent.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
  await RFID.updateOne(
    { tagId },
    {
      issued: true,
      customer: updatedCustomer?._id,
    }
  );

  return res.status(httpStatus.OK).send({ message: 'Customer updated successfully', data: updatedCustomer });
});

const filesUploads = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      const data = `${process.env.BACKEND_URL}/${req.file.path}`;
      return res.status(200).json({
        status: 200,
        message: 'Image upload successfully',
        url: data,
      });
    }
    return res.status(400).json({
      status: 400,
      message: "File doesn't exist",
      data: {},
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message, error: error.stack });
  }
});

const scanCustomer = catchAsync(async (req, res) => {
  const { tagId } = req.body;
  const findTagId = await RFID.findOne({ tagId });
  console.log(findTagId, 'sddasdsa');
  if (!findTagId) return res.status(200).send({ message: 'Not Found', data: {} });

  // if (!findTagId) return res.status(httpStatus.BAD_REQUEST).send({ message: "RFID Tag not found" })
  if (findTagId.role !== 'Customer') return res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid Qr-Code' });
  if (findTagId.blocked) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID is blocked' });
  }
  const findCustomer = await CustomerAttendent.findById(findTagId.customer)
    .populate('floorAttendent', 'name email')
    .populate('tagId', 'tagId role');
  return res.status(httpStatus.OK).send({ message: 'Customer Fetched', data: findCustomer || {} });
});

const linkCustomer = catchAsync(async (req, res) => {
  const { tagId, customerId } = req.body;
  const findTagId = await RFID.findById(tagId);
  if (!findTagId) return res.status(httpStatus.NOT_FOUND).send({ message: 'RFID Tag not found' });
  const findCustomer = await CustomerAttendent.findById(customerId);
  if (!findCustomer) return res.status(httpStatus.NOT_FOUND).send({ message: 'Customer Not Found' });
  if (findTagId.issued === true) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID already issued to a customer' });
  }
  if (findTagId.blocked) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID is blocked' });
  }
  if (findTagId.role !== 'Customer') {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'RFID is not for customer' });
  }
  const changeOldRFIDStatus = await RFID.findByIdAndUpdate(findCustomer.tagId, { $set: { issued: false, customer: null } });
  findTagId.issued = true;
  findTagId.customer = findCustomer._id;
  findCustomer.tagId = findTagId._id;
  findCustomer.issued = true;
  await findTagId.save();
  await findCustomer.save();
  const getCustomer = await CustomerAttendent.findById(customerId)
    .populate('floorAttendent', 'name email')
    .populate('tagId', 'tagId role');
  return res.status(httpStatus.OK).send({ message: 'RFID issue to Customer', data: getCustomer });
});

const assignMatch = catchAsync(async (req, res) => {
  const { machineId, customerId, amount } = req.body;

  const checkMachine = await SlotMachine.findById(machineId);
  if (!checkMachine) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Machine Not found' });
  }

  const findCustomer = await CustomerAttendent.findById(customerId);
  if (!findCustomer) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Customer Not found' });
  }

  const shiftId = await generateUniqueId(Shift, 'shiftId');

  const data = await Shift.create({ machineId, customerId, amount, shiftId, floorAttendent: req.user.id });

  return res.status(httpStatus.CREATED).send({ message: 'Match Assigned', data });
});

const getShiftDetailsById = catchAsync(async (req, res) => {
  const { id } = req.query;
  const data = await Shift.findById(id)
    .populate('machineId', 'machineId vendingPercentage')
    .populate('customerId', 'firstName lastName address phone')
    .populate('floorAttendent', 'name email');
  if (!data) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Shift not found' });
  }
  return res.status(httpStatus.OK).send({ message: 'Shift Details', data });
});

const getAllShiftsDetails = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { firstName, startDate, endDate, page, limit } = req.query;

  try {
    let query = { floorAttendent: id };

    if (firstName) {
      const customers = await CustomerAttendent.find({
        $or: [{ firstName: { $regex: firstName, $options: 'i' } }, { lastName: { $regex: firstName, $options: 'i' } }],
        floorAttendent: id,
      });

      const customerIds = customers.map((customer) => customer._id);

      if (customerIds.length > 0) {
        query.customerId = { $in: customerIds };
      } else {
        return res.status(httpStatus.BAD_REQUEST).send({
          message: 'No customers found with the provided filter.',
        });
      }
    }

    if (startDate) {
      const start = new Date(startDate).toISOString();
      query.createdAt = { $gte: start, $lte: new Date(start).setHours(23, 59, 59, 999) };
    } else if (startDate && endDate) {
      const start = new Date(startDate).toISOString();
      const end = new Date(endDate).toISOString();
      query.createdAt = { $gte: start, $lte: end };
    }

    const populatedField = [
      { path: 'machineId', select: 'machineId vendingPercentage' },
      { path: 'floorAttendent', select: 'name email' },
      { path: 'customerId', select: 'firstName lastName email image phone address' },
    ];
    const data = await paginate(Shift, query, page, limit, '', populatedField);
    return res.status(httpStatus.OK).send({
      message: 'Filtered Shifts Details',
      data: data.data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred while fetching shifts',
      error: error.message,
    });
  }
});

const getAllMachines = catchAsync(async (req, res) => {
  const data = await SlotMachine.find();
  return res.status(httpStatus.OK).send({ message: 'Mahcines Fetched', data });
});

module.exports = {
  addCustomerAttendent,
  getCustomerAttendentById,
  getAllCustomerAttendent,
  deletCustomerById,
  editCustomerAttendent,
  filesUploads,
  scanCustomer,
  linkCustomer,
  assignMatch,
  getShiftDetailsById,
  getAllShiftsDetails,
  getAllMachines,
};
