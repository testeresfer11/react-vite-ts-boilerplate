const httpStatus = require("http-status");
const Notification = require("../models/notifications.model");
const { User } = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const { paginate } = require("../services/admin.service");

const sendNotification = catchAsync(async (req, res) => {
    const { userId, title, message, type } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const data = await Notification.create({
        title, message, type, userId: user._id, sentBy: req.user.id
    })
    res.status(httpStatus.CREATED).send({ data })
})

const recieveNotification = catchAsync(async (req, res) => {
    const { id } = req.user;
    const { page = 1, limit = 5, search ,startDate , endDate} = req.query;
    let query = {};
    if (search) {
        query = {
            $or: [
                { title: { $regex: search, $options: 'i' } }
            ]
        };
    }

    if (startDate || endDate) {
        const dateFilter = {};
        
        if (startDate) {
            dateFilter.$gte = new Date(startDate); 
        }
        
        if (endDate) {
            dateFilter.$lte = new Date(endDate); 
        }
        
        query.createdAt = dateFilter;
    }

    const { data, pagination } = await paginate(Notification, query, page, limit, "-password", [{ path: "userId", select: 'image name email' }, { path: "sentBy", select: 'image name email' }]);
    res.status(httpStatus.OK).send({
        success: true,
        message: search ? "Filtered Notification Fetched Successfully" : "All Notification Fetched Successfully",
        data,
        pagination
    });
})

const deleteNotification = catchAsync(async (req, res) => {
    const { id } = req.query
    const data = await Notification.findByIdAndDelete(id)
    if (!data) return res.status(httpStatus.NOT_FOUND).send({ message: "Notification not found" })
    res.status(httpStatus.OK).send({ message: "Deleted" })
})
const deleteAllNotification = catchAsync(async (req, res) => {
    const { id } = req.user
    const data = await Notification.deleteMany()
    if (!data) return res.status(httpStatus.NOT_FOUND).send({ message: "Notification not found" })
    res.status(httpStatus.OK).send({ message: "Deleted" ,data})
})

const deleteSelectedNotification = catchAsync(async (req, res) => {
    const { id } = req.user;
    const { notificationIds } = req.body;
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'No notification IDs provided' });
    }

    const data = await Notification.deleteMany({
        _id: { $in: notificationIds },
    });

    if (data.deletedCount === 0) {
        return res.status(httpStatus.NOT_FOUND).send({ message: 'No notifications found with the provided IDs' });
    }

    res.status(httpStatus.OK).send({ message: `${data.deletedCount} notifications deleted successfully` });
});

const markedAsRead = catchAsync(async (req, res) => {
    const { notificationIds } = req.body;
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'No notification IDs provided' });
    }

    const data = await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { $set: { marked: true } }
    );

    return res.status(httpStatus.OK).send({
        message: 'Notifications marked as read',
        updatedCount: data.modifiedCount,
    });
});


const markedAllAsRead = catchAsync(async (req, res) => {
    await Notification.updateMany({}, { marked: true });

    res.status(200).json({
        status: "success",
        message: "All notifications marked as read",
    });
});


module.exports = {
    sendNotification, recieveNotification, deleteNotification,
    deleteAllNotification, deleteSelectedNotification, markedAsRead ,markedAllAsRead
}