import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { getStoredUser } from "../utils/storage";

function Navbar() {
  const location = useLocation();

  const [user, setUser] = useState(() => getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const refreshUser = () => {
      setUser(getStoredUser());
    };

    refreshUser();

    window.addEventListener("storage", refreshUser);
    window.addEventListener("focus", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("focus", refreshUser);
    };
  }, []);

  const isHome = location.pathname === "/";

  const handleBack = () => {
    window.history.back();
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* =====================================================
          TOP MOBILE APP BAR
      ===================================================== */}

      <nav className="sticky top-0 z-[100] w-full bg-[#E1E9E5]/95 backdrop-blur-2xl border-b border-white/70 shadow-[0_6px_25px_rgba(8,86,110,0.10)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-2">
              {!isHome ? (
                <button
                  type="button"
                  onClick={handleBack}
                  aria-label="Go back"
                  className="w-11 h-11 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-[#08566E] text-lg shadow-sm active:scale-95 transition"
                >
                  <FaArrowLeft />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                  className="w-11 h-11 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-[#08566E] text-lg shadow-sm active:scale-95 transition"
                >
                  <FaBars />
                </button>
              )}
            </div>

            {/* CENTER BRAND */}
            <Link
              to="/"
              aria-label="E-SERVOO Home"
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#6FA8AA]/40 rounded-2xl blur-md"></div>

                <img
                  src="/logo.png"
                  alt="E-SERVOO"
                  className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-contain shadow-md group-hover:scale-105 transition"
                />
              </div>

              <div className="leading-none">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#08566E]">
                  E-SERVOO
                </h1>

                <p className="hidden sm:block text-[9px] font-black tracking-[0.18em] text-[#6FA8AA] uppercase mt-1">
                  Smart Local Services
                </p>
              </div>
            </Link>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

              {/* Notification */}
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("eservoo-notifications")
                  );
                }}
                className="relative w-11 h-11 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-[#08566E] text-lg shadow-sm active:scale-95 transition"
              >
                <FaBell />

                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
              </button>

              {/* Profile */}
              <Link
                to={user ? "/profile" : "/"}
                aria-label={user ? "Profile" : "Login"}
                className="w-11 h-11 rounded-2xl bg-[#08566E] flex items-center justify-center text-[#E1E9E5] text-xl shadow-md active:scale-95 transition"
              >
                <FaUserCircle />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE SIDE MENU
      ===================================================== */}

      {menuOpen && (
        <div className="fixed inset-0 z-[200]">

          {/* Overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute inset-0 bg-[#043A4A]/45 backdrop-blur-sm"
          />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-[82%] max-w-[350px] bg-[#E1E9E5] shadow-[20px_0_70px_rgba(0,0,0,0.25)] rounded-r-[32px] overflow-y-auto">

            {/* Drawer Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] px-5 pt-8 pb-7">

              <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative flex items-center justify-between">

                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3"
                >
                  <img
                    src="/logo.png"
                    alt="E-SERVOO"
                    className="w-14 h-14 rounded-2xl bg-white/90 p-1 object-contain shadow-lg"
                  />

                  <div>
                    <h2 className="text-2xl font-black text-white">
                      E-SERVOO
                    </h2>

                    <p className="text-[#B4DBDC] text-xs font-bold mt-1">
                      Smart Local Services
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 text-white flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </div>

              {/* User mini card */}
              <div className="relative mt-6 bg-white/10 border border-white/15 rounded-2xl p-4">

                <p className="text-[#B4DBDC] text-[10px] font-black uppercase tracking-wider">
                  Welcome
                </p>

                <p className="text-white text-lg font-black mt-1 truncate">
                  {user?.name || "E-SERVOO User"}
                </p>

                <p className="text-white/70 text-xs font-semibold mt-1">
                  {user
                    ? "Your trusted local service partner"
                    : "Login to book a service"}
                </p>
              </div>
            </div>

            {/* MENU */}
            <div className="p-5">

              <p className="text-[#6FA8AA] text-xs font-black uppercase tracking-widest mb-3">
                Explore
              </p>

              <div className="space-y-2">

                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-white shadow-sm text-[#08566E] font-black active:scale-[0.98] transition"
                >
                  <span className="text-xl">🏠</span>
                  <span>Home</span>
                </Link>

                <Link
                  to="/services"
                  onClick={closeMenu}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-white shadow-sm text-[#08566E] font-black active:scale-[0.98] transition"
                >
                  <span className="text-xl">🛠️</span>
                  <span>All Services</span>
                </Link>

                <Link
                  to="/bookings"
                  onClick={closeMenu}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-white shadow-sm text-[#08566E] font-black active:scale-[0.98] transition"
                >
                  <span className="text-xl">📋</span>
                  <span>My Bookings</span>
                </Link>

                <Link
                  to={user ? "/profile" : "/"}
                  onClick={closeMenu}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-white shadow-sm text-[#08566E] font-black active:scale-[0.98] transition"
                >
                  <span className="text-xl">👤</span>
                  <span>{user ? "My Profile" : "Login"}</span>
                </Link>

              </div>

              {/* Quick Service */}
              <div className="mt-7">

                <p className="text-[#6FA8AA] text-xs font-black uppercase tracking-widest mb-3">
                  Quick Service
                </p>

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    navigateToServices();
                  }}
                  className="w-full rounded-2xl bg-[#08566E] text-[#E1E9E5] p-4 font-black shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition"
                >
                  <FaBolt />
                  Book a Service
                </button>

              </div>

              {/* Trust */}
              <div className="mt-7 bg-[#B4DBDC]/45 border border-[#9ECFD0] rounded-2xl p-4">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#08566E]">
                    ✓
                  </div>

                  <div>
                    <p className="text-[#08566E] font-black text-sm">
                      Verified Local Network
                    </p>

                    <p className="text-[#06485C] text-xs font-semibold mt-1">
                      Trusted workers • Smart matching • Local support
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </aside>
        </div>
      )}
    </>
  );
}

/* =========================================================
   NAVIGATION HELPER
========================================================= */

function navigateToServices() {
  window.location.href = "/services";
}

export default Navbar;