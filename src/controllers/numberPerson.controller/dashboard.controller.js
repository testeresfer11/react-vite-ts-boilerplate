const httpStatus = require("http-status");
const { ShiftReport } = require("../../models/shiftReport.model");
const catchAsync = require("../../utils/catchAsync");
const { ShiftSummary } = require("../../models/shiftSummary.model");
const { paginate } = require("../../services/admin.service");

const graphsData = catchAsync(async (req, res) => {
    let { filter, profitFilter } = req.query;
    const { id } = req.user;
    console.log("Received filter:", filter);

    filter = filter ? filter.toLowerCase() : "weekly";
    profitFilter = profitFilter ? profitFilter.toLowerCase() : "weekly";

    const currentDate = new Date();
    let query = { numberPersonId: id };

    let responseData = {
        filter,
        machinGraphData: [],
        profitGraphData: []
    };

    if (filter === "weekly") {
        const startOfWeek = new Date();
        startOfWeek.setDate(currentDate.getDate() - 6);
        startOfWeek.setHours(0, 0, 0, 0);

        query.createdAt = { $gte: startOfWeek, $lte: currentDate };
        const data = await ShiftSummary.find(query);
        responseData.machinGraphData = data.map((elem) => ({ totalIn: elem.totalIn, totalOut: elem.totalOut, date: elem.createdAt.toISOString().split("T")[0], totalRevenue: elem.totalIn - elem.totalOut }))
    } else if (filter === "monthly") {
        responseData.machinGraphData = await getMonthlyData(id, currentDate, "totalRevenue");
    } else if (filter === "yearly") {
        responseData.machinGraphData = await getYearlyData(id, "totalRevenue");
    } else {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "Invalid filter type" });
    }

    if (profitFilter === "weekly") {
        const startOfWeek = new Date();
        startOfWeek.setDate(currentDate.getDate() - 6);
        startOfWeek.setHours(0, 0, 0, 0);

        query.createdAt = { $gte: startOfWeek, $lte: currentDate };
        const data = await ShiftSummary.find(query);
        console.log(data, "datadata");
        responseData.profitGraphData = data.map((elem) =>
        ({
            totalProfit: elem.profit,
            date: elem.createdAt.toISOString().split("T")[0]
        }))
    }
    else if (profitFilter === "monthly") {
        responseData.profitGraphData = await getMonthlyData(id, currentDate, "profit");
    }
    else if (profitFilter === "yearly") {
        responseData.profitGraphData = await getYearlyData(id, "profit");
    } else {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "Invalid filter type" });
    }

    return res.status(httpStatus.OK).send({ data: responseData });
});


const getMonthlyData = async (id, currentDate, type = "totalRevenue") => {
    const monthsData = [];
    for (let i = 0; i < 12; i++) {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0, 23, 59, 59, 999);
        monthsData.push({ startOfMonth, endOfMonth });
    }

    return Promise.all(
        monthsData.map(async ({ startOfMonth, endOfMonth }) => {
            const data = await ShiftSummary.find({
                numberPersonId: id,
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            });

            let responseData = {
                month: startOfMonth.toLocaleString("default", { month: "short" }),
                year: startOfMonth.getFullYear(),
            };

            if (type === "totalRevenue") {
                responseData.totalIn = data.reduce((acc, curr) => acc + curr.totalIn, 0);
                responseData.totalOut = data.reduce((acc, curr) => acc + curr.totalOut, 0);
                responseData.totalRevenue = data.reduce((acc, curr) => acc + (curr.totalIn - curr.totalOut), 0);
            } else if (type === "profit") {
                responseData.totalProfit = data.reduce((acc, curr) => acc + curr.profit, 0)
            } else {
                responseData.totalRevenue = data.reduce((acc, curr) => acc + (curr.totalIn - curr.totalOut), 0);
            }

            return responseData;
        })
    );
};

const getYearlyData = async (id, type = "totalRevenue") => {
    const earliestRecord = await ShiftSummary.findOne({ numberPersonId: id })
        .sort({ createdAt: 1 })
        .select("createdAt");

    if (!earliestRecord) {
        return [];
    }

    const startYear = earliestRecord.createdAt.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearsData = [];
    for (let year = startYear; year <= currentYear; year++) {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
        yearsData.push({ startOfYear, endOfYear });
    }

    return Promise.all(
        yearsData.map(async ({ startOfYear, endOfYear }) => {
            const data = await ShiftSummary.find({
                numberPersonId: id,
                createdAt: { $gte: startOfYear, $lte: endOfYear }
            });

            let responseData = {
                year: startOfYear.getFullYear(),
            };

            if (type === "totalIn") {
                responseData.totalIn = data.reduce((acc, curr) => acc + curr.totalIn, 0);
                responseData.totalOut = data.reduce((acc, curr) => acc + curr.totalOut, 0);
            } else if (type === "profit") {
                responseData.totalProfit = data.reduce((acc, curr) => acc + curr.profit, 0)
            } else {
                responseData.totalRevenue = data.reduce((acc, curr) => acc + (curr.totalIn - curr.totalOut), 0);
            }

            return responseData;
        })
    );
};

const calculateMachineTotals = (data) => {
    return data.reduce((acc, curr) => {
        const { machineId, totalIn, totalOut } = curr;

        if (!acc[machineId]) {
            acc[machineId] = { machineId, totalIn: 0, totalOut: 0 };
        }

        acc[machineId].totalIn += totalIn;
        acc[machineId].totalOut += totalOut;

        return acc;
    }, {});
};


const calulcateMahinesWeeklyData = catchAsync(async (req, res) => {

    const { page = 1, limit = 10 } = req.query

    const currentDate = new Date();
    let query = { numberPersonId: req.user.id }

    const startOfWeek = new Date();
    startOfWeek.setDate(currentDate.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    query.createdAt = { $gte: startOfWeek, $lte: currentDate };
    const result = await paginate(ShiftReport, query, page, limit)
    const machineTotals = Object.values(calculateMachineTotals(result.data.data));

    const machineTotalPages = Math.ceil(machineTotals.length / limit);
    const paginatedMachineTotals = machineTotals.slice((page - 1) * limit, page * limit);

    const fetchStats = await ShiftSummary.find({ numberPersonId: req.user.id });

    const totals = fetchStats.reduce((acc, stat) => {
        acc.totalIn += stat.totalIn || 0;
        acc.totalOut += stat.totalOut || 0;
        acc.totalProfit += stat.profit || 0;
        acc.payroll += stat.payroll || 0;
        acc.match += stat.match || 0;
        acc.misc += stat.misc || 0;
        acc.totalClear += stat.totalClear || 0;
        acc.actualMoney += stat.actualMoney || 0;
        acc.short += stat.short || 0;
        acc.matchPercentage += stat.matchPercentage || 0;
        return acc;
    }, {
        totalIn: 0,
        totalOut: 0,
        totalProfit: 0,
        payroll: 0,
        match: 0,
        misc: 0,
        totalClear: 0,
        actualMoney: 0,
        short: 0,
        matchPercentage: 0
    });



    return res.status(httpStatus.OK).send({
        success: true, data: {
            totalValues: totals,
            machineData: paginatedMachineTotals,
            pagination: {
                totalPages: machineTotalPages, 
                currentPage: page,
                totalRecords: machineTotals.length
            }
        }
    })
})



module.exports = { graphsData, calulcateMahinesWeeklyData }