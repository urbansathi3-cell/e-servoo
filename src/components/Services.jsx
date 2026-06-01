function Services() {

  const services = [
    "Electrician",
    "Plumbing",
    "Cleaning",
    "AC Repair",
    "Delivery"
  ]

  return (
    <section
  id="services"
  className="bg-zinc-900 text-white py-20 px-10"
>

      <h2 className="text-4xl font-bold text-center text-orange-500 mb-12">
        Our Services
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {services.map((service, index) => (
          <div
            key={index}
            className="bg-black p-8 rounded-2xl border border-zinc-700 hover:border-orange-500 transition"
          >
            <h3 className="text-2xl font-bold">
              {service}
            </h3>

            <p className="mt-4 text-zinc-400">
              Professional {service} service available.
            </p>
          </div>
        ))}

      </div>

    </section>
  )
}

export default Services