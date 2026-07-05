import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";

function FooterNav() {
  const location = useLocation();
  const itemRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    width: 0,
  });

  const navItems = [
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
      label: "Profile",
      path: "/profile",
      icon: <FaUser />,
    },
  ];

  useEffect(() => {
    const activeIndex = navItems.findIndex(
      (item) => item.path === location.pathname
    );

    const index = activeIndex === -1 ? 0 : activeIndex;
    const activeItem = itemRefs.current[index];

    if (activeItem) {
      setPillStyle({
        left: activeItem.offsetLeft,
        width: activeItem.offsetWidth,
      });
    }
  }, [location.pathname]);

  return (
    <div className="es-footer-wrapper">
      <div className="es-footer-blob es-footer-blob-1"></div>
      <div className="es-footer-blob es-footer-blob-2"></div>

      <nav className="es-liquid-footer">
        <div
          className="es-footer-active-pill"
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
          }}
        ></div>

        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`es-footer-item ${
                isActive ? "es-footer-item-active" : ""
              }`}
            >
              <span className="es-footer-icon">
                {item.icon}
              </span>

              <span className="es-footer-label">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default FooterNav;