import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaBolt,
  FaEllipsisV,
  FaGlobe,
  FaUniversalAccess,
} from "react-icons/fa";
import { getStoredUser } from "../utils/storage";

function Navbar() {
  const location = useLocation();

  const [user, setUser] = useState(() => getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  // === LANGUAGE ===
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  // === SENIOR MODE ===
  const [seniorMode, setSeniorMode] = useState(
    () => localStorage.getItem("seniorMode") === "true"
  );

  // === USER REFRESH ===
  useEffect(() => {
    const refreshUser = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", refreshUser);
    window.addEventListener("user-updated", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("user-updated", refreshUser);
    };
  }, []);

  const isHome = location.pathname === "/";

  const getUserName = () => {
    if (!user) return "Guest";

    return (
      user.name ||
      user.fullName ||
      user.username ||
      "User"
    );
  };

  const userName = getUserName();

  // === LANGUAGE CHANGE ===
  const handleLanguageChange = (lang) => {
    setLanguage(lang);

    localStorage.setItem("language", lang);

    window.dispatchEvent(
      new CustomEvent("language-changed", {
        detail: lang,
      })
    );
  };

  // === SENIOR MODE ===
  const handleSeniorMode = () => {
    const newValue = !seniorMode;

    setSeniorMode(newValue);

    localStorage.setItem("seniorMode", String(newValue));

    window.dispatchEvent(
      new CustomEvent("senior-mode-changed", {
        detail: newValue,
      })
    );
  };

  return (
    <>
      {/* === NAVBAR === */}
      <nav className="sticky top-0 z-50 px-3 pt-3">
        <div
          className="
            max-w-6xl mx-auto
            bg-[#E1E9E5]/95
            backdrop-blur-xl
            border-2 border-[#08566E]
            rounded-[24px]
            shadow-[0_4px_18px_rgba(8,86,110,0.12)]
            relative
          "
        >
          <div className="h-[68px] px-3 sm:px-5 flex items-center justify-between">

            {/* === LEFT === */}
            <div className="flex items-center gap-2">

              {!isHome && (
                <button
                  onClick={() => window.history.back()}
                  className="
                    w-10 h-10
                    rounded-full
                    bg-white
                    border border-[#6FA8AA]/40
                    text-[#08566E]
                    flex items-center justify-center
                    active:scale-95
                    transition
                  "
                  aria-label="Go back"
                >
                  <FaArrowLeft size={14} />
                </button>
              )}

              {/* LOGO */}
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => {
                  setMenuOpen(false);
                  setControlsOpen(false);
                }}
              >
                <div
                  className="
                    w-10 h-10
                    rounded-full
                    bg-[#08566E]
                    flex items-center justify-center
                    overflow-hidden
                    shadow-sm
                  "
                >
                  <img
                    src="/logo.png"
                    alt="E-SERVOO"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="leading-none">
                  <div className="text-[20px] sm:text-[23px] font-black tracking-tight text-[#08566E]">
                    E-SERVOO
                  </div>

                  <div className="text-[7px] sm:text-[8px] font-bold tracking-[0.16em] text-[#6FA8AA] uppercase">
                    Smart Local Services
                  </div>
                </div>
              </Link>
            </div>

            {/* === RIGHT === */}
            <div className="flex items-center gap-2">

              {/* VERIFIED */}
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-[#08566E] text-white flex items-center justify-center">
                  <FaBolt size={11} />
                </div>

                <div className="leading-none">
                  <p className="text-[7px] font-black text-[#08566E] uppercase">
                    Verified
                  </p>

                  <p className="text-[6px] text-[#6FA8AA] font-bold">
                    Professionals
                  </p>
                </div>
              </div>

              {/* NOTIFICATION */}
              <button
                className="
                  hidden sm:flex
                  w-10 h-10
                  rounded-full
                  bg-white
                  border border-[#6FA8AA]/40
                  items-center justify-center
                  text-[#08566E]
                  relative
                  active:scale-95
                  transition
                "
                aria-label="Notifications"
              >
                <FaBell size={14} />

                <span
                  className="
                    absolute
                    top-1
                    right-1
                    w-2 h-2
                    rounded-full
                    bg-[#08566E]
                    border-2 border-white
                  "
                />
              </button>

              {/* === 3 DOT CONTROLS === */}
              <div className="relative">
                <button
                  onClick={() =>
                    setControlsOpen((prev) => !prev)
                  }
                  className="
                    w-10 h-10
                    rounded-full
                    bg-white
                    border border-[#6FA8AA]/40
                    text-[#08566E]
                    flex items-center justify-center
                    active:scale-95
                    transition
                  "
                  aria-label="Quick Controls"
                  aria-expanded={controlsOpen}
                >
                  <FaEllipsisV size={16} />
                </button>

                {/* === CONTROLS DROPDOWN === */}
                {controlsOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-12
                      w-[245px]
                      bg-[#E1E9E5]
                      border-2 border-[#08566E]
                      rounded-[20px]
                      shadow-[0_10px_30px_rgba(8,86,110,0.20)]
                      p-3
                      z-[100]
                    "
                  >
                    {/* TITLE */}
                    <div className="px-2 pb-2">
                      <p className="text-[10px] font-black text-[#08566E] uppercase tracking-wide">
                        Quick Controls
                      </p>

                      <p className="text-[8px] text-[#6FA8AA] font-semibold">
                        Language & accessibility
                      </p>
                    </div>

                    {/* LANGUAGE */}
                    <div
                      className="
                        bg-white
                        rounded-[14px]
                        border border-[#6FA8AA]/30
                        p-2
                        mb-2
                      "
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="
                            w-7 h-7
                            rounded-full
                            bg-[#08566E]
                            text-white
                            flex items-center justify-center
                          "
                        >
                          <FaGlobe size={11} />
                        </div>

                        <div>
                          <p className="text-[9px] font-black text-[#08566E]">
                            Language
                          </p>

                          <p className="text-[7px] text-[#6FA8AA]">
                            Choose language
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: "en", label: "EN" },
                          { id: "hi", label: "HI" },
                          { id: "od", label: "OD" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() =>
                              handleLanguageChange(item.id)
                            }
                            className={`
                              h-8
                              rounded-lg
                              text-[9px]
                              font-black
                              transition
                              ${
                                language === item.id
                                  ? "bg-[#08566E] text-white"
                                  : "bg-[#E1E9E5] text-[#08566E] hover:bg-[#B4DBDC]"
                              }
                            `}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SENIOR MODE */}
                    <div
                      className="
                        bg-white
                        rounded-[14px]
                        border border-[#6FA8AA]/30
                        p-2
                      "
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="
                              w-7 h-7
                              rounded-full
                              bg-[#08566E]
                              text-white
                              flex items-center justify-center
                            "
                          >
                            <FaUniversalAccess size={13} />
                          </div>

                          <div>
                            <p className="text-[9px] font-black text-[#08566E]">
                              Senior Mode
                            </p>

                            <p className="text-[7px] text-[#6FA8AA]">
                              Larger & simpler interface
                            </p>
                          </div>
                        </div>

                        {/* TOGGLE */}
                        <button
                          onClick={handleSeniorMode}
                          className={`
                            relative
                            w-11
                            h-6
                            rounded-full
                            transition
                            ${
                              seniorMode
                                ? "bg-[#08566E]"
                                : "bg-[#B4DBDC]"
                            }
                          `}
                          aria-label="Toggle Senior Mode"
                          aria-pressed={seniorMode}
                        >
                          <span
                            className={`
                              absolute
                              top-[3px]
                              w-5
                              h-5
                              rounded-full
                              bg-white
                              shadow-sm
                              transition-all
                              ${
                                seniorMode
                                  ? "left-[22px]"
                                  : "left-[3px]"
                              }
                            `}
                          />
                        </button>
                      </div>

                      <div className="mt-2 text-right">
                        <span
                          className={`
                            text-[7px]
                            font-black
                            uppercase
                            ${
                              seniorMode
                                ? "text-[#08566E]"
                                : "text-[#6FA8AA]"
                            }
                          `}
                        >
                          {seniorMode ? "ON" : "OFF"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* === MOBILE MENU === */}
              <button
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                  setControlsOpen(false);
                }}
                className="
                  sm:hidden
                  w-10 h-10
                  rounded-full
                  bg-white
                  border border-[#6FA8AA]/40
                  text-[#08566E]
                  flex items-center justify-center
                  active:scale-95
                  transition
                "
                aria-label="Menu"
              >
                {menuOpen ? (
                  <FaTimes size={16} />
                ) : (
                  <FaBars size={16} />
                )}
              </button>
            </div>
          </div>

          {/* === MOBILE MENU === */}
          {menuOpen && (
            <div className="sm:hidden px-3 pb-3">
              <div className="bg-white rounded-[18px] border border-[#6FA8AA]/30 p-3 space-y-2">

                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-3 py-3
                    rounded-xl
                    text-sm font-bold
                    text-[#08566E]
                    hover:bg-[#B4DBDC]/40
                  "
                >
                  <FaBolt size={13} />
                  Home
                </Link>

                <Link
                  to="/services"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-3 py-3
                    rounded-xl
                    text-sm font-bold
                    text-[#08566E]
                    hover:bg-[#B4DBDC]/40
                  "
                >
                  <FaBolt size={13} />
                  Services
                </Link>

                <Link
                  to={user ? "/bookings" : "/login"}
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-3 py-3
                    rounded-xl
                    text-sm font-bold
                    text-[#08566E]
                    hover:bg-[#B4DBDC]/40
                  "
                >
                  <FaBell size={13} />
                  My Bookings
                </Link>

                <Link
                  to={user ? "/profile" : "/login"}
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-3 py-3
                    rounded-xl
                    text-sm font-bold
                    text-[#08566E]
                    hover:bg-[#B4DBDC]/40
                  "
                >
                  <FaUserCircle size={14} />
                  {user ? userName : "Login"}
                </Link>

              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;