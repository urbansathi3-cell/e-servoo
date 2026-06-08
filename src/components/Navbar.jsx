function Navbar() {

  return (

    <nav className="bg-black border-b border-blue-500/20 text-white px-8 py-5 flex justify-between items-center">

      <div className="flex items-center gap-3">

        <img
          src="/logo.png"
          alt="E-SERVOO"
          className="w-10 h-10"
        />

        <h1 className="text-2xl font-bold text-slate-200 tracking-wider">
          E-SERVOO
        </h1>

      </div>

      <div className="flex gap-8 text-slate-300">

        <a
          href="#"
          className="hover:text-blue-500 transition"
        >
          Home
        </a>

        <a
          href="#services"
          className="hover:text-blue-500 transition"
        >
          Services
        </a>

        <a
          href="#workers"
          className="hover:text-blue-500 transition"
        >
          Workers
        </a>

        <a
          href="#contact"
          className="hover:text-blue-500 transition"
        >
          Contact
        </a>

      </div>

    </nav>

  )

}

export default Navbar