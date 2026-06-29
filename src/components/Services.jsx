import React from "react"

function Services({ setSelectedService }) {

const services = [
{ name: "Electrician", icon: "⚡" },
{ name: "Plumbers", icon: "🔧" },
{ name: "Carpenter", icon: "🔨" },
{ name: "Appliance Repair", icon: "🛠️" },
{ name: "Cook", icon: "👨‍🍳" },
{ name: "washer", icon: "🧹" }
]

return (

<section
  id="services"
  className="bg-[#A4D1D2] text-slate-900 py-20 px-5"
>

  <h2 className="text-4xl md:text-5xl font-bold text-center text-[#08566E] mb-4">
    Our Services
  </h2>

  <p className="text-center text-[#4B6B73] mb-10">
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
        className="bg-[#6FA8AE] p-5 rounded-2xl shadow-lg border border-[#5B979E] hover:bg-[#5E9AA1] hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
      >

        <div className="w-12 h-12 bg-[#06495C] rounded-xl flex items-center justify-center mb-4 text-xl">
          {service.icon}
        </div>

        <h3 className="text-lg md:text-xl font-bold text-[#E1E9E5]">
          {service.name}
        </h3>

      </div>

    ))}

  </div>

</section>

)

}

export default Services