import mongoose from "mongoose";

const adminOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, default: "" },
    otpExpireAt: { type: Number, default: 0 },
    otpLastSentAt: { type: Number, default: 0 },
    otpAttempts: { type: Number, default: 0 },
  },
  { minimize: false }
);

const adminOtpModel = mongoose.models.adminOtp || mongoose.model("adminOtp", adminOtpSchema);

export default adminOtpModel;
