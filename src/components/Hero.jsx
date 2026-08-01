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
  FaClock,
  FaRupeeSign,
  FaHeadset,
  FaRoute,
  FaFire,
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
      <div className="absolute top-20 left-[-80px] w-72 h-72 bg-[#08566E]/16 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-[-90px] w-80 h-80 bg-[#6FA8AA]/35 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/30 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
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

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl mx-auto lg:mx-0">
            <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">40+</h3>
              <p className="text-sm font-bold text-[#08566E]/80">
                {text.workers}
              </p>
            </div>

            <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">12+</h3>
              <p className="text-sm font-bold text-[#08566E]/80">
                {text.services}
              </p>
            </div>

            <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">24/7</h3>
              <p className="text-sm font-bold text-[#08566E]/80">
                {text.support}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL CARD - PREMIUM REDESIGN */}
        <div className="relative hidden lg:block">
          <div className="absolute -top-10 left-8 w-32 h-32 bg-white/70 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -right-10 w-52 h-52 bg-[#08566E]/25 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-10 w-44 h-44 bg-[#6FA8AA]/35 rounded-full blur-3xl"></div>

          <div className="absolute -top-7 -left-5 z-30 bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[28px] p-4 shadow-[0_18px_50px_rgba(8,86,110,0.25)] animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#08566E] to-[#6FA8AA] rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FaUserCheck />
              </div>

              <div>
                <p className="text-[#08566E] font-black leading-none">
                  {text.verifiedExpert}
                </p>
                <p className="text-[#06485C] text-xs font-bold mt-1">
                  {text.assignedInstantly}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 right-3 z-30 bg-[#08566E] rounded-[28px] p-5 shadow-[0_18px_55px_rgba(8,86,110,0.35)] text-[#E1E9E5]">
            <p className="font-black text-xl text-[#E1E9E5]">
              ⭐ 4.9 Rating
            </p>
            <p className="text-[#B4DBDC] text-sm font-semibold">
              {text.trustedByUsers}
            </p>
          </div>

          <div className="absolute top-24 -right-7 z-30 bg-white/90 backdrop-blur-2xl border border-white rounded-[26px] p-4 shadow-[0_18px_50px_rgba(8,86,110,0.22)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-orange-500 text-white rounded-2xl flex items-center justify-center">
                <FaFire />
              </div>

              <div>
                <p className="text-[#08566E] font-black text-sm">
                  Urgent Ready
                </p>
                <p className="text-[#06485C] text-xs font-bold">
                  15 min response
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[46px] shadow-[0_30px_90px_rgba(8,86,110,0.30)] p-5">
            <div className="absolute inset-0 rounded-[46px] bg-gradient-to-br from-white/70 via-[#E1E9E5]/45 to-[#6FA8AA]/25"></div>

            <div className="relative rounded-[38px] bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] p-6 shadow-2xl overflow-hidden">
              <div className="absolute -top-24 -right-20 w-72 h-72 bg-white/15 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#9ECFD0]/25 rounded-full blur-3xl"></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 text-[#E1E9E5] text-xs font-black">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                      </span>
                      LIVE MATCHING
                    </div>

                    <h2 className="mt-4 text-3xl font-black text-white leading-tight">
                      Smart Service Match
                    </h2>

                    <p className="text-[#B4DBDC] text-sm font-bold mt-1">
                      Worker assigned based on location, skill and trust.
                    </p>
                  </div>

                  <div className="w-16 h-16 bg-[#E1E9E5] rounded-[24px] flex items-center justify-center text-[#08566E] text-3xl shadow-xl">
                    <FaTools />
                  </div>
                </div>

                <div className="bg-[#E1E9E5]/95 rounded-[30px] p-5 shadow-xl border border-white/80">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-16 h-16 bg-gradient-to-br from-[#08566E] to-[#6FA8AA] rounded-[24px] flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
                        <FaTools />
                        <span className="absolute -right-1 -bottom-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[#6FA8AA] text-xs font-black">
                          Selected Service
                        </p>
                        <h3 className="text-[#08566E] text-2xl font-black truncate">
                          {text.electrician}
                        </h3>
                        <p className="text-[#06485C] text-sm font-bold">
                          Fan not working
                        </p>
                      </div>
                    </div>

                    <span className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-black shrink-0">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC]">
                      <FaShieldAlt className="mx-auto text-[#08566E]" />
                      <p className="text-[11px] font-black text-[#6FA8AA] mt-1">
                        Trust
                      </p>
                      <p className="text-[#08566E] text-lg font-black">
                        96%
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC]">
                      <FaClock className="mx-auto text-[#08566E]" />
                      <p className="text-[11px] font-black text-[#6FA8AA] mt-1">
                        ETA
                      </p>
                      <p className="text-[#08566E] text-lg font-black">
                        20m
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC]">
                      <FaRupeeSign className="mx-auto text-[#08566E]" />
                      <p className="text-[11px] font-black text-[#6FA8AA] mt-1">
                        Fare
                      </p>
                      <p className="text-[#08566E] text-lg font-black">
                        ₹99
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white/12 border border-white/20 rounded-[28px] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#B4DBDC] text-xs font-black">
                        AI Match Score
                      </p>
                      <p className="text-white text-2xl font-black">
                        92%
                      </p>
                    </div>

                    <div className="w-16 h-16 rounded-full bg-[#E1E9E5] text-[#08566E] flex items-center justify-center text-xl font-black shadow-xl">
                      92
                    </div>
                  </div>

                  <div className="mt-4 h-3 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[#E1E9E5] via-[#9ECFD0] to-green-400"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/95 rounded-[24px] p-4 border border-white">
                    <div className="flex items-center gap-2 text-[#08566E] text-sm font-black">
                      <FaMapMarkerAlt />
                      Location
                    </div>
                    <p className="text-[#043A4A] font-black mt-2 text-sm">
                      {text.nearCustomerAddress}
                    </p>
                  </div>

                  <div className="bg-white/95 rounded-[24px] p-4 border border-white">
                    <div className="flex items-center gap-2 text-[#08566E] text-sm font-black">
                      <FaRoute />
                      Distance
                    </div>
                    <p className="text-[#043A4A] font-black mt-2 text-sm">
                      1.8 km away
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-[#E1E9E5] text-[#08566E] py-4 rounded-[24px] font-black shadow-lg flex items-center justify-center gap-2">
                  <FaCheckCircle />
                  {text.smartMatchFound}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-9 h-9 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <p className="text-[#B4DBDC] text-[11px] font-bold mt-1">
                      Request
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-9 h-9 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <p className="text-[#B4DBDC] text-[11px] font-bold mt-1">
                      Matched
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-9 h-9 rounded-full bg-[#E1E9E5] text-[#08566E] mx-auto flex items-center justify-center text-xs">
                      <FaHeadset />
                    </div>
                    <p className="text-[#B4DBDC] text-[11px] font-bold mt-1">
                      Support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 -bottom-16 -translate-x-1/2 w-[80%] h-10 bg-[#08566E]/25 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;