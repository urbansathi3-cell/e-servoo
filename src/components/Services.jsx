import { useNavigate } from "react-router-dom";
import { translations } from "../translations";
import {
  FaArrowRight,
  FaBolt,
  FaCheckCircle,
  FaTools,
} from "react-icons/fa";

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
      desc:
        language === "hi"
          ? "Wiring, fan, switch और power issue"
          : language === "od"
            ? "Wiring, fan, switch ଏବଂ power issue"
            : "Wiring, fan, switch and power issue",
    },
    {
      name: t.plumber || "Plumber",
      value: "Plumber",
      icon: "🚿",
      desc:
        language === "hi"
          ? "Leakage, tap, pipe और bathroom issue"
          : language === "od"
            ? "Leakage, tap, pipe ଏବଂ bathroom issue"
            : "Leakage, tap, pipe and bathroom issue",
    },
    {
      name: t.carpenter || "Carpenter",
      value: "Carpenter",
      icon: "🔨",
      desc:
        language === "hi"
          ? "Furniture, door और repair work"
          : language === "od"
            ? "Furniture, door ଏବଂ repair work"
            : "Furniture, door and repair work",
    },
    {
      name: t.applianceRepair || "Appliance Repair",
      value: "Appliance Repair",
      icon: "🛠️",
      desc:
        language === "hi"
          ? "Home appliance service और repair"
          : language === "od"
            ? "Home appliance service ଏବଂ repair"
            : "Home appliance service and repair",
    },
    {
      name: t.cook || "Cook",
      value: "Cook",
      icon: "👨‍🍳",
      desc:
        language === "hi"
          ? "Daily cooking और home food help"
          : language === "od"
            ? "Daily cooking ଏବଂ home food help"
            : "Daily cooking and home food help",
    },
    {
      name: t.cleaner || "Cleaner",
      value: "Cleaner",
      icon: "🧹",
      desc:
        language === "hi"
          ? "Home cleaning और deep cleaning"
          : language === "od"
            ? "Home cleaning ଏବଂ deep cleaning"
            : "Home cleaning and deep cleaning",
    },
    {
      name: t.painter || "Painter",
      value: "Painter",
      icon: "🎨",
      desc:
        language === "hi"
          ? "Wall painting और finishing work"
          : language === "od"
            ? "Wall painting ଏବଂ finishing work"
            : "Wall painting and finishing work",
    },
    {
      name: t.acRepair || "AC Repair",
      value: "AC Repair",
      icon: "❄️",
      desc:
        language === "hi"
          ? "AC service, gas और cooling issue"
          : language === "od"
            ? "AC service, gas ଏବଂ cooling issue"
            : "AC service, gas and cooling issue",
    },
    {
      name: t.tutor || "Home Tutor",
      value: "Home Tutor",
      icon: "📚",
      desc:
        language === "hi"
          ? "Home tuition और study support"
          : language === "od"
            ? "Home tuition ଏବଂ study support"
            : "Home tuition and study support",
    },
  ];

  const pageText = {
    badge:
      language === "hi"
        ? "Trusted Local Services"
        : language === "od"
          ? "Trusted Local Services"
          : "Trusted Local Services",

    title:
      t.ourServices ||
      (language === "hi"
        ? "Choose a Service"
        : language === "od"
          ? "Service ବାଛନ୍ତୁ"
          : "Choose a Service"),

    subtitle:
      t.servicesSubtitle ||
      (language === "hi"
        ? "Verified local workers से service book करने के लिए category select करें।"
        : language === "od"
          ? "Verified local workers ଠାରୁ service book କରିବାକୁ category select କରନ୍ତୁ।"
          : "Select a category to book verified local workers near you."),

    cardNote:
      language === "hi"
        ? "Verified workers available"
        : language === "od"
          ? "Verified workers available"
          : "Verified workers available",

    viewWorkers:
      t.viewWorkers ||
      (language === "hi"
        ? "View Workers"
        : language === "od"
          ? "View Workers"
          : "View Workers"),

    helper:
      language === "hi"
        ? "Service choose करें और available workers देखें।"
        : language === "od"
          ? "Service choose କରନ୍ତୁ ଏବଂ available workers ଦେଖନ୍ତୁ।"
          : "Choose a service and view available workers.",
  };

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "services",
      ...extraData,
    });
  };

  const handleServiceClick = (serviceValue) => {
    setSelectedService(serviceValue);

    pushEvent("service_click", {
      service_name: serviceValue,
    });

    navigate("/services");
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-[#08566E] py-20 px-5"
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#08566E]/16 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#6FA8AA]/32 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 px-5 py-2 rounded-full shadow-lg text-[#08566E] font-black mb-5">
            <FaBolt />
            {pageText.badge}
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#08566E] leading-tight">
            {pageText.title}
          </h2>

          <p className="text-[#06485C] mt-3 font-semibold max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {pageText.subtitle}
          </p>
        </div>

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {services.map((service, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleServiceClick(service.value)}
              className="group text-left relative overflow-hidden bg-[#E1E9E5]/88 backdrop-blur-xl border border-white/90 rounded-[30px] p-6 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-[#08566E]"></div>

              <div className="flex items-start gap-5">
                <div className="w-16 h-16 shrink-0 bg-[#08566E] rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition duration-300">
                  {service.icon}
                </div>

                <div className="min-w-0">
                  <h3 className="text-2xl font-black text-[#08566E] leading-tight">
                    {service.name}
                  </h3>

                  <p className="text-[#06485C] font-semibold text-sm mt-2 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 bg-white/85 border border-[#B4DBDC] rounded-2xl p-3 flex items-center gap-2 text-[#08566E] font-bold text-sm">
                <FaCheckCircle className="text-green-600 shrink-0" />
                {pageText.cardNote}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="es-booking-cta inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-black">
                  <FaTools />
                  {pageText.viewWorkers}
                </span>

                <span className="w-11 h-11 shrink-0 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center font-black group-hover:translate-x-1 transition">
                  <FaArrowRight />
                </span>
              </div>
            </button>
          ))}

        </div>

        {/* BOTTOM HELP TEXT */}
        <div className="mt-10 text-center">
          <p className="inline-flex items-center gap-2 bg-[#E1E9E5]/85 border border-white/80 rounded-full px-5 py-3 text-[#06485C] font-bold shadow-lg">
            <FaCheckCircle className="text-green-600" />
            {pageText.helper}
          </p>
        </div>

      </div>
    </section>
  );
}

export default Services;