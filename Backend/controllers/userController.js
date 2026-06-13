import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendOtpEmail from "../config/email.js";
import adminOtpModel from "../models/adminOtpModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const getRemainingCooldown = (lastSentAt) => {
  if (!lastSentAt) return 0;
  return Math.max(0, OTP_RESEND_COOLDOWN_MS - (Date.now() - lastSentAt));
};

const formatCooldownMessage = (remainingMs) => {
  const seconds = Math.ceil(remainingMs / 1000);
  return `Please wait ${seconds} seconds before requesting another OTP`;
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "user does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      return res.json({ success: true, token });
    }
    res.json({ success: false, message: "Invalid creadentials" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "user already exists " });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Plz enter a valid email " });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Plz enter a strong password ",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email || "")) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const remainingCooldown = getRemainingCooldown(user.loginOtpLastSentAt);
    if (remainingCooldown > 0) {
      return res.json({
        success: false,
        message: formatCooldownMessage(remainingCooldown),
      });
    }

    const otp = generateOtp();
    user.loginOtp = otp;
    user.loginOtpExpireAt = Date.now() + OTP_EXPIRY_MS;
    user.loginOtpLastSentAt = Date.now();
    user.loginOtpAttempts = 0;
    await user.save();

    await sendOtpEmail(email, "Login OTP", otp, "login");
    res.json({ success: true, message: "Login OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    if (user.loginOtpAttempts >= OTP_MAX_ATTEMPTS) {
      user.loginOtp = "";
      user.loginOtpExpireAt = 0;
      user.loginOtpLastSentAt = 0;
      user.loginOtpAttempts = 0;
      await user.save();
      return res.json({
        success: false,
        message: "Too many invalid OTP attempts. Please request a new OTP",
      });
    }

    if (!user.loginOtp || user.loginOtp !== otp || user.loginOtpExpireAt < Date.now()) {
      user.loginOtpAttempts += 1;
      await user.save();
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    user.loginOtp = "";
    user.loginOtpExpireAt = 0;
    user.loginOtpLastSentAt = 0;
    user.loginOtpAttempts = 0;
    await user.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email || "")) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const remainingCooldown = getRemainingCooldown(user.resetOtpLastSentAt);
    if (remainingCooldown > 0) {
      return res.json({
        success: false,
        message: formatCooldownMessage(remainingCooldown),
      });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + OTP_EXPIRY_MS;
    user.resetOtpLastSentAt = Date.now();
    user.resetOtpAttempts = 0;
    await user.save();

    await sendOtpEmail(email, "Password Reset OTP", otp, "password reset");
    res.json({ success: true, message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    if (user.resetOtpAttempts >= OTP_MAX_ATTEMPTS) {
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;
      user.resetOtpLastSentAt = 0;
      user.resetOtpAttempts = 0;
      await user.save();
      return res.json({
        success: false,
        message: "Too many invalid OTP attempts. Please request a new OTP",
      });
    }

    if (!user.resetOtp || user.resetOtp !== otp || user.resetOtpExpireAt < Date.now()) {
      user.resetOtpAttempts += 1;
      await user.save();
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a password with at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    user.resetOtpLastSentAt = 0;
    user.resetOtpAttempts = 0;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const sendAdminOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "invalid admin email" });
    }

    const remainingCooldown = await adminOtpModel.findOne({ email });
    const cooldownMs = getRemainingCooldown(remainingCooldown?.otpLastSentAt || 0);
    if (cooldownMs > 0) {
      return res.json({
        success: false,
        message: formatCooldownMessage(cooldownMs),
      });
    }

    const otp = generateOtp();
    const otpData =
      (await adminOtpModel.findOneAndUpdate(
        { email },
        {
          email,
          otp,
          otpExpireAt: Date.now() + OTP_EXPIRY_MS,
          otpLastSentAt: Date.now(),
          otpAttempts: 0,
        },
        { upsert: true, new: true }
      )) || {};

    await sendOtpEmail(email, "Admin Login OTP", otp, "admin login");
    res.json({ success: true, message: "Admin OTP sent to your email", otpId: otpData._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "invalid admin email" });
    }

    const otpRecord = await adminOtpModel.findOne({ email });
    if (!otpRecord) {
      return res.json({ success: false, message: "Please request an OTP first" });
    }

    if (otpRecord.otpAttempts >= OTP_MAX_ATTEMPTS) {
      otpRecord.otp = "";
      otpRecord.otpExpireAt = 0;
      otpRecord.otpLastSentAt = 0;
      otpRecord.otpAttempts = 0;
      await otpRecord.save();
      return res.json({
        success: false,
        message: "Too many invalid OTP attempts. Please request a new OTP",
      });
    }

    if (!otpRecord.otp || otpRecord.otp !== otp || otpRecord.otpExpireAt < Date.now()) {
      otpRecord.otpAttempts += 1;
      await otpRecord.save();
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    otpRecord.otp = "";
    otpRecord.otpExpireAt = 0;
    otpRecord.otpLastSentAt = 0;
    otpRecord.otpAttempts = 0;
    await otpRecord.save();

    const token = jwt.sign(process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  adminLogin,
  registerUser,
  sendLoginOtp,
  verifyLoginOtp,
  sendResetOtp,
  resetPasswordWithOtp,
  sendAdminOtp,
  verifyAdminOtp,
};
