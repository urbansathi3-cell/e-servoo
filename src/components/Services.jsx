function Services() {

  const services = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "AC Repair",
    "Cook",
    "Cleaner"
  ]

  return (

    <section
      id="services"
      className="bg-black text-white py-24 px-5"
    >

      <h2 className="text-5xl font-bold text-center text-slate-200 mb-4">
        Our Services
      </h2>

      <p className="text-center text-zinc-400 mb-14">
        Trusted Professionals For Every Home Need
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {services.map((service, index) => (

          <div
            key={index}
            className="bg-[#111111] p-8 rounded-3xl border border-zinc-800 hover:border-blue-500 hover:-translate-y-2 transition duration-300"
          >

            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
              ⚡
            </div>

            <h3 className="text-2xl font-bold text-slate-200">
              {service}
            </h3>

            <p className="mt-4 text-zinc-400">
              Professional and verified {service.toLowerCase()} services available at your doorstep.
            </p>

          </div>

        ))}

      </div>

    </section>

  )

}

export default Services