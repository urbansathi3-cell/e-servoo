function Hero() {
  return (

    <section className="bg-gradient-to-b from-black to-zinc-950 text-white min-h-[85vh] flex flex-col items-center justify-center text-center px-5 pt-0">

      <img
        src="/logo.png"
        alt="E-SERVOO"
        className="w-32 mb-4"
      />

      <h1 className="text-5xl md:text-7xl font-bold text-slate-200">
        E-SERVOO
      </h1>

      <p className="mt-6 text-2xl text-blue-500 font-semibold">
        Smart Local Services Platform
      </p>

      <p className="mt-6 text-lg text-zinc-400 max-w-3xl">
        Book trusted electricians, plumbers, carpenters, cooks,
        cleaners and other local professionals in just a few clicks.
      </p>

      <div className="flex flex-wrap gap-4 mt-10 justify-center">

        <a
          href="#workers"
          className="bg-blue-600 px-8 py-4 rounded-2xl text-white font-bold hover:bg-blue-700 transition"
        >
          Book a Professional
        </a>

        <a
          href="#services"
          className="border-2 border-blue-500 px-8 py-4 rounded-2xl text-blue-500 font-bold hover:bg-blue-500 hover:text-white transition"
        >
          Explore Services
        </a>

      </div>

    </section>

  )
}

export default Hero