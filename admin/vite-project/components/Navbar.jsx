import { assets } from "../src/assets/assets";

const Navbar = ({ setToken, theme, toggleTheme }) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img className="h-10 w-auto" src={assets.logo} alt="Forever Admin" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Dashboard</p>
            <p className="text-sm text-slate-500">Products, orders, and storefront control</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className={`flex h-10 w-16 items-center rounded-full border p-1 transition-colors duration-300 ${
              theme === "dark"
                ? "justify-end border-slate-600 bg-slate-800"
                : "justify-start border-sky-200 bg-sky-100"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                theme === "dark" ? "bg-slate-100 text-slate-900" : "bg-white text-sky-700"
              }`}
            >
              {theme === "dark" ? "D" : "L"}
            </span>
          </button>
          <button
            onClick={() => setToken("")}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
