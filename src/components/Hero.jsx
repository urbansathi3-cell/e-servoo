import { useNavigate } from "react-router-dom";
import { translations } from "../translations";
import {
  FaBolt,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaStar,
  FaTools,
  FaUserCheck,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

function Hero({ language = "en" }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const text = {
    badge:
      t.heroBadge ||
      (language === "hi"
        ? "Smart Local Services Hub"
        : language === "od"
          ? "Smart Local Services Hub"
          : "Smart Local Services Hub"),

    title:
      language === "hi"
        ? "E-SERVOO Services Near You"
        : language === "od"
          ? "E-SERVOO Services Near You"
          : "E-SERVOO Services Near You",

    subtitle:
      language === "hi"
        ? "Verified electricians, plumbers, cleaners, cooks और trusted local workers को आसानी से book करें।"
        : language === "od"
          ? "Verified electricians, plumbers, cleaners, cooks ଏବଂ trusted local workers କୁ ସହଜରେ book କରନ୍ତୁ।"
          : "Book verified electricians, plumbers, cleaners, cooks and trusted local workers near you.",

    description:
      language === "hi"
        ? "Fast booking, verified workers, transparent service flow और hyperlocal support — सब एक ही platform पर।"
        : language === "od"
          ? "Fast booking, verified workers, transparent service flow ଏବଂ hyperlocal support — ସବୁ ଗୋଟିଏ platform ରେ।"
          : "Fast booking, verified workers, transparent service flow and hyperlocal support — all in one platform.",

    primaryCta:
      language === "hi"
        ? "Book a Service Now"
        : language === "od"
          ? "Book a Service Now"
          : "Book a Service Now",

    secondaryCta:
      language === "hi"
        ? "View Services"
        : language === "od"
          ? "View Services"
          : "View Services",

    verifiedWorkers: t.verifiedWorkers || "Verified Workers",
    hyperlocal: t.hyperlocal || "Hyperlocal",
    trustedService: t.trustedService || "Trusted Service",
    workers: t.workers || "Workers",
    services: t.services || "Services",
    support: t.support || "Support",
    verifiedExpert: t.verifiedExpert || "Verified Expert",
    assignedInstantly: t.assignedInstantly || "Ready to serve",
    trustedByUsers: t.trustedByUsers || "Trusted by local users",
    liveBooking: t.liveBooking || "Live Booking Preview",
    electrician: t.electrician || "Electrician",
    issue: t.issue || "Issue",
    serviceLocation: t.serviceLocation || "Service Location",
    nearCustomerAddress: t.nearCustomerAddress || "Near customer address",
    trustScore: t.trustScore || "Trust Score",
    status: t.status || "Status",
    active: t.active || "Active",
    smartMatchFound: t.smartMatchFound || "Smart Match Found",
  };

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "hero",
      ...extraData,
    });
  };

  const handleBookNow = () => {
    pushEvent("hero_cta_click", {
      cta_name: "book_a_service_now",
    });

    navigate("/services");
  };

  const handleViewServices = () => {
    pushEvent("hero_cta_click", {
      cta_name: "view_services",
    });

    const servicesSection = document.getElementById("services");

    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] min-h-[82vh] flex items-center px-5 pt-16 pb-16">

      {/* BACKGROUND BLOBS */}
      <div className="absolute top-20 left-[-80px] w-72 h-72 bg-[#08566E]/16 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-[-90px] w-80 h-80 bg-[#6FA8AA]/35 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/30 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">

        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">

          <div className="inline-flex items-center gap-2 bg-[#E1E9E5]/85 backdrop-blur-xl border border-white/80 px-5 py-2 rounded-full shadow-lg text-[#08566E] font-extrabold mb-6">
            <FaBolt className="text-[#08566E]" />
            {text.badge}
          </div>

          <h1 className="es-hero-title text-5xl md:text-7xl font-black text-[#08566E] leading-[1.05]">
            {text.title}
          </h1>

          <p className="es-hero-subtitle mt-6 text-xl md:text-2xl text-[#06485C] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {text.subtitle}
          </p>

          <p className="mt-5 text-base md:text-lg text-[#08566E]/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-semibold">
            {text.description}
          </p>

          {/* TRUST POINTS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-7">
            <div className="bg-[#E1E9E5]/88 backdrop-blur-xl border border-white/80 px-4 py-2 rounded-full text-[#08566E] font-bold flex items-center gap-2 shadow-md">
              <FaShieldAlt />
              {text.verifiedWorkers}
            </div>

            <div className="bg-[#E1E9E5]/88 backdrop-blur-xl border border-white/80 px-4 py-2 rounded-full text-[#08566E] font-bold flex items-center gap-2 shadow-md">
              <FaMapMarkerAlt />
              {text.hyperlocal}
            </div>

            <div className="bg-[#E1E9E5]/88 backdrop-blur-xl border border-white/80 px-4 py-2 rounded-full text-[#08566E] font-bold flex items-center gap-2 shadow-md">
              <FaStar />
              {text.trustedService}
            </div>
          </div>

          {/* CLEAR CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-10">

            <button
              type="button"
              onClick={handleBookNow}
              className="es-primary-cta inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-black transition"
            >
              <FaBolt />
              {text.primaryCta}
              <FaArrowRight />
            </button>

            <button
              type="button"
              onClick={handleViewServices}
              className="es-secondary-cta inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-black transition"
            >
              <FaTools />
              {text.secondaryCta}
            </button>

          </div>

          {/* MINI STATS */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl mx-auto lg:mx-0">
            <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">
                40+
              </h3>
              <p className="text-sm font-bold text-[#08566E]/80">
                {text.workers}
              </p>
            </div>

            <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">
                12+
              </h3>
              <p className="text-sm font-bold text-[#08566E]/80">
                {text.services}
              </p>
            </div>

            <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">
                24/7
              </h3>
              <p className="text-sm font-bold text-[#08566E]/80">
                {text.support}
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT VISUAL CARD */}
        <div className="relative hidden lg:block">

          <div className="absolute -top-8 -left-8 bg-[#E1E9E5]/92 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-2xl animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#08566E] rounded-2xl flex items-center justify-center text-[#E1E9E5]">
                <FaUserCheck />
              </div>

              <div>
                <p className="text-[#08566E] font-black">
                  {text.verifiedExpert}
                </p>
                <p className="text-[#08566E]/75 text-sm font-bold">
                  {text.assignedInstantly}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 -right-5 bg-[#08566E] rounded-3xl p-5 shadow-2xl text-[#E1E9E5] z-20">
            <p className="font-black text-xl text-[#E1E9E5]">
              ⭐ 4.9 Rating
            </p>
            <p className="text-[#B4DBDC] text-sm font-semibold">
              {text.trustedByUsers}
            </p>
          </div>

          <div className="bg-[#E1E9E5]/70 backdrop-blur-2xl border border-white/80 rounded-[40px] shadow-2xl p-8">

            <div className="bg-[#08566E] rounded-[32px] p-7 shadow-xl">

              <div className="flex items-center justify-between mb-7">
                <div>
                  <p className="text-[#B4DBDC] font-bold text-sm">
                    {text.liveBooking}
                  </p>

                  <h2 className="text-3xl font-black text-[#E1E9E5]">
                    {text.electrician}
                  </h2>
                </div>

                <div className="w-16 h-16 bg-[#E1E9E5] rounded-2xl flex items-center justify-center text-[#08566E] text-3xl">
                  <FaTools />
                </div>
              </div>

              <div className="space-y-4">

                <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                  <p className="text-[#6FA8AA] text-sm font-bold">
                    {text.issue}
                  </p>
                  <p className="text-[#08566E] font-extrabold">
                    Fan not working
                  </p>
                </div>

                <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                  <p className="text-[#6FA8AA] text-sm font-bold">
                    {text.serviceLocation}
                  </p>
                  <p className="text-[#08566E] font-extrabold">
                    {text.nearCustomerAddress}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#9ECFD0] rounded-2xl p-4 text-center">
                    <p className="text-[#08566E] text-sm font-bold">
                      {text.trustScore}
                    </p>
                    <p className="text-[#08566E] text-2xl font-black">
                      96%
                    </p>
                  </div>

                  <div className="bg-[#9ECFD0] rounded-2xl p-4 text-center">
                    <p className="text-[#08566E] text-sm font-bold">
                      {text.status}
                    </p>
                    <p className="text-[#08566E] text-2xl font-black">
                      {text.active}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-[#E1E9E5] text-[#08566E] py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
                  <FaCheckCircle />
                  {text.smartMatchFound}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;