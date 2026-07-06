import { useNavigate } from "react-router-dom";
import { translations } from "../translations";

function Services({
  setSelectedService,
  language = "en",
}) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const services = [
    {
      name: t.electrician || "Electrician",
      value: "Electrician",
      icon: "⚡",
      desc: "Wiring, fan, switch, power issue",
    },
    {
      name: t.plumber || "Plumber",
      value: "Plumber",
      icon: "🚿",
      desc: "Leakage, tap, pipe, bathroom issue",
    },
    {
      name: t.carpenter || "Carpenter",
      value: "Carpenter",
      icon: "🔨",
      desc: "Furniture, door, repair work",
    },
    {
      name: t.applianceRepair || "Appliance Repair",
      value: "Appliance Repair",
      icon: "🛠️",
      desc: "Home appliance service & repair",
    },
    {
      name: t.cook || "Cook",
      value: "Cook",
      icon: "👨‍🍳",
      desc: "Daily cooking and home food help",
    },
    {
      name: t.cleaner || "Cleaner",
      value: "Cleaner",
      icon: "🧹",
      desc: "Home cleaning and deep cleaning",
    },
    {
      name: t.painter || "Painter",
      value: "Painter",
      icon: "🎨",
      desc: "Wall painting and finishing",
    },
    {
      name: t.acRepair || "AC Repair",
      value: "AC Repair",
      icon: "❄️",
      desc: "AC service, gas, cooling issue",
    },
    {
      name: t.tutor || "Home Tutor",
      value: "Home Tutor",
      icon: "📚",
      desc: "Home tuition and study support",
    },
  ];

  const handleServiceClick = (serviceValue) => {
    setSelectedService(serviceValue);
    navigate("/services");
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-slate-900 py-20 px-5"
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#08566E]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#6FA8AA]/35 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2 rounded-full shadow-lg text-[#08566E] font-extrabold mb-5">
            ⚡ {t.services || "Services"}
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#08566E]">
            {t.ourServices || "Our Services"}
          </h2>

          <p className="text-[#08566E]/75 mt-3 font-semibold max-w-2xl mx-auto">
            {t.servicesSubtitle || "Trusted professionals for every home need."}
          </p>
        </div>

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {services.map((service, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleServiceClick(service.value)}
              className="group text-left relative overflow-hidden bg-white/35 backdrop-blur-xl border border-white/60 rounded-[30px] p-6 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-[#08566E]"></div>

              <div className="flex items-start gap-5">
                <div className="w-16 h-16 shrink-0 bg-[#08566E] rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition duration-300">
                  {service.icon}
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#08566E]">
                    {service.name}
                  </h3>

                  <p className="text-[#08566E]/70 font-semibold text-sm mt-2">
                    {service.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-[#08566E] font-extrabold">
                  {t.viewWorkers || "View Workers"}
                </span>

                <span className="w-10 h-10 rounded-full bg-[#08566E] text-[#E1E9E5] flex items-center justify-center font-black group-hover:translate-x-1 transition">
                  →
                </span>
              </div>
            </button>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Services;