import User from '../models/userModel.js';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import { customError } from '../utils/errorHandler.js';
import { sendToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary';

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  let myCloud = { public_id: '', secure_url: '' };
  if (req.body.avatar !== '') {
    myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatar',
      width: 150,
      crop: 'scale',
    });
  }

  if (!email || !name || !password) {
    return next(customError('Please enter all the field', 401));
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashPassword,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(customError('Please enter username and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(customError('Invalid email or password', 401));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(customError('Invalid email or password', 401));
  }
  sendToken(user, 200, res);
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'Logged out successfully',
    });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({ users, success: true });
});

export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(customError('User not found', 404));
  }
  res.status(200).json({ user, success: true });
});

export const updateUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(customError('User not found', 404));
  }

  const newUser = await User.findByIdAndUpdate({ _id: user.id }, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: false,
  });
  res
    .status(200)
    .json({ message: 'User details has been updated', success: true, newUser });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(customError('User not found', 404));
  }
  await User.findOneAndRemove({ _id: id });

  res
    .status(200)
    .cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'Account deleted successfully',
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(customError('User not found', 404));
  }
  try {
    const resetToken = user.getResetPasswordToken();
    // await user.save({ validateBeforeSave: false }); //instead of this used below one because .save() func no longer available
    await User.findByIdAndUpdate(
      { _id: user._id },
      { ...user, resetPasswordToken: resetToken }
    );
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;//for testing locally
    // const resetPasswordUrl = `${req.protocol}://${req.get(
    //   'host'
    // )}/api/v1/user/password/reset/${resetToken}`;

    const message = `Your password reset token is:- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then, please ignore it`;
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message: message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined; // if error occured after saving token into db so we are again setting ot undefined
    user.resetPasswordExpire = undefined;
    // await user.save(); //again saving all the value with undefined for reset token//instead of this used below one
    await User.findByIdAndUpdate({ _id: user._id }, user);
    return next(customError(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash for matching in database
  // creating token hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      customError('Reset Password Token is invalid or has been expired', 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(customError('Password does not password', 400));
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined; //this will take default date
  user.resetPasswordExpire = 'undefined'; //because this is string
  // await user.save();//instead of this used below one instead of save doing update
  await User.findByIdAndUpdate({ _id: user._id }, user);

  sendToken(user, 200, res);
});

//req.protocol will give http or https
//req.get('host') will give either localhost or remote host after deployment

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    user,
    success: true,
  });
});
export const updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, newConfirmPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    return next(customError('Old password is incorrect', 400));
  }

  if (newPassword !== newConfirmPassword) {
    return next(
      customError('Your new password and confirm password does not match', 400)
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate({ _id: req.user.id }, user);
  res.status(200).json({
    message: 'Password updated successfully',
    success: true,
  });
});
export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);
    const imageId = user?.avatar?.public_id;
    if (imageId) {
      await cloudinary.v2.uploader.destroy(imageId);
    }
    try {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatar',
        width: 150,
        crop: 'scale',
      });
      newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } catch (error) {
      console.log(error);
    }
  }

  const user = await User.findByIdAndUpdate({ _id: req.user.id }, newUserData, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  });

  res.status(200).json({
    message: 'Profile updated successfully',
    success: true,
  });
});
