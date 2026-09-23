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
  FaHeadset,
  FaRoute,
  FaFire,
  FaSearch,
  FaHome,
  FaClipboardList,
  FaGift,
  FaChevronRight,
  FaCrosshairs,
} from "react-icons/fa";

function Hero({ language = "en" }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  /* =========================================================
     TEXT
  ========================================================= */

  const text = {
    badge: t.heroBadge || "Smart Local Services Hub",

    title:
      language === "hi"
        ? "Services Near You"
        : language === "od"
          ? "ଆପଣଙ୍କ ନିକଟରେ ସେବା"
          : "Services Near You",

    subtitle:
      language === "hi"
        ? "Verified local professionals. Smart assignment. Easy booking."
        : language === "od"
          ? "Verified local professionals. Smart assignment. Easy booking."
          : "Verified local professionals. Smart assignment. Easy booking.",

    description:
      language === "hi"
        ? "E-SERVOO आपके लिए सही professional को location, skill, availability और trust के आधार पर assign करता है।"
        : language === "od"
          ? "E-SERVOO location, skill, availability ଏବଂ trust ଆଧାରରେ ଆପଣଙ୍କ ପାଇଁ ସଠିକ୍ professional assign କରେ।"
          : "E-SERVOO assigns the right professional based on location, skill, availability and trust.",

    bookNow:
      language === "hi"
        ? "Book Service"
        : language === "od"
          ? "ସେବା Book କରନ୍ତୁ"
          : "Book Service",

    search:
      language === "hi"
        ? "आपको किस service की जरूरत है?"
        : language === "od"
          ? "ଆପଣଙ୍କୁ କେଉଁ ସେବା ଦରକାର?"
          : "What service do you need?",

    verified: t.verifiedWorkers || "Verified Workers",

    hyperlocal: t.hyperlocal || "Hyperlocal",

    trusted: t.trustedService || "Trusted Service",

    electrician: t.electrician || "Electrician",

    services: t.services || "Services",

    bookings: t.bookings || "Bookings",

    rewards: t.rewards || "Rewards",

    trackBooking:
      language === "hi"
        ? "Track Booking"
        : language === "od"
          ? "Booking Track"
          : "Track Booking",

    smartMatch:
      language === "hi"
        ? "Smart Match"
        : language === "od"
          ? "Smart Match"
          : "Smart Match",

    allServices:
      language === "hi"
        ? "All Services"
        : language === "od"
          ? "All Services"
          : "All Services",

    inspection:
      language === "hi"
        ? "Inspection-based pricing"
        : language === "od"
          ? "Inspection-based pricing"
          : "Inspection-based pricing",

    location:
      language === "hi"
        ? "Near your location"
        : language === "od"
          ? "ଆପଣଙ୍କ location ନିକଟରେ"
          : "Near your location",

    ready:
      language === "hi"
        ? "Ready to serve"
        : language === "od"
          ? "ସେବା ପାଇଁ ପ୍ରସ୍ତୁତ"
          : "Ready to serve",

    support:
      language === "hi"
        ? "24/7 Support"
        : language === "od"
          ? "24/7 Support"
          : "24/7 Support",
  };

  /* =========================================================
     ANALYTICS
  ========================================================= */

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "hero",
      ...extraData,
    });
  };

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleBookNow = () => {
    pushEvent("hero_cta_click", {
      cta_name: "book_service",
    });

    navigate("/services");
  };

  const handleServices = () => {
    pushEvent("hero_navigation_click", {
      navigation_name: "services",
    });

    const servicesSection =
      document.getElementById("services");

    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate("/services");
    }
  };

  const handleSmartMatch = () => {
    pushEvent("hero_navigation_click", {
      navigation_name: "smart_match",
    });

    navigate("/services");
  };

  const handleBookings = () => {
    pushEvent("hero_navigation_click", {
      navigation_name: "bookings",
    });

    navigate("/bookings");
  };

  const handleRewards = () => {
    pushEvent("hero_navigation_click", {
      navigation_name: "rewards",
    });

    navigate("/rewards");
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#EAF4F2] flex items-center justify-center px-3 py-8 md:px-6">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#B4DBDC] blur-3xl opacity-80"></div>

        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#6FA8AA]/30 blur-3xl"></div>

        <div className="absolute bottom-[-150px] left-1/3 w-96 h-96 rounded-full bg-[#08566E]/15 blur-3xl"></div>

      </div>

      {/* =====================================================
          MOBILE APP FRAME
          9:16 STYLE
      ===================================================== */}

      <div className="relative z-10 w-full max-w-[430px] min-h-[calc(100vh-32px)] md:min-h-[760px] md:max-h-[900px] md:h-[850px] rounded-[42px] md:rounded-[52px] overflow-hidden bg-[#F7FBFA] border border-white shadow-[0_35px_100px_rgba(8,86,110,0.28)]">

        {/* =================================================
            APP TOP AREA
        ================================================= */}

        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0]">

          {/* top glow */}

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/40 rounded-full blur-3xl"></div>

          <div className="relative">

            {/* header */}

            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-white flex items-center justify-center shadow-lg">
                    <FaBolt />
                  </div>

                  <div>

                    <p className="text-[#08566E] text-xl font-black tracking-tight leading-none">
                      E-SERVOO
                    </p>

                    <p className="text-[#06485C] text-[10px] font-black uppercase tracking-widest mt-1">
                      {text.badge}
                    </p>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-xl border border-white flex items-center justify-center text-[#08566E] shadow-md"
                aria-label="Profile"
              >
                <FaUserCheck />
              </button>

            </div>

            {/* location */}

            <button
              type="button"
              onClick={handleBookNow}
              className="w-full mt-5 bg-white/90 backdrop-blur-xl border border-white rounded-2xl p-3 flex items-center gap-3 text-left shadow-[0_8px_25px_rgba(8,86,110,0.12)]"
            >

              <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] text-[#08566E] flex items-center justify-center shrink-0">
                <FaMapMarkerAlt />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[9px] uppercase tracking-widest font-black text-[#6FA8AA]">
                  Service Location
                </p>

                <p className="text-sm font-black text-[#08566E] truncate">
                  {text.location}
                </p>

              </div>

              <FaChevronRight className="text-[#6FA8AA] text-xs" />

            </button>

          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="px-5 pt-5 pb-32 overflow-y-auto h-[calc(100vh-180px)] md:h-[650px] scrollbar-hide">

          {/* heading */}

          <div>

            <div className="inline-flex items-center gap-2 bg-[#E8F5F3] border border-[#B4DBDC] rounded-full px-3 py-1.5">

              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>

              <span className="text-[#08566E] text-[10px] font-black uppercase tracking-wider">
                LIVE SERVICE NETWORK
              </span>

            </div>

            <h1 className="mt-4 text-[38px] md:text-5xl font-black text-[#08566E] leading-[0.98] tracking-tight">
              {text.title}
            </h1>

            <p className="mt-4 text-[#06485C] text-base font-bold leading-relaxed">
              {text.subtitle}
            </p>

          </div>

          {/* =================================================
              SEARCH / SERVICE INPUT
          ================================================= */}

          <button
            type="button"
            onClick={handleBookNow}
            className="w-full mt-5 bg-white border border-[#D7E7E5] rounded-2xl p-3.5 flex items-center gap-3 shadow-[0_8px_25px_rgba(8,86,110,0.08)] text-left"
          >

            <FaSearch className="text-[#6FA8AA] shrink-0" />

            <span className="text-[#8BA5A5] text-sm font-semibold flex-1 truncate">
              {text.search}
            </span>

            <div className="w-8 h-8 rounded-xl bg-[#08566E] text-white flex items-center justify-center">
              <FaArrowRight className="text-xs" />
            </div>

          </button>

          {/* =================================================
              QUICK SERVICES
          ================================================= */}

          <div className="mt-6">

            <div className="flex items-center justify-between mb-3">

              <h2 className="text-lg font-black text-[#08566E]">
                Popular Services
              </h2>

              <button
                type="button"
                onClick={handleServices}
                className="text-xs font-black text-[#6FA8AA]"
              >
                View All
              </button>

            </div>

            <div className="grid grid-cols-4 gap-2.5">

              {/* electrician */}

              <button
                type="button"
                onClick={handleBookNow}
                className="bg-white border border-[#E0ECEA] rounded-2xl p-3 shadow-sm active:scale-95 transition"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#E8F5F3] text-[#08566E] flex items-center justify-center text-lg">
                  <FaBolt />
                </div>

                <p className="text-[10px] font-black text-[#08566E] mt-2 truncate">
                  Electrician
                </p>
              </button>

              {/* tools */}

              <button
                type="button"
                onClick={handleBookNow}
                className="bg-white border border-[#E0ECEA] rounded-2xl p-3 shadow-sm active:scale-95 transition"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#E8F5F3] text-[#08566E] flex items-center justify-center text-lg">
                  <FaTools />
                </div>

                <p className="text-[10px] font-black text-[#08566E] mt-2 truncate">
                  Plumber
                </p>
              </button>

              {/* verified */}

              <button
                type="button"
                onClick={handleBookNow}
                className="bg-white border border-[#E0ECEA] rounded-2xl p-3 shadow-sm active:scale-95 transition"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#E8F5F3] text-[#08566E] flex items-center justify-center text-lg">
                  <FaUserCheck />
                </div>

                <p className="text-[10px] font-black text-[#08566E] mt-2 truncate">
                  Cleaner
                </p>
              </button>

              {/* all */}

              <button
                type="button"
                onClick={handleServices}
                className="bg-[#08566E] border border-[#08566E] rounded-2xl p-3 shadow-sm active:scale-95 transition"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/15 text-white flex items-center justify-center text-lg">
                  <FaArrowRight />
                </div>

                <p className="text-[10px] font-black text-white mt-2 truncate">
                  All
                </p>
              </button>

            </div>

          </div>

          {/* =================================================
              SMART ASSIGNMENT CARD
          ================================================= */}

          <div className="mt-6 relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] p-5 shadow-[0_18px_45px_rgba(8,86,110,0.25)]">

            <div className="absolute -top-20 -right-20 w-52 h-52 bg-white/10 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-[#9ECFD0]/15 rounded-full blur-3xl"></div>

            <div className="relative">

              {/* label */}

              <div className="flex items-center justify-between">

                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1">

                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>

                  <span className="text-[9px] text-[#E1E9E5] font-black tracking-wider">
                    SMART ASSIGNMENT
                  </span>

                </div>

                <FaShieldAlt className="text-[#B4DBDC]" />

              </div>

              <h2 className="text-2xl font-black text-white mt-4 leading-tight">
                Right Professional.
                <br />
                Right Place.
              </h2>

              <p className="text-[#B4DBDC] text-xs font-semibold mt-2 leading-relaxed">
                {text.description}
              </p>

              {/* worker preview */}

              <div className="mt-4 bg-[#E1E9E5] rounded-2xl p-3.5">

                <div className="flex items-center gap-3">

                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#08566E] to-[#6FA8AA] text-white flex items-center justify-center shrink-0 shadow-md">

                    <FaTools />

                    <span className="absolute -right-1 -bottom-1 w-5 h-5 bg-green-500 text-white border-2 border-white rounded-full flex items-center justify-center text-[8px]">
                      ✓
                    </span>

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[9px] text-[#6FA8AA] font-black uppercase">
                      {text.verified}
                    </p>

                    <h3 className="text-[#08566E] font-black text-base">
                      Verified {text.electrician}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">

                      <span className="text-[#08566E] text-xs font-black flex items-center gap-1">
                        <FaStar className="text-yellow-500" />
                        4.9
                      </span>

                      <span className="text-[#6FA8AA] text-[10px] font-bold">
                        •
                      </span>

                      <span className="text-[#6FA8AA] text-[10px] font-bold">
                        {text.ready}
                      </span>

                    </div>

                  </div>

                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-black">
                    ACTIVE
                  </span>

                </div>

              </div>

              {/* metrics */}

              <div className="grid grid-cols-3 gap-2.5 mt-3">

                <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">

                  <FaShieldAlt className="mx-auto text-[#B4DBDC] text-sm" />

                  <p className="text-white font-black text-sm mt-1">
                    96%
                  </p>

                  <p className="text-[#B4DBDC] text-[8px] font-bold">
                    Trust
                  </p>

                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">

                  <FaClock className="mx-auto text-[#B4DBDC] text-sm" />

                  <p className="text-white font-black text-sm mt-1">
                    20m
                  </p>

                  <p className="text-[#B4DBDC] text-[8px] font-bold">
                    ETA
                  </p>

                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">

                  <FaRoute className="mx-auto text-[#B4DBDC] text-sm" />

                  <p className="text-white font-black text-sm mt-1">
                    1.8 km
                  </p>

                  <p className="text-[#B4DBDC] text-[8px] font-bold">
                    Distance
                  </p>

                </div>

              </div>

              {/* pricing */}

              <div className="mt-3 bg-white/10 border border-white/15 rounded-2xl p-3 flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-[#E1E9E5] text-[#08566E] flex items-center justify-center">
                  <FaCheckCircle />
                </div>

                <div>

                  <p className="text-white text-xs font-black">
                    {text.inspection}
                  </p>

                  <p className="text-[#B4DBDC] text-[10px] font-semibold mt-0.5">
                    Final amount after service inspection
                  </p>

                </div>

              </div>

            </div>
          </div>

          {/* =================================================
              TRUST STRIP
          ================================================= */}

          <div className="grid grid-cols-3 gap-2.5 mt-5">

            <div className="bg-white border border-[#E0ECEA] rounded-2xl p-3 text-center">

              <FaShieldAlt className="mx-auto text-[#08566E]" />

              <p className="text-[#08566E] text-[10px] font-black mt-1">
                Verified
              </p>

            </div>

            <div className="bg-white border border-[#E0ECEA] rounded-2xl p-3 text-center">

              <FaMapMarkerAlt className="mx-auto text-[#08566E]" />

              <p className="text-[#08566E] text-[10px] font-black mt-1">
                Hyperlocal
              </p>

            </div>

            <div className="bg-white border border-[#E0ECEA] rounded-2xl p-3 text-center">

              <FaHeadset className="mx-auto text-[#08566E]" />

              <p className="text-[#08566E] text-[10px] font-black mt-1">
                24/7 Support
              </p>

            </div>

          </div>

          {/* =================================================
              MAIN CTA
          ================================================= */}

          <button
            type="button"
            onClick={handleBookNow}
            className="w-full mt-5 bg-[#08566E] hover:bg-[#06485C] active:scale-[0.98] text-[#E1E9E5] py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_12px_30px_rgba(8,86,110,0.25)] transition"
          >

            <FaBolt />

            {text.bookNow}

            <FaArrowRight className="text-sm" />

          </button>

        </div>

        {/* =================================================
            3-BUTTON APP NAVIGATION
        ================================================= */}

        <div className="absolute left-3 right-3 bottom-3 z-50">

          <div className="bg-white/90 backdrop-blur-2xl border border-white rounded-[26px] shadow-[0_15px_45px_rgba(8,86,110,0.20)] p-2">

            <div className="grid grid-cols-3 gap-1">

              {/* SERVICES */}

              <button
                type="button"
                onClick={handleServices}
                className="group flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl bg-[#E8F5F3] text-[#08566E] active:scale-95 transition"
              >

                <FaTools className="text-base" />

                <span className="text-[9px] font-black">
                  {text.allServices}
                </span>

              </button>

              {/* SMART MATCH */}

              <button
                type="button"
                onClick={handleSmartMatch}
                className="group flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl bg-[#08566E] text-white active:scale-95 transition shadow-md"
              >

                <FaUserCheck className="text-base" />

                <span className="text-[9px] font-black">
                  {text.smartMatch}
                </span>

              </button>

              {/* BOOKINGS */}

              <button
                type="button"
                onClick={handleBookings}
                className="group flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl bg-[#E8F5F3] text-[#08566E] active:scale-95 transition"
              >

                <FaClipboardList className="text-base" />

                <span className="text-[9px] font-black">
                  {text.bookings}
                </span>

              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;