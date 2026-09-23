import asyncHandler from '../middleware/asyncHandler.js';
import { isValidObjectId } from 'mongoose';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { buildOrderItems, getOrderProductIds } from '../utils/orderItems.js';
import { canAccessOrder } from '../utils/orderAccess.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  let productIds;
  try {
    productIds = getOrderProductIds(orderItems);
  } catch (error) {
    res.status(400);
    throw error;
  }

  if (!productIds.every(isValidObjectId)) {
    res.status(400);
    throw new Error('Invalid product reference');
  }

  const addressFields = ['address', 'city', 'postalCode', 'country'];
  const hasValidShippingAddress = addressFields.every(
    (field) => typeof shippingAddress?.[field] === 'string' && shippingAddress[field].trim()
  );

  if (!hasValidShippingAddress) {
    res.status(400);
    throw new Error('Complete shipping address is required');
  }

  if (paymentMethod !== 'PayPal') {
    res.status(400);
    throw new Error('Unsupported payment method');
  }

  const itemsFromDB = await Product.find({
    _id: { $in: productIds },
  });

  let dbOrderItems;
  try {
    dbOrderItems = buildOrderItems(orderItems, itemsFromDB);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress: Object.fromEntries(
      addressFields.map((field) => [field, shippingAddress[field].trim()])
    ),
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private owner/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!canAccessOrder(order.user, req.user)) {
    res.status(403);
    throw new Error('Not authorized to access this order');
  }

  res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private owner/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!canAccessOrder(order.user, req.user)) {
    res.status(403);
    throw new Error('Not authorized to pay for this order');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  if (typeof req.body.id !== 'string' || !req.body.id.trim()) {
    res.status(400);
    throw new Error('Payment transaction ID is required');
  }

  const transactionId = req.body.id.trim();
  const { verified, value } = await verifyPayPalPayment(transactionId);
  if (!verified) {
    res.status(400);
    throw new Error('Payment not verified');
  }

  const isNewTransaction = await checkIfNewTransaction(Order, transactionId);
  if (!isNewTransaction) {
    res.status(400);
    throw new Error('Transaction has been used before');
  }

  const paidCorrectAmount = order.totalPrice.toString() === value;
  if (!paidCorrectAmount) {
    res.status(400);
    throw new Error('Incorrect amount paid');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: transactionId,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
