import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const modeSequence = ["login", "signup", "otp", "reset"];

const Login = () => {
  const [mode, setMode] = useState("login");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const saveToken = (nextToken) => {
    setToken(nextToken);
    localStorage.setItem("token", nextToken);
  };

  const resetOtpState = () => {
    setOtpSent(false);
    setOtp("");
    setNewPassword("");
    setOtpCooldown(0);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setPassword("");
    resetOtpState();
  };

  const cycleMode = (direction) => {
    const currentIndex = modeSequence.indexOf(mode);
    const nextIndex = (currentIndex + direction + modeSequence.length) % modeSequence.length;
    switchMode(modeSequence[nextIndex]);
  };

  const handleModeKeyDown = (event, targetMode) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      cycleMode(1);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      cycleMode(-1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      switchMode(targetMode);
    }
  };

  const requestOtp = async (endpoint) => {
    const response = await axios.post(`${backendUrl}${endpoint}`, { email });

    if (response.data.success) {
      setOtpSent(true);
      setOtpCooldown(60);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (mode === "signup") {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          saveToken(response.data.token);
        } else {
          toast.error(response.data.message);
        }
        return;
      }

      if (mode === "login") {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          saveToken(response.data.token);
        } else {
          toast.error(response.data.message);
        }
        return;
      }

      if (mode === "otp") {
        if (!otpSent) {
          await requestOtp("/api/user/send-login-otp");
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/verify-login-otp`, {
          email,
          otp,
        });

        if (response.data.success) {
          saveToken(response.data.token);
        } else {
          toast.error(response.data.message);
        }
        return;
      }

      if (mode === "reset") {
        if (!otpSent) {
          await requestOtp("/api/user/send-reset-otp");
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
          email,
          otp,
          newPassword,
        });

        if (response.data.success) {
          toast.success(response.data.message);
          switchMode("login");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (otpCooldown <= 0) return undefined;

    const interval = setInterval(() => {
      setOtpCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpCooldown]);

  const titleMap = {
    login: "Login",
    signup: "Sign Up",
    otp: "Login With OTP",
    reset: "Reset Password",
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex mt-10 items-center gap-2 mb-2">
        <p className="prata-regular text-3xl">{titleMap[mode]}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <div className="grid w-full grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {modeSequence.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => switchMode(item)}
            onKeyDown={(event) => handleModeKeyDown(event, item)}
            className={`rounded-full border px-3 py-2 transition ${
              mode === item ? "bg-black text-white" : "border-gray-400"
            }`}
          >
            {titleMap[item]}
          </button>
        ))}
      </div>

      {mode === "signup" && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />

      {(mode === "login" || mode === "signup") && (
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Password"
          required
        />
      )}

      {mode === "otp" && otpSent && (
        <input
          onChange={(e) => setOtp(e.target.value)}
          value={otp}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Enter OTP"
          required
        />
      )}

      {mode === "reset" && otpSent && (
        <>
          <p className="text-sm text-green-600">
            OTP sent to your email. Enter it below to reset your password.
          </p>
          <input
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter OTP"
            required
          />
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="New password"
            required
          />
        </>
      )}

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        {mode !== "reset" ? (
          <button type="button" onClick={() => switchMode("reset")} className="cursor-pointer">
            Forgot your password?
          </button>
        ) : (
          <button type="button" onClick={() => switchMode("login")} className="cursor-pointer">
            Back to login
          </button>
        )}

        {mode === "login" ? (
          <button type="button" onClick={() => switchMode("signup")} className="cursor-pointer">
            Create account
          </button>
        ) : (
          mode !== "login" && (
            <button type="button" onClick={() => switchMode("login")} className="cursor-pointer">
              Login here
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => switchMode(mode === "otp" ? "login" : "otp")}
        className="w-full text-sm text-right cursor-pointer"
      >
        {mode === "otp" ? "Use password login" : "Login with OTP"}
      </button>

      <button className="bg-black text-white px-8 py-2 mt-4">
        {mode === "signup" && "Sign Up"}
        {mode === "login" && "Sign In"}
        {mode === "otp" && (otpSent ? "Verify OTP" : "Send OTP")}
        {mode === "reset" && (otpSent ? "Reset Password" : "Send Reset OTP")}
      </button>

      {((mode === "otp" && otpSent) || (mode === "reset" && otpSent)) && (
        <div className="flex flex-col items-end gap-1">
          {mode === "reset" && (
            <p className="text-xs text-gray-500">
              Didn’t receive it? We can resend a new code after the countdown.
            </p>
          )}
          <button
            type="button"
            onClick={() =>
              requestOtp(mode === "otp" ? "/api/user/send-login-otp" : "/api/user/send-reset-otp")
            }
            disabled={otpCooldown > 0}
            className={`text-sm ${otpCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-black cursor-pointer"}`}
          >
            {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Resend OTP"}
          </button>
        </div>
      )}
    </form>
  );
};

export default Login;
