function Navbar({
  language,
  changeLanguage
}) {
  return (
    <nav className="bg-black border-b border-blue-500/20 px-4 py-3">
     
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            className="h-30 w-30"
          />

          <h1 className="text-4xl font-bold text-white">
            E-SERVOO
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => changeLanguage("en")}
            className={`px-3 py-1 rounded ${
              language === "en"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => changeLanguage("hi")}
            className={`px-3 py-1 rounded ${
              language === "hi"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            HI
          </button>

          <button
            onClick={() => changeLanguage("od")}
            className={`px-3 py-1 rounded ${
              language === "od"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            OD
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;