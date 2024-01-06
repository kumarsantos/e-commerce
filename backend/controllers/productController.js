import Product from '../models/productModel.js';
import { customError } from '../utils/errorHandler.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id; //this assigning user id to user ref in product schema
  const product = await Product.create(req.body);
  res.status(201).json({
    message: 'Product has been created successfully',
    product,
    success: true,
  });
});

export const getAllProduct = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  let products = await apiFeature.query;

  // const apiFeature = new ApiFeatures(Product.find(), req.query)
  //   .search()
  //   .filter();
  // let products = await apiFeature.query;
  // let filteredProductsCount = await products.length;
  // //pagination is applied after getting total FilteredProduct then pagination will applied to filtered count
  // apiFeature.pagination(resultPerPage);
  // products = await apiFeature.query;

  res.status(200).json({
    products,
    productCount,
    resultPerPage,
    success: true,
  });
});

export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById({ _id: id });
  if (!product) {
    return next(customError('Product not found', 404));
  }
  res.status(200).json({ product, success: true });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    return next(customError('Product not found', 404));
  }
  const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    message: 'Product has been updated successfully',
    success: true,
    updatedProduct,
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    return next(customError('Product not found', 404));
  }
  await Product.findOneAndRemove({ _id: id });
  res.status(200).json({ message: 'Product has been deleted', success: true });
});

//Create new review or update the review

export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const newReview = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(newReview);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await Product.findByIdAndUpdate(productId, product, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  });

  res.status(200).json({
    message: 'Reviewed the product successfully',
    success: true,
  });
});

export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(customError('Product not found', 404));
  }
  res.status(200).json({
    reviews: product.reviews,
    success: true,
  });
});

export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(customError('Product not found', 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    message: 'Review deleted successfully',
    success: true,
  });
});
