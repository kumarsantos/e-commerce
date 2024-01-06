export const catchAsyncErrors = (callback) => (req, res, next) => {
  Promise.resolve(callback(req, res, next)).catch(err=>next(err));
};

export default catchAsyncErrors;
