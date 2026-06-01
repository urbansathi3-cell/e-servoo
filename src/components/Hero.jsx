function Hero() {
  return (
    <section className="bg-black text-white h-screen flex flex-col items-center justify-center text-center px-5">

      <h1 className="text-6xl font-bold text-orange-500">
        Urban Sathi
      </h1>

      <p className="mt-6 text-xl max-w-2xl">
        Trusted Local Services At Your Doorstep
      </p>

      <div className="flex gap-4 mt-8">

        <a
          href="#workers"
          className="bg-orange-500 px-6 py-3 rounded-xl text-white hover:bg-orange-600 transition"
        >
          Book Now
        </a>

       <a
    href="#services"
    className="border-2 border-orange-500 px-6 py-3 rounded-xl text-orange-500 hover:bg-orange-500 hover:text-white transition"
  >
          Explore Services
        </a>

      </div>

    </section>
  )
}

export default Hero