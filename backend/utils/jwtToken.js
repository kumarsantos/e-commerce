export const sendToken = async(user, statusCode, res) => {
  const token =  user.getJWTToken();
  //options for cookies
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOCKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };
  const { password, ...others } = user._doc;
  return res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user: others,
    token,
  });
};
