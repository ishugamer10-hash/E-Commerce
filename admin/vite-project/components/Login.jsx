import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../src/config";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
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
        <p className="mt-2 text-sm text-slate-500">Use the admin email and password from your backend environment.</p>

        <form onSubmit={onSubmitHandler} className="mt-8 space-y-5">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
