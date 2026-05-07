// import { useState, useEffect } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser, getProfile } from "../../redux/slice/profile/profileSlice";

// import logo from "../../assets/frontend_assets/logo.png";

// import cart from "../../assets/frontend_assets/basket_icon.png";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { pathname } = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const { items } = useSelector((state) => state.pagecart);
//   const token = useSelector((state) => state.profile.token);
//   const user = useSelector((state) => state.profile.user);

//   // ✅ FIXED: Unique dish count (items.length), NOT quantity total
//   const uniqueDishCount = items?.length || 0;

//   useEffect(() => {
//     if (token && !user) dispatch(getProfile());
//   }, [token, dispatch, user]);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setMenuOpen(false);
//     navigate("/");
//   };

//   const navItems = [
//     { label: "Home", path: "/" },
//     { label: "Menu", path: "/menu" },
//     { label: "My Orders", path: "/orders" },
//     { label: "Contact Us", path: "/contactus" },
//   ];

//   return (
//     <>
//       <nav
//         className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//           scrolled
//             ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
//             : "bg-white border-b border-gray-100"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center shrink-0">
//             <img src={logo} alt="Tomato" className="h-8 w-auto" />
//           </Link>

//           {/* Desktop nav links */}
//           <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
//             {navItems.map((item) => (
//               <li key={item.label}>
//                 <Link
//                   to={item.path}
//                   className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
//                     pathname === item.path
//                       ? "text-[#e84825] bg-orange-50"
//                       : "text-gray-600 hover:text-[#e84825] hover:bg-orange-50"
//                   }`}
//                 >
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>

//           {/* Right actions */}
//           <div className="flex items-center gap-2">
//             {/* Cart with unique dish count */}
//             <button
//               onClick={() => navigate("/cart")}
//               className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
//               aria-label="Cart"
//             >
//               <img src={cart} className="w-5 h-5 opacity-70" alt="cart" />
//               {uniqueDishCount > 0 && (
//                 <span className="absolute cursor-pointer -top-0.5 -right-0.5 bg-[#e84825] text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 font-bold shadow-sm">
//                   {uniqueDishCount > 99 ? "99+" : uniqueDishCount}
//                 </span>
//               )}
//             </button>

//             {/* Auth */}
//             {token ? (
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => navigate("/profile")}
//                   className="w-9 h-9 cursor-pointer border-2 border-[#e84825] rounded-full bg-orange-50 text-[#e84825] font-bold text-sm flex items-center justify-center hover:bg-[#e84825] hover:text-white transition-all duration-200"
//                 >
//                   {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="hidden sm:block px-5 py-2 bg-[#262626] text-white rounded-full text-sm font-semibold hover:bg-[#e84825] transition-all duration-200 cursor-pointer"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => navigate("/signup")}
//                 className="hidden  sm:block px-5 py-2 border-2 border-[#262626] rounded-full text-sm font-semibold hover:bg-[#262626] hover:text-white transition-all duration-200 cursor-pointer"
//               >
//                 Sign Up
//               </button>
//             )}

//             {/* Hamburger */}
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="md:hidden p-2 rounded-full hover:bg-gray-100"
//               aria-label="Menu"
//             >
//               <div className="w-5 space-y-1">
//                 <span
//                   className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
//                 />
//                 <span
//                   className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
//                 />
//                 <span
//                   className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
//                 />
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         <div
//           className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-80" : "max-h-0"}`}
//         >
//           <div className="px-4 py-4 space-y-1 bg-white border-t border-gray-100">
//             {navItems.map((item) => (
//               <Link
//                 key={item.label}
//                 to={item.path}
//                 onClick={() => setMenuOpen(false)}
//                 className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
//                   pathname === item.path
//                     ? "bg-orange-50 text-[#e84825] font-semibold"
//                     : "text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 {item.label}
//               </Link>
//             ))}
//             <div className="pt-2 border-t border-gray-100 mt-2">
//               {token ? (
//                 <button
//                   onClick={handleLogout}
//                   className="w-full py-2.5 cursor-pointer bg-red-50 text-[#e84825] font-bold rounded-xl text-sm cursor-pointer"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => {
//                     navigate("/signup");
//                     setMenuOpen(false);
//                   }}
//                   className="w-full py-2.5 cursor-pointer bg-[#262626] text-white rounded-xl text-sm font-semibold cursor-pointer"
//                 >
//                   Sign Up
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="h-[68px]" />
//     </>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, getProfile } from "../../redux/slice/profile/profileSlice";

import logo from "../../assets/frontend_assets/logo.png";
import cart from "../../assets/frontend_assets/basket_icon.png";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { items } = useSelector((state) => state.pagecart);
  const token = useSelector((state) => state.profile.token);
  const user = useSelector((state) => state.profile.user);

  const uniqueDishCount = items?.length || 0;

  useEffect(() => {
    if (token && !user) dispatch(getProfile());
  }, [token, dispatch, user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Menu", path: "/menu" },
    { label: "My Orders", path: "/orders" },
    { label: "Contact Us", path: "/contactus" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Tomato" className="h-8 w-auto" />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    pathname === item.path
                      ? "text-[#e84825] bg-orange-50"
                      : "text-gray-600 hover:text-[#e84825] hover:bg-orange-50"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <img src={cart} className="w-5 h-5 opacity-70" alt="cart" />
              {uniqueDishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#e84825] text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 font-bold shadow-sm">
                  {uniqueDishCount > 99 ? "99+" : uniqueDishCount}
                </span>
              )}
            </button>

            {/* Auth — Desktop */}
            {token ? (
              // Logged in — profile avatar + logout
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-9 h-9 cursor-pointer border-2 border-[#e84825] rounded-full bg-orange-50 text-[#e84825] font-bold text-sm flex items-center justify-center hover:bg-[#e84825] hover:text-white transition-all duration-200"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </button>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block px-5 py-2 bg-[#262626] text-white rounded-full text-sm font-semibold hover:bg-[#e84825] transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in — Login + Sign Up dono
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 border-2 border-[#e84825] text-[#e84825] rounded-full text-sm font-semibold hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 bg-[#e84825] text-white rounded-full text-sm font-semibold hover:bg-[#c73d1e] transition-all duration-200 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              aria-label="Menu"
            >
              <div className="w-5 space-y-1">
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-96" : "max-h-0"}`}>
          <div className="px-4 py-4 space-y-1 bg-white border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? "bg-orange-50 text-[#e84825] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth buttons */}
            <div className="pt-2 border-t border-gray-100 mt-2 space-y-2">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 cursor-pointer bg-red-50 text-[#e84825] font-bold rounded-xl text-sm"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { navigate("/login"); setMenuOpen(false); }}
                    className="w-full py-2.5 cursor-pointer border-2 border-[#e84825] text-[#e84825] rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate("/signup"); setMenuOpen(false); }}
                    className="w-full py-2.5 cursor-pointer bg-[#e84825] text-white rounded-xl text-sm font-semibold hover:bg-[#c73d1e] transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-[68px]" />
    </>
  );
}