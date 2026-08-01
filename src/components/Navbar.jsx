import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-[#B4DBDC]/95 backdrop-blur-md border-b border-[#6FA8AA]/40 px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-center">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="Go to E-SERVOO home"
        >
          <img
            src="/logo.png"
            alt="E-SERVOO logo"
            className="h-12 w-12 rounded-2xl object-contain shadow-md group-hover:scale-105 transition"
          />

          <h1 className="text-3xl sm:text-4xl font-black text-[#08566E] tracking-tight">
            E-SERVOO
          </h1>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;