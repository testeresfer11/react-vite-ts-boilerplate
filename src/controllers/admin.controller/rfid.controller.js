const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const crypto = require('crypto');
const { paginate } = require('../../services/admin.service');
const RFID = require('../../models/rfid/rfidManagement.model');
const QRCode = require('qrcode');
const { FloorAttendant, NumberPerson, CustomerAttendent } = require('../../models/user.model');

const generateRandomTagId = () => {
  const randomTagId = Math.floor(10000000 + Math.random() * 90000000);
  return randomTagId.toString();
};

const createNewTag = catchAsync(async (req, res) => {
  try {
    const { role, id } = req.body;

    let tagId = generateRandomTagId();
    if (id?.length) {
      tagId = id;
    }
    let existingTag = await RFID.findOne({ tagId });
    if (existingTag) {
      return res.status(400).send({
        message: "RFID Already Exist",
        status: 400,
        success: false
      })
    }
    while (existingTag) {
      tagId = generateRandomTagId();
      existingTag = await RFID.findOne({ tagId });
    }

    const qrCodeData = await QRCode.toDataURL(JSON.stringify({ tagId, type: 'qr-code' }));
    const data = await RFID.create({ tagId, role, qrCode: qrCodeData });
    const newQr = await QRCode.toDataURL(JSON.stringify({ tagId, type: 'qr-code', _id: data._id }));
    const newData = await RFID.findByIdAndUpdate(data._id, { $set: { qrCode: newQr } }, { new: true });
    return res.status(httpStatus.CREATED).send({
      success: true,
      data: {
        data: newData,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const getTag = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, search } = req.query;

  try {
    // Fetch all entries (no pagination at DB level)
    let allData = await RFID.find()
      .populate({ path: 'floorAttendent', select: 'name email' })
      .populate({ path: 'numberPerson', select: 'name email' })
      .populate({ path: 'customer', select: 'firstName email' });

    // Filter in-memory
    if (search) {
      const lowerSearch = search.toLowerCase();
      allData = allData.filter(
        (item) =>
          item.tagId?.toLowerCase().includes(lowerSearch) ||
          item.floorAttendent?.name?.toLowerCase().includes(lowerSearch) ||
          item.numberPerson?.name?.toLowerCase().includes(lowerSearch) ||
          item.customer?.firstName?.toLowerCase().includes(lowerSearch)
      );
    }

    // Manual pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = allData.slice(startIndex, endIndex);

    res.status(httpStatus.OK).send({
      success: true,
      message: search ? 'Filtered Tags Fetched Successfully' : 'Tags Fetched Successfully',
      data: {
        data: paginatedData,
        pagination: {
          totalRecords: allData.length,
          totalPages: Math.ceil(allData.length / limit),
          currentPage: Number(page),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'An error occurred while fetching the tags',
      error: error.message,
    });
  }
});

// const getTag = catchAsync(async (req, res) => {
//   const { page = 1, limit = 5, search } = req.query;
//   try {
//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { tagId: { $regex: search, $options: 'i' } }
//         ]
//       };
//     }
//     // Correct the populateFields format
//     const { data } = await paginate(
//       RFID,
//       query,
//       page,
//       limit,
//       '-password',
//       [
//         { path: 'floorAttendent', select: 'name email' },
//         { path: 'numberPerson', select: 'name email' },
//         { path: 'customer', select: 'firstName email' }]
//     );
//     console.log(data.data);

//     const filteredData = search
//       ? data.data.filter(item => {
//         return (
//           item.floorAttendent?.name?.toLowerCase().includes(search.toLowerCase()) ||
//           item.numberPerson?.name?.toLowerCase().includes(search.toLowerCase()) ||
//           item.customer?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
//           item.tagId?.toLowerCase().includes(search.toLowerCase())
//         );
//       })
//       : data.data;

//     res.status(httpStatus.OK).send({
//       success: true,
//       message: search ? "Filter Tags Fetched Successfully" : "Tags Fetched Successfully",
//       data: { data: filteredData, pagination: data.pagination },
//     });
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
//       success: false,
//       message: "An error occurred while fetching the attendants",
//       error: error.message
//     });
//   }
// });

const getAllTags = catchAsync(async (req, res) => {
  const { role } = req.query;

  let query = {};

  if (role) {
    query.role = role;
  }
  const data = await RFID.find(query);
  res.status(httpStatus.OK).send({ success: true, data: data });
});

const getAllUsers = catchAsync(async (req, res) => {
  const data = await CustomerAttendent.find().select('-password');
  res.status(httpStatus.OK).send({ success: true, data: data });
});

const issueTagToUser = async (req, res) => {
  try {
    const { userId, tagId } = req.body;

    let floorAttendant = null;
    let numberPerson = null;
    let customer = null;
    let isUser = true;
    let isNumberPerson = false;
    let isCustomer = false;

    floorAttendant = await FloorAttendant.findById(userId);
    if (!floorAttendant) {
      numberPerson = await NumberPerson.findById(userId);
      if (!numberPerson) {
        customer = await CustomerAttendent.findById(userId);
        if (!customer) {
          return res.status(404).json({ message: 'User, Floor Attendant, NumberPerson, or Customer not found' });
        }
        isCustomer = true;
        isUser = false;
      } else {
        isNumberPerson = true;
        isUser = false;
      }
    } else {
      isUser = false;
    }

    const tag = await RFID.findById(tagId);
    if (!tag) {
      return res.status(404).json({ message: 'RFID tag not found' });
    }

    if (tag.issued) {
      const previousFloorAttendant = await FloorAttendant.findById(tag.floorAttendent);
      const previousNumberPerson = await NumberPerson.findById(tag.numberPerson);
      const previousCustomer = await CustomerAttendent.findById(tag.customer);

      if (previousFloorAttendant) {
        await FloorAttendant.findByIdAndUpdate(previousFloorAttendant._id, { tagId: null, issued: false });
      }

      if (previousNumberPerson) {
        await NumberPerson.findByIdAndUpdate(previousNumberPerson._id, { tagId: null, issued: false });
      }

      if (previousCustomer) {
        await CustomerAttendent.findByIdAndUpdate(previousCustomer._id, { tagId: null, issued: false });
      }

      await RFID.findByIdAndUpdate(tag._id, {
        issued: false,
        userId: null,
        floorAttendent: null,
        numberPerson: null,
        customer: null,
      });
    }

    const oldTagOwner = isUser ? user : isNumberPerson ? numberPerson : isCustomer ? customer : floorAttendant;

    if (oldTagOwner?.tagId) {
      const oldTag = await RFID.findById(oldTagOwner.tagId);
      if (oldTag) {
        await RFID.findByIdAndUpdate(oldTag._id, {
          issued: false,
          [isUser ? 'userId' : isNumberPerson ? 'numberPerson' : isCustomer ? 'customer' : 'floorAttendent']: null,
        });
      }
    }

    if (isCustomer) {
      await CustomerAttendent.findByIdAndUpdate(customer._id, { tagId: tagId, issued: true });
    } else if (isNumberPerson) {
      await NumberPerson.findByIdAndUpdate(numberPerson._id, { tagId: tagId, issued: true });
    } else {
      await FloorAttendant.findByIdAndUpdate(floorAttendant._id, { tagId: tagId, issued: true });
    }

    await RFID.findByIdAndUpdate(tag._id, {
      issued: true,
      userId: isUser ? userId : null,
      floorAttendent: !isUser && !isNumberPerson && !isCustomer ? floorAttendant._id : null,
      numberPerson: isNumberPerson ? numberPerson._id : null,
      customer: isCustomer ? customer._id : null,
    });

    res.status(200).json({
      message: 'Tag issued successfully',
      data: {
        id: isUser ? user._id : isNumberPerson ? numberPerson._id : isCustomer ? customer._id : floorAttendant._id,
        name: isUser ? user.name : isNumberPerson ? numberPerson.name : isCustomer ? customer.name : floorAttendant.name,
        email: isUser
          ? user.email
          : isNumberPerson
            ? numberPerson.email
            : isCustomer
              ? customer.email
              : floorAttendant.email,
        newTagId: tag.tagId,
        newUserId: isUser ? tag.userId : null,
        newFloorAttendentId: !isUser && !isNumberPerson && !isCustomer ? tag.floorAttendent : null,
        newNumberPersonId: isNumberPerson ? tag.numberPerson : null,
        newCustomerId: isCustomer ? tag.customer : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleBlockTag = catchAsync(async (req, res) => {
  const { tagId, action } = req.body;

  if (action !== 'block' && action !== 'unblock') {
    return res.status(400).json({ message: 'Invalid action. Use "block" or "unblock".' });
  }

  const blockedStatus = action === 'block' ? true : false;

  const updatedTag = await RFID.findByIdAndUpdate(tagId, { $set: { blocked: blockedStatus } }, { new: true });

  if (!updatedTag) {
    return res.status(404).json({ message: 'Tag not found' });
  }
  const successMessage = action === 'block' ? 'Tag blocked successfully' : 'Tag unblocked successfully';
  const result = {
    updatedTag,
    successMessage,
  };

  res.status(200).json({ message: successMessage, data: result });
});

module.exports = { createNewTag, getTag, getAllTags, getAllUsers, issueTagToUser, toggleBlockTag, generateRandomTagId };
