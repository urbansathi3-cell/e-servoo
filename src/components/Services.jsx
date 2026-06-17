import React from "react"

function Services({ setSelectedService }) {

const services = [
{ name: "Electrician", icon: "⚡" },
{ name: "Plumber", icon: "🔧" },
{ name: "Carpenter", icon: "🔨" },
{ name: "Appliance Repair", icon: "🛠️" },
{ name: "Cook", icon: "👨‍🍳" },
{ name: "washer", icon: "🧹" }
]

return (

<section
  id="services"
  className="bg-black text-white py-20 px-5"
>

  <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-200 mb-4">
    Our Services
  </h2>

  <p className="text-center text-zinc-400 mb-10">
    Trusted Professionals For Every Home Need
  </p>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">

    {services.map((service, index) => (

      <div
        key={index}
        onClick={() => {
          setSelectedService(service.name)

          document
            .getElementById("workers")
            ?.scrollIntoView({
              behavior: "smooth"
            })
        }}
        className="bg-[#111111] p-5 rounded-2xl border border-zinc-800 hover:border-blue-500 hover:-translate-y-1 transition duration-300 cursor-pointer"
      >

        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 text-xl">
          {service.icon}
        </div>

        <h3 className="text-lg md:text-xl font-bold text-slate-200">
          {service.name}
        </h3>

      </div>

    ))}

  </div>

</section>

)

}

export default Services