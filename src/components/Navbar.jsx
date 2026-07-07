import { Link } from "react-router-dom";
import { translations } from "../translations";

function Navbar({ language = "en" }) {
  const t = translations[language] || translations.en;

  return (
    <nav className="sticky top-0 z-50 bg-[#B4DBDC]/90 backdrop-blur-xl border-b border-[#08566E]/15 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center">

        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#08566E] p-1 shadow-lg overflow-hidden group-hover:scale-105 transition">
            <img
  src="/logo.png"
  alt="E-SERVOO Logo"
  className="w-full h-full object-cover rounded-xl"
/>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#08566E] leading-none">
              -SERVOO
            </h1>

            <p className="hidden sm:block text-xs font-extrabold text-[#0A6F78] tracking-wide mt-1">
              {t.smartLocalServices || "Smart Local Services"}
            </p>
          </div>
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;