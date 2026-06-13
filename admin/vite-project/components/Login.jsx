import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../src/config";

const Login = ({ setToken }) => {
  const [mode, setMode] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetOtpState = () => {
    setOtp("");
    setOtpSent(false);
    setCooldown(0);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setPassword("");
    resetOtpState();
  };

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const interval = setInterval(() => {
      setCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "password") {
        const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });

        if (response.data.success) {
          setToken(response.data.token);
          toast.success("Welcome back");
        } else {
          toast.error(response.data.message);
        }
        return;
      }

      if (mode === "otp") {
        if (!otpSent) {
          const response = await axios.post(`${backendUrl}/api/user/send-admin-otp`, { email });
          if (response.data.success) {
            setOtpSent(true);
            setCooldown(60);
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/verify-admin-otp`, { email, otp });
        if (response.data.success) {
          setToken(response.data.token);
          toast.success("Welcome back");
        } else {
          toast.error(response.data.message);
        }
        return;
      }

      const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Welcome back");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Forever Admin</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Sign in to manage your store</h1>
        <p className="mt-2 text-sm text-slate-500">Use your admin password or switch to OTP login.</p>

        <form onSubmit={onSubmitHandler} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("password")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                mode === "password" ? "bg-white text-slate-900 shadow" : "text-slate-500"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => switchMode("otp")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                mode === "otp" ? "bg-white text-slate-900 shadow" : "text-slate-500"
              }`}
            >
              OTP Login
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl px-4 py-3"
              placeholder="admin@example.com"
              required
            />
          </div>

          {mode === "password" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl px-4 py-3"
                placeholder="Enter your password"
                required
              />
            </div>
          ) : (
            otpSent && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="otp">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="w-full rounded-xl px-4 py-3"
                  placeholder="Enter admin OTP"
                  required
                />
              </div>
            )
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Signing in..."
              : mode === "otp" && !otpSent
                ? "Send OTP"
                : mode === "otp" && otpSent
                  ? "Verify OTP"
                  : "Login"}
          </button>

          {mode === "otp" && otpSent && (
            <button
              type="button"
              onClick={async () => {
                if (cooldown > 0) return;
                try {
                  const response = await axios.post(`${backendUrl}/api/user/send-admin-otp`, { email });
                  if (response.data.success) {
                    setCooldown(60);
                    toast.success(response.data.message);
                  } else {
                    toast.error(response.data.message);
                  }
                } catch (error) {
                  toast.error(error.response?.data?.message || error.message);
                }
              }}
              disabled={cooldown > 0}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
