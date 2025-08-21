const httpStatus = require("http-status");
const { SlotMachine } = require("../../models/slotMachine.model");
const catchAsync = require("../../utils/catchAsync");
const { paginate } = require("../../services/admin.service");
const { FloorAttendant, CustomerAttendent, NumberPerson } = require("../../models/user.model");
const { Shift } = require("../../models/shift.model");

const createSlotMachine = catchAsync(async (req, res) => {
    const data = await SlotMachine.create(req.body);
    res.status(httpStatus.CREATED).send({ data })
})

const getSlotMachine = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search, filter } = req.query;

    try {
        let query = {};
        if (search) {
            query = {
                $or: [
                    { machineId: { $regex: search, $options: 'i' } }
                ]
            };
        }
        if (filter) [
            query.status = filter
        ]
        const { data, pagination } = await paginate(SlotMachine, query, page, limit);

        res.status(httpStatus.OK).send({
            success: true,
            message: search ? "Filtered Slot Machines Fetched Successfully" : "All Slot Machines Fetched Successfully",
            data,
            pagination
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "An error occurred while fetching the attendants",
            error: error.message
        });
    }
});

const deleteSlotMachine = catchAsync(async (req, res) => {
    const { id } = req.query
    const data = await SlotMachine.findByIdAndDelete(id)
    if (!data) return res.status(httpStatus.BAD_REQUEST).send({ message: "Invalid User" })
    res.status(httpStatus.OK).send({ message: "Slot Machine Deleted" })
})

const checkMachineId = catchAsync(async (req, res) => {
    const { id } = req.query
    const existingMachine = await SlotMachine.findOne({ machineId: id });
    if (existingMachine) {
        return res.json({ data: true });
    } else {
        return res.json({ data: false });
    }
})

const getSlotMachineById = catchAsync(async (req, res) => {
    const { id } = req.params
    const data = await SlotMachine.findById(id)
    res.status(httpStatus.OK).send({ data })
})
const editSlotMachine = catchAsync(async (req, res) => {
    const { id } = req.params
    const { machineId, vendingPercentage, status } = req.body
    const existingMachine = await SlotMachine.findOne({ machineId })
    if (existingMachine && existingMachine._id.toString() !== id) {
        return res.status(httpStatus.CONFLICT).send({ message: "Machine ID must be unique." });
    }
    const data = await SlotMachine.findByIdAndUpdate(id, {
        $set: { machineId, vendingPercentage, status }
    }, { new: true })
    if (!data) return res.status(httpStatus.NOT_FOUND).send({ message: "Not found" })
    res.status(httpStatus.OK).send({ data })
})

const getAllSlotMachines = catchAsync(async (req, res) => {
    const data = await SlotMachine.find()
    res.status(httpStatus.OK).send({ success: true, data: data })
})



const changeStatusByModel = catchAsync(async (req, res) => {
    const { id, action, model } = req.body;
    let Model;
    switch (model) {
        case 'Slotmachine':
            Model = SlotMachine;
            break;
        case 'FloorAttendant':
            Model = FloorAttendant;
            break;
        case 'Customer':
            Model = CustomerAttendent;
            break;
        case 'NumberPerson':
            Model = NumberPerson
            break
        case 'ShiftSetting':
            Model = Shift
            break
        default:
            return res.status(400).json({ message: "Invalid model" });
    }

    if (Model) {
        const data = await Model.findByIdAndUpdate(id, { $set: { status: action } }, { new: true });

        if (!data) {
            return res.status(404).json({ message: "Model not found" });
        }

        res.status(200).json({ message: "Status updated successfully", data });
    }
});

module.exports = {
    createSlotMachine, getSlotMachine, deleteSlotMachine,
    checkMachineId, getSlotMachineById,
    editSlotMachine, getAllSlotMachines, changeStatusByModel
}