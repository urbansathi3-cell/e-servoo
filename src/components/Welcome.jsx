import React from "react"

function Welcome({ setShowWelcome }) {

  return (

    <section className="bg-gradient-to-b from-[#E1E9E5] via-[#B4DBDC] to-[#A4D1D2] min-h-screen flex items-center justify-center px-5">

      <div className="text-center bg-[#E1E9E5]/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl">

  <img
    src="/logo.png"
    alt="e-servoo"
    className="w-56 mx-auto mb-10"
  />

  <h1 className="text-3xl md:text-7xl font-bold text-[#08566E] tracking-wider">
    E-SERVOO
  </h1>

  <p className="text-[#08566E] text-2xl mt-4 font-semibold">
    Welcomes You
  </p>

  <p className="text-slate-700 mt-4 text-lg">
    Trusted Professionals • Local Experts • All Services
  </p>

  <button
    onClick={() => setShowWelcome(false)}
    className="mt-10 bg-[#08566E] px-10 py-4 rounded-2xl text-white font-bold hover:bg-[#06485C] transition duration-300 shadow-xl"
  >
    Get Started
  </button>

</div>

    </section>

  )

}

export default Welcome