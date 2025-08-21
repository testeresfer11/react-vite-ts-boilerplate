const httpStatus = require("http-status");
const { Shift } = require("../../models/shift.model");
const { paginate } = require("../../services/admin.service");
const catchAsync = require("../../utils/catchAsync");
const { ShiftSummary } = require("../../models/shiftSummary.model");
const { SlotMachine } = require("../../models/slotMachine.model");

const getAllShifts = catchAsync(async (req, res) => {
    const { page, limit, search, status } = req.query;
    let query = {};
    if (search) {
        query.$or = [
            { shiftId: new RegExp(search, 'i') },
            { machineId: new RegExp(search, 'i') }
        ];
       
        const findMahcineId = await SlotMachine.find(query)
        if (findMahcineId) {
            const machineIds = findMahcineId.map(machine => machine._id)
            if (machineIds.length > 0) {
                query = {
                    $or: [
                        { shiftId: new RegExp(search, 'i') },
                        { machineId: { $in: machineIds } }
                    ],
                };
            } else {
                query = {
                    $or: [
                        { shiftId: new RegExp(search, 'i') }
                    ]
                }
            }
        }
    }
    if (status) {
        query.status = status
    }

    const populatedFields = [
        { path: "machineId", select: "vendingPercentage machineId" },
        { path: "customerId", select: "firstName lastName email" }
    ]
    const data = await paginate(Shift, query, page, limit, "", populatedFields)
    return res.status(httpStatus.OK).send({ success: true, data: data.data })
})


const getAllSummaries = catchAsync(async (req, res) => {
    const { page, limit, startDate, endDate } = req.query
    let query = {}
    if (startDate) {
        const start = new Date(startDate);
        const end = new Date(startDate);
        end.setHours(23, 59, 59, 999);

        query.date = {
            $gte: start,
            $lte: end
        };
    }

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate).setHours(23, 59, 59, 999)
        };
    }
    const result = await paginate(ShiftSummary, query, page, limit, "", [{ path: 'numberPersonId', select: 'name email tagId' }])
    return res.status(httpStatus.OK).send({ success: true, data: result.data })
})




module.exports = { getAllShifts, getAllSummaries };