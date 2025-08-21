const httpStatus = require("http-status");
const { SlotMachine } = require("../../models/slotMachine.model");
const catchAsync = require("../../utils/catchAsync");
const { ShiftReport } = require("../../models/shiftReport.model");
const { ShiftSummary } = require("../../models/shiftSummary.model");
const { paginate } = require("../../services/admin.service");
const { summaryData, calculateTotals, calculateSummaryStats } = require("../../services/user.service");




const AddMachine = catchAsync(async (req, res) => {
    const { machineId, totalIn, totalOut } = req.body;

    const checkMachine = await SlotMachine.findById(machineId);
    if (!checkMachine) return res.status(httpStatus.BAD_REQUEST).send({ message: "Machine Not found" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingShiftReport = await ShiftReport.findOne({
        numberPersonId: req.user.id,
        machineId,
        date: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    });

    if (existingShiftReport) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "Machine Already Exists for today" });
    }
    const date = new Date().toISOString();
    const data = await ShiftReport.create({
        machineId,
        totalIn,
        totalOut,
        date,
        numberPersonId: req.user.id
    });
    let query = { numberPersonId: req.user.id, date: { $gte: startOfDay, $lt: endOfDay } };
    await summaryData(query, date)
    return res.status(httpStatus.CREATED).send({ message: "Machine Added", data });
});


const EditMachine = catchAsync(async (req, res) => {
    const { machineId, totalIn, totalOut } = req.body
    const { id } = req.params
    const updatedFields = {}

    const findReport = await ShiftReport.findById(id)
    if (!findReport) return res.status(httpStatus.BAD_REQUEST).send({ message: "Account Not found" })
    const startOfDay = findReport.date ? new Date(findReport.date) : new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = findReport.date ? new Date(findReport.date) : new Date();
    endOfDay.setHours(23, 59, 59, 999);

    if (machineId !== undefined && machineId !== null) updatedFields.machineId = machineId;
    if (totalIn !== undefined && totalIn !== null) updatedFields.totalIn = totalIn;
    if (totalOut !== undefined && totalOut !== null) updatedFields.totalOut = totalOut;


    const checkMachine = await SlotMachine.findById(machineId)
    if (!checkMachine) return res.status(httpStatus.BAD_REQUEST).send({ message: "Machine Not found" })
    const findMachineforCurrentDate = await ShiftReport.findOne({
        numberPersonId: req.user.id,
        machineId,
        date: { $gte: startOfDay, $lt: endOfDay }
    })
    if (findMachineforCurrentDate && findMachineforCurrentDate._id.toString() !== id) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "You have already used this machine for the day. Cannot use the same machine." });
    }

    const data = await ShiftReport.findByIdAndUpdate(id, {
        $set: updatedFields,
    }, { new: true })
    if (!data) return res.status(httpStatus.BAD_REQUEST).send({ message: "Account Not found" })

    let query = { numberPersonId: req.user.id, date: { $gte: startOfDay, $lt: endOfDay } };
    await summaryData(query)

    return res.status(httpStatus.OK).send({ message: "Machine Edited", data })
})

const getAllMachines = catchAsync(async (req, res) => {
    const { id } = req.user;
    const { startDate, endDate, month, page, limit } = req.query;

    const filter = {
        numberPersonId: id,
    };

    if (startDate) {
        const start = new Date(startDate);
        const end = new Date(startDate);
        end.setHours(23, 59, 59, 999);

        filter.date = {
            $gte: start,
            $lte: end
        };
    }

    if (startDate && endDate) {
        filter.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate).setHours(23, 59, 59, 999)
        };
    }

    if (month) {
        const [year, monthIndex] = month.split('-');
        const start = new Date(year, monthIndex - 1, 1);
        const end = new Date(year, monthIndex, 0);

        end.setHours(23, 59, 59, 999);

        filter.date = {
            $gte: start,
            $lte: end
        };
    }

    const data = await paginate(ShiftReport, filter, page, limit, "", [
        { path: 'machineId', select: 'vendingPercentage machineId' },
        { path: "numberPersonId", select: "name email phone" }])
    return res.status(httpStatus.OK).send({ message: "Machine Lists", data: data.data });
});

const getCurrentDateSummary = catchAsync(async (req, res) => {
    const { id } = req.user;
    const { date } = req.query;
    console.log(req.query);
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await ShiftSummary.findOne({
        numberPersonId: id,
        date: {
            $gte: targetDate,
            $lt: endOfDay
        }
    }).populate('numberPersonId', 'name email tagId');

    // if (!data) {
    //     return res.status(httpStatus.NOT_FOUND).send({ message: "No summary found for the given date" });
    // }

    return res.status(httpStatus.OK).send({ message: "Summary retrieved", data });
});



const editSummary = catchAsync(async (req, res) => {
    try {
        const { id } = req.user;
        const { payroll, match, misc, actualMoney ,totalIn , totalOut} = req.body;
        const { summaryId } = req.params;




        const existingSummary = await ShiftSummary.findById(summaryId);

        if (!existingSummary) {
            return res.status(404).json({
                success: false,
                message: 'Summary not found.',
            });
        }
        const startOfDay = existingSummary.date ? new Date(existingSummary.date) : new Date()
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = existingSummary.date ? new Date(existingSummary.date) : new Date()
        endOfDay.setHours(23, 59, 59, 999);

        let query = { numberPersonId: id, date: { $gte: startOfDay, $lt: endOfDay } };
        const getShiftReportData = await ShiftReport.find(query);

        if (!getShiftReportData || getShiftReportData.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No machine data found for the given criteria.',
            });
        }

        
        const { totalIns, totalOuts } = calculateTotals(getShiftReportData);
        const total = totalIn ? totalIn :totalIns
        const total2 = totalOut ? totalOut :totalOuts

        const summaryStats = calculateSummaryStats(
            { payroll, match, misc, actualMoney },
            total,
            total2
        );
        const fields = {
            ...summaryStats,
            totalIn: total,
            totalOut: total2,
            numberPersonId: id
        };

        const updatedData = await ShiftSummary.findByIdAndUpdate(summaryId, fields, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing the request.',
            error: error.message,
        });
    }
});



const getMachines = catchAsync(async (req, res) => {
    const data = await SlotMachine.find({status:"Active"})
    return res.status(httpStatus.OK).send({ message: "Mahcines Fetched", data })
})






module.exports = { AddMachine, EditMachine, getAllMachines, getCurrentDateSummary, editSummary  , getMachines}