import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    loginOtp: { type: String, default: "" },
    loginOtpExpireAt: { type: Number, default: 0 },
    loginOtpLastSentAt: { type: Number, default: 0 },
    loginOtpAttempts: { type: Number, default: 0 },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
    resetOtpLastSentAt: { type: Number, default: 0 },
    resetOtpAttempts: { type: Number, default: 0 },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
