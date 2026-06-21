function Navbar() {
  return (
    <nav className="bg-black border-b border-blue-500/20 px-4 py-3">

      <div className="flex justify-center">

        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            className="h-3p w-30"
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