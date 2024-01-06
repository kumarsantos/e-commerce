import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import { customError } from '../utils/errorHandler.js';

export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discountPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discountPrice,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(201).json({
    message: 'Order has been created successfully',
    success: true,
    order,
  });
});
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orderPerPage = 5;
  const ordersCount = await Order.countDocuments();

  const apiFeature = new ApiFeatures(Order.find(), req.query)
    .search()
    .filter()
    .pagination(orderPerPage);
  const orders = await apiFeature.query;

  let totalAmount = 0;
  orders.forEach((item) => {
    totalAmount += item.totalPrice;
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount,
    ordersCount,
  });
});
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discountPrice,
  } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      discountPrice,
      paidAt: Date.now(),
      user: req.user._id,
    },
    {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    }
  );
  if (!order) {
    return next(customError('Order not found with this id', 404));
  }
  res.status(201).json({
    message: 'Order has been updated successfully',
    success: true,
    order,
  });
});
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    return next(customError('Order not found', 404));
  }
  await Order.findOneAndRemove({ _id: id });
  res.status(200).json({
    message: 'Order has been deleted successfully',
    success: true,
  });
});
export const singleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.query.id);
  if (!order) {
    return next(
      customError(`Order not found with this id ${req.query.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  if (!orders) {
    return next(
      customError(`Order not found with this id ${req.query.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await Product.findByIdAndUpdate(id, product, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  });
}

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      customError(`Order not found with this id ${req.query.id}`, 404)
    );
  }

  if (order.orderStatus === 'Delivered') {
    return next(customError('You have already delivered this product', 404));
  }

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await Order.findByIdAndUpdate(req.params.id, order, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: 'Order status has been updated successfully',
    order,
  });
});
