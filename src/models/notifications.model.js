const mongoose = require('mongoose');

// Define Notification Schema
const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['email', 'push', 'sms'], 
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'sent',
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerAttendent', 
  },
  marked:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sentAt: {
    type: Date,
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
