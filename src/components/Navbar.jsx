function Navbar() {
  return (
    <nav className="bg-black border-b border-blue-500/20 px-4 py-3">

      <div className="flex items-center justify-center">

        <div className="flex items-center gap-3">

          <img
            src="/logo.png"
            alt="logo"
            className="h-30 w-30 object-contain"
          />

          <h1 className="text-4xl font-bold text-white">
            E-SERVOO
          </h1>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;