import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Login from "../components/Login";
import Add from "../pages/Add";
import List from "../pages/List";
import Orders from "../pages/Orders";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const nextTheme = theme === "dark" ? "dark-admin" : "light-admin";
    document.documentElement.classList.remove("dark-admin", "light-admin");
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  if (!token) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "admin-surface-dark text-slate-100 admin-theme-dark" : "bg-slate-100 text-slate-800"}`}>
        <ToastContainer position="top-right" autoClose={2500} />
        <Login setToken={setToken} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "admin-surface-dark text-slate-100 admin-theme-dark" : "bg-slate-100 text-slate-800"}`}>
      <ToastContainer position="top-right" autoClose={2500} />
      <Navbar setToken={setToken} theme={theme} toggleTheme={toggleTheme} />
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="flex-1 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
