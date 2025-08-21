const httpStatus = require("http-status");
const { SlotMachine } = require("../../models/slotMachine.model");
const { FloorAttendant, NumberPerson, CustomerAttendent } = require("../../models/user.model");
const catchAsync = require("../../utils/catchAsync");

const countAllRolesUser = catchAsync(async (req, res) => {
    const floorAttendants = await FloorAttendant.countDocuments()
    const numberPersons = await NumberPerson.countDocuments()
    const slotMachines = await SlotMachine.countDocuments()
    const customers = await CustomerAttendent.countDocuments()
    return res.status(httpStatus.OK).send({ success: true, data: { floorAttendants, numberPersons, slotMachines, customers } })
})

module.exports = { countAllRolesUser }