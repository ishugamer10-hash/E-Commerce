// import { currency } from "../../admin/src/App.jsx";
import crypto from "crypto";
import Razorpay from "razorpay";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import Stripe from "stripe";

const currency = "inr";
const deliveryCharge = 10;

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const getFrontendOrigin = (req) => process.env.FRONTEND_URL || req.headers.origin || "http://localhost:5173";

const isValidOrderPayload = (item, amount) =>
  Array.isArray(item) && item.length > 0 && Number(amount) > 0;

const placeOrder = async (req, res) => {
  try {
    const { userId, item, amount, address } = req.body;

    if (!isValidOrderPayload(item, amount)) {
      return res.json({ success: false, message: "Your cart is empty or order amount is invalid" });
    }

    const orderData = {
      userId,
      item,
      amount,
      address,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "order placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, item, amount, address } = req.body;
    const origin = getFrontendOrigin(req);
    const stripe = getStripe();

    if (!isValidOrderPayload(item, amount)) {
      return res.json({ success: false, message: "Your cart is empty or order amount is invalid" });
    }

    const orderData = {
      userId,
      item,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = item.map((orderItem) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: orderItem.name,
        },
        unit_amount: orderItem.price * 100,
      },
      quantity: orderItem.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      customer_email: address?.email,
      metadata: {
        orderId: newOrder._id.toString(),
        userId,
      },
      mode: "payment",
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }
};
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    if (!order || order.userId !== userId) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true, message: "payment successful" });
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false, message: "payment failed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, message: "Incomplete payment verification data" });
    }

    const order = await orderModel.findById(orderId);
    if (!order || order.userId !== userId) {
      return res.json({ success: false, message: "Order not found" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Payment signature verification failed" });
    }

    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "payment successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, item, amount, address } = req.body;
    const razorpayInstance = getRazorpayInstance();

    if (!isValidOrderPayload(item, amount)) {
      return res.json({ success: false, message: "Your cart is empty or order amount is invalid" });
    }

    const orderData = {
      userId,
      item,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error.message || "Unable to create Razorpay order" });
      }
      res.json({ success: true, order, orderId: newOrder._id, key: process.env.RAZORPAY_KEY_ID });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};
