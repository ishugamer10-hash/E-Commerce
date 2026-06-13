import {
  loginUser,
  adminLogin,
  registerUser,
  sendLoginOtp,
  verifyLoginOtp,
  sendResetOtp,
  resetPasswordWithOtp,
  sendAdminOtp,
  verifyAdminOtp,
} from "../controllers/userController.js";
import express from "express";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/send-login-otp", sendLoginOtp);
userRouter.post("/verify-login-otp", verifyLoginOtp);
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPasswordWithOtp);
userRouter.post("/send-admin-otp", sendAdminOtp);
userRouter.post("/verify-admin-otp", verifyAdminOtp);
userRouter.post("/admin", adminLogin);

export default userRouter;
