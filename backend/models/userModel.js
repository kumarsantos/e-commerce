import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Name cannot exceed 30 characters'],
    minLength: [4, 'Name should have morethan 4 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please Enter a valid Email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [8, 'Password should be greater than 8 characters'],
    // select: false,
  },
  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// usersSchema.pre('save', async function (req, res, next) {
//   //if password is already hashed in case of update user so password will be prev hashed one(update profile one)
//   if (!this.isModified('password')) {
//     next();
//   }
//   this.password = bcrypt.hash(this.password, 10);
// });

//JWT TOKEN
usersSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED,
  });
};

//Compare password
usersSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

//Generate Password reset token
usersSchema.methods.getResetPasswordToken = function () {
  //Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex'); //this will generate random string of 20 bytes
  //Hashing and adding to resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); //to get hashed hex value
  // setting expiry date for resetToken
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const userSchema = mongoose.model('Users', usersSchema);
export default userSchema;
