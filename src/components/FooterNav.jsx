import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaClipboardList,
  FaUser,
  FaSignInAlt,
} from "react-icons/fa";
import { getStoredUser } from "../utils/storage";

function FooterNav() {
  const location = useLocation();
  const itemRefs = useRef([]);

  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getStoredUser()));

  const [pillStyle, setPillStyle] = useState({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(Boolean(getStoredUser()));
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);
    window.addEventListener("focus", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("focus", checkLogin);
    };
  }, []);

  const navItems = useMemo(
    () => [
      {
        label: "Home",
        path: "/",
        icon: <FaHome />,
      },
      {
        label: "Services",
        path: "/services",
        icon: <FaTools />,
      },
      {
        label: "Bookings",
        path: "/bookings",
        icon: <FaClipboardList />,
      },
      {
        label: isLoggedIn ? "Profile" : "Login",
        path: isLoggedIn ? "/profile" : "/",
        icon: isLoggedIn ? <FaUser /> : <FaSignInAlt />,
        needsLoginOpen: !isLoggedIn,
      },
    ],
    [isLoggedIn]
  );

  useEffect(() => {
    const updatePill = () => {
      const activeIndex = navItems.findIndex((item) => {
        if (!isLoggedIn && item.label === "Login") {
          return false;
        }

        if (item.path === "/") {
          return location.pathname === "/";
        }

        return location.pathname.startsWith(item.path);
      });

      const index = activeIndex === -1 ? 0 : activeIndex;
      const activeItem = itemRefs.current[index];

      if (!activeItem) return;

      setPillStyle({
        left: activeItem.offsetLeft,
        width: activeItem.offsetWidth,
      });
    };

    const timer = setTimeout(updatePill, 80);

    window.addEventListener("resize", updatePill);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePill);
    };
  }, [location.pathname, navItems, isLoggedIn]);

  const handleNavClick = (item) => {
    if (item.needsLoginOpen) {
      localStorage.setItem("openCustomerLogin", "true");

      window.dispatchEvent(
        new CustomEvent("open-customer-login")
      );
    }
  };

  return (
    <div className="fixed left-0 right-0 bottom-4 z-[90] px-4 pointer-events-none">
      <div className="relative mx-auto w-full max-w-[430px] pointer-events-auto">
        <div className="absolute -left-8 bottom-0 w-32 h-20 bg-[#B4DBDC] rounded-full blur-3xl opacity-80"></div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-56 h-20 bg-white rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -right-8 bottom-0 w-32 h-20 bg-[#6FA8AA] rounded-full blur-3xl opacity-70"></div>

        <nav className="relative overflow-hidden rounded-full border border-white/70 bg-white/30 backdrop-blur-[28px] shadow-[0_18px_55px_rgba(8,86,110,0.28)] px-2 py-2">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/55 via-[#E1E9E5]/40 to-[#B4DBDC]/45"></div>

          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-0 left-4 w-28 h-16 rounded-full bg-white/70 blur-2xl"></div>
            <div className="absolute bottom-0 right-6 w-32 h-16 rounded-full bg-[#9ECFD0]/70 blur-2xl"></div>
          </div>

          <div
            className="absolute top-2 bottom-2 rounded-full bg-white/85 border border-white/80 shadow-[0_8px_24px_rgba(8,86,110,0.22)] transition-all duration-500 ease-out"
            style={{
              left: `${pillStyle.left}px`,
              width: `${pillStyle.width}px`,
            }}
          ></div>

          <div className="relative z-10 flex items-center justify-between gap-1">
            {navItems.map((item, index) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/" && item.label !== "Login"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={`${item.label}-${item.path}`}
                  to={item.path}
                  onClick={() => handleNavClick(item)}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative flex-1 min-w-0"
                >
                  <div
                    className={`relative flex items-center justify-center gap-2 px-3 py-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? "text-[#08566E] scale-[1.04]"
                        : item.label === "Login"
                          ? "text-[#08566E] hover:text-[#08566E] hover:bg-white/35"
                          : "text-[#08566E]/65 hover:text-[#08566E] hover:bg-white/25"
                    }`}
                  >
                    <span className="text-[16px] sm:text-[17px]">
                      {item.icon}
                    </span>

                    <span
                      className={`font-black leading-none transition-all duration-300 ${
                        isActive || item.label === "Login"
                          ? "text-[12px] max-w-[70px] opacity-100"
                          : "text-[0px] sm:text-[11px] sm:max-w-[60px] max-w-0 opacity-0 sm:opacity-80"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default FooterNav;