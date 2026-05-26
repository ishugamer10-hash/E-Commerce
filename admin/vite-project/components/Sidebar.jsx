import { NavLink } from "react-router-dom";
import { assets } from "../src/assets/assets";

const navItems = [
  { to: "/add", label: "Add Product", icon: assets.add_icon },
  { to: "/list", label: "Product List", icon: assets.order_icon },
  { to: "/orders", label: "Orders", icon: assets.parcel_icon },
];

const Sidebar = () => {
  return (
    <aside className="w-full max-w-xs rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-6 lg:h-fit">
      <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Navigation</p>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            <img className="h-5 w-5 object-contain" src={item.icon} alt="" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
