const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
      // trim: true,
      lowercase: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Invalid email');
      //   }
      // },
    },
    password: {
      type: String,
      // required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    firstName:{
      type:String
    },
    lastName:{
      type:String
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    tagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFID",
      // required: true,
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
    },
    image:{
      type: String,
      default:null
    },
    phone: {
      type: String,
      // required: true,
      // match: [/^\+(\d{1,4})\d{4,10}$/, 'Please enter a valid phone number'],
    },
    issued: {
      type: Boolean,
      default: false,
    },
    age: {
      type: String,
      // required: true,
    },
    address:{
      type: String,
    },
    machines:{
      type:String
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    status:{
      type:String,
      enum:["Active","Inactive"],
      default:"Inactive"
    },
    dl:{
      type:String
    },
    floorAttendent:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"FloorAttendant"
    }
    
  },

  {
    timestamps: true,
}
);

// add plugin that converts mongoose to json
// userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
/**
* Check if email is taken (excluding empty emails)
* @param {string} email - The user's email
* @param {ObjectId} [excludeUserId] - The id of the user to be excluded
* @returns {Promise<boolean>}
*/
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  if (!email) {
      return false;
  }
  const user = await this.findOne({
      email: { $ne: null, $ne: '' },
      email,
      _id: { $ne: excludeUserId },
  });
  return !!user;
  };

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  
  // If email is provided, check if it's valid
  // if (user.email && !validator.isEmail(user.email)) {
  //   return next(new Error('Invalid email format.'));
  // }

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});


/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema); //admin
const FloorAttendant = mongoose.model('FloorAttendant', userSchema);
const NumberPerson = mongoose.model('NumberPerson', userSchema)
const CustomerAttendent = mongoose.model('CustomerAttendent',userSchema) //customer 


module.exports = { User,  FloorAttendant, NumberPerson ,CustomerAttendent};
