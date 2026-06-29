import React from "react"

function Welcome({ setShowWelcome }) {

  return (

    <section className="bg-gradient-to-b from-black to-zinc-950 min-h-screen flex items-center justify-center px-5">

      <div className="text-center">

  <img
    src="/logo.png"
    alt="e-servoo"
    className="w-56 mx-auto mb-10"
  />

  <h1 className="text-6xl md:text-7xl font-bold text-slate-200 tracking-wider">
    E-SERVOO
  </h1>

  <p className="text-blue-500 text-2xl mt-4 font-semibold">
    Welcomes You
  </p>

  <p className="text-zinc-400 mt-4 text-lg">
    Trusted Professionals • Local Experts • All Services
  </p>

  <button
    onClick={() => setShowWelcome(false)}
    className="mt-10 bg-[#08566E] px-10 py-4 rounded-2xl text-slate-900 font-bold hover:bg-blue-700 transition duration-300"
  >
    Get Started
  </button>

</div>

    </section>

  )

}

export default Welcome