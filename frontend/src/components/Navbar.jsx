import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {setShowSearch , getCartCount,navigate,token,setToken,setCartItems}=useContext(ShopContext)

  const logout=()=>{
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">

      {/* LOGO */}
     <Link to='/' ><img src={assets.logo} className="w-36" alt="logo" /></Link>

      {/* DESKTOP MENU */}
      <ul className="hidden sm:flex text-sm text-gray-700 gap-6">

        {["/", "/about", "/collection", "/contact"].map((path, i) => (
          <NavLink
            key={i}
            to={path}
            className="flex flex-col items-center gap-1"
          >
            <p>
              {["HOME", "ABOUT", "COLLECTION", "CONTACT"][i]}
            </p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        ))}

      </ul>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-6">

        {/* SEARCH */}
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" alt="search" />

        {/* PROFILE DROPDOWN */}
        <div className="group relative">
         <Link to = '/login '> <img onClick={()=>token?null:navigate('/login')} src={assets.profile_icon} className="w-5 cursor-pointer" alt="profile" /></Link>

          {token&& 
          <div className="group-hover:block hidden absolute right-0 pt-4">
            <div className="flex flex-col gap-3 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p onClick={()=>navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
              <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>}
        </div>

        {/* CART */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 h-4 leading-4 text-center bg-black text-white rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* MOBILE MENU ICON */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="menu"
        />

      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 bg-white overflow-hidden transition-all duration-300 
        ${visible ? "w-full" : "w-0"}`}
      >

        {/* BACK BUTTON */}
        <div
          onClick={() => setVisible(false)}
          className="flex items-center gap-4 p-4 cursor-pointer"
        >
          <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="back" />
          <p>Back</p>
        </div>

        {/* MOBILE LINKS */}
        {["/", "/collection", "/about", "/contact"].map((path, i) => (
          <NavLink
            key={i}
            to={path}
            onClick={() => setVisible(false)}
            className="block py-2 pl-6 border-b"
          >
            {["HOME", "COLLECTION", "ABOUT", "CONTACT"][i]}
          </NavLink>
        ))}

      </div>

    </div>
  );
};

export default Navbar;
