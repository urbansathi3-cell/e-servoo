import { useNavigate } from "react-router-dom";
import { translations } from "../translations";
import {
  FaArrowRight,
  FaBolt,
  FaCheckCircle,
  FaTools,
  FaHome,
  FaClipboardList,
  FaUser,
  FaGift,
  FaSearch,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaChevronRight,
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
      color: "from-[#08566E] to-[#0A7F88]",
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
      color: "from-[#087E91] to-[#55B6C0]",
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
      color: "from-[#7C5B35] to-[#B28A58]",
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
      color: "from-[#08566E] to-[#6FA8AA]",
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
      color: "from-[#C76B25] to-[#E9A45A]",
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
      color: "from-[#287C68] to-[#63B99E]",
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
      color: "from-[#7655A8] to-[#AA8DD2]",
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
      color: "from-[#287EA8] to-[#7BC6E6]",
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
      color: "from-[#465A91] to-[#879BD0]",
      desc:
        language === "hi"
          ? "Home tuition और study support"
          : language === "od"
            ? "Home tuition ଏବଂ study support"
            : "Home tuition and study support",
    },
  ];

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

  const goHome = () => {
    pushEvent("services_navigation_click", {
      navigation_name: "home",
    });

    navigate("/");
  };

  const goBookings = () => {
    pushEvent("services_navigation_click", {
      navigation_name: "bookings",
    });

    navigate("/bookings");
  };

  const goProfile = () => {
    pushEvent("services_navigation_click", {
      navigation_name: "profile",
    });

    navigate("/profile");
  };

  const goRewards = () => {
    pushEvent("services_navigation_click", {
      navigation_name: "rewards",
    });

    navigate("/rewards");
  };

  return (
    <section
      id="services"
      className="relative min-h-screen overflow-hidden bg-[#F5FAF9] text-[#08566E] pb-28"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#B4DBDC]/50 blur-3xl" />

        <div className="absolute top-[35%] -right-40 w-96 h-96 rounded-full bg-[#9ECFD0]/35 blur-3xl" />

        <div className="absolute bottom-20 left-1/4 w-72 h-72 rounded-full bg-[#E1E9E5]/70 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* =====================================================
            MOBILE-APP HEADER
        ====================================================== */}

        <div className="sticky top-0 z-40 -mx-4 px-4 pt-3 pb-3 bg-[#F5FAF9]/90 backdrop-blur-xl border-b border-[#DCE9E8]">

          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={goHome}
              className="flex items-center gap-2"
            >
              <img
                src="/logo.png"
                alt="E-SERVOO"
                className="w-10 h-10 rounded-xl object-contain shadow-sm"
              />

              <div className="text-left">
                <p className="text-[8px] uppercase tracking-[0.18em] font-black text-[#6FA8AA]">
                  E-SERVOO
                </p>

                <p className="text-sm font-black text-[#08566E]">
                  Services
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={goProfile}
              className="w-10 h-10 rounded-xl bg-[#08566E] text-white flex items-center justify-center shadow-md active:scale-95 transition"
            >
              <FaUser className="text-sm" />
            </button>

          </div>

        </div>

        {/* =====================================================
            LOCATION BAR
        ====================================================== */}

        <div className="pt-5">

          <button
            type="button"
            onClick={() => navigate("/services")}
            className="w-full bg-white rounded-2xl border border-[#DCE9E8] p-3 flex items-center gap-3 shadow-sm"
          >

            <div className="w-10 h-10 rounded-xl bg-[#E5F3F2] text-[#08566E] flex items-center justify-center shrink-0">
              <FaMapMarkerAlt />
            </div>

            <div className="text-left min-w-0 flex-1">

              <p className="text-[8px] uppercase tracking-widest font-black text-[#8AA7AA]">
                Service Location
              </p>

              <p className="text-xs font-black text-[#043A4A] truncate">
                Select your location
              </p>

            </div>

            <FaChevronRight className="text-[#6FA8AA] text-xs" />

          </button>

        </div>

        {/* =====================================================
            PAGE INTRO
        ====================================================== */}

        <div className="pt-6 pb-5">

          <div className="inline-flex items-center gap-2 bg-[#E5F3F2] border border-[#CDE5E3] px-3 py-1.5 rounded-full">
            <FaBolt className="text-[#08566E] text-xs" />

            <span className="text-[9px] font-black text-[#08566E] uppercase tracking-wide">
              Trusted Local Services
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-[#043A4A] leading-tight">
            Choose a Service
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#5B777C] font-semibold max-w-2xl leading-relaxed">
            Select the service you need and E-SERVOO will help you find a
            verified professional nearby.
          </p>

        </div>

        {/* =====================================================
            SEARCH BAR
        ====================================================== */}

        <div className="mb-6">

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7FA2A6] text-sm" />

            <input
              type="text"
              placeholder="Search service..."
              className="
                w-full
                bg-white
                border border-[#DCE9E8]
                rounded-2xl
                py-3.5
                pl-11
                pr-4
                text-sm
                font-semibold
                text-[#043A4A]
                outline-none
                focus:border-[#6FA8AA]
                focus:ring-4
                focus:ring-[#B4DBDC]/30
                shadow-sm
              "
            />

          </div>

        </div>

        {/* =====================================================
            SERVICE SECTION HEADER
        ====================================================== */}

        <div className="flex items-center justify-between mb-3">

          <div>
            <p className="text-[9px] uppercase tracking-widest font-black text-[#6FA8AA]">
              Categories
            </p>

            <h2 className="text-lg font-black text-[#043A4A]">
              Popular Services
            </h2>
          </div>

          <div className="flex items-center gap-1 text-[9px] font-black text-[#08566E] bg-[#E5F3F2] px-3 py-1.5 rounded-full">
            <FaShieldAlt />
            VERIFIED
          </div>

        </div>

        {/* =====================================================
            SERVICE GRID
        ====================================================== */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

          {services.map((service) => (

            <button
              type="button"
              key={service.value}
              onClick={() => handleServiceClick(service.value)}
              className="
                group
                relative
                overflow-hidden
                text-left
                bg-white
                border border-[#DCE9E8]
                rounded-[24px]
                p-3
                shadow-[0_8px_25px_rgba(8,86,110,0.07)]
                hover:-translate-y-1
                hover:shadow-[0_15px_35px_rgba(8,86,110,0.14)]
                active:scale-[0.97]
                transition
              "
            >

              {/* TOP COLOR STRIP */}

              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.color}`}
              />

              {/* ICON */}

              <div
                className={`w-14 h-14 mt-2 rounded-[18px] bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition`}
              >
                {service.icon}
              </div>

              {/* NAME */}

              <h3 className="mt-3 text-sm sm:text-base font-black text-[#08566E] leading-tight">
                {service.name}
              </h3>

              {/* DESCRIPTION */}

              <p className="mt-1 text-[9px] sm:text-[10px] leading-relaxed font-semibold text-[#718C90] line-clamp-2">
                {service.desc}
              </p>

              {/* VERIFIED */}

              <div className="mt-3 flex items-center gap-1">

                <FaCheckCircle className="text-green-500 text-[9px]" />

                <span className="text-[8px] sm:text-[9px] font-black text-[#6A888D]">
                  Verified workers
                </span>

              </div>

              {/* ARROW */}

              <div className="mt-3 flex items-center justify-between">

                <span className="text-[8px] font-black uppercase tracking-wide text-[#6FA8AA]">
                  View
                </span>

                <span className="w-7 h-7 rounded-xl bg-[#08566E] text-white flex items-center justify-center group-hover:translate-x-1 transition">

                  <FaArrowRight className="text-[9px]" />

                </span>

              </div>

            </button>

          ))}

        </div>

        {/* =====================================================
            SMART ASSIGNMENT CARD
        ====================================================== */}

        <div className="mt-6">

          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] p-5 shadow-xl">

            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#9ECFD0]/20 blur-3xl" />

            <div className="relative">

              <div className="flex items-start gap-3">

                <div className="w-11 h-11 rounded-2xl bg-[#E1E9E5] text-[#08566E] flex items-center justify-center shrink-0">
                  <FaTools />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <p className="text-[9px] font-black uppercase tracking-widest text-[#B4DBDC]">
                      Smart Assignment
                    </p>

                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                  </div>

                  <h3 className="mt-1 text-lg font-black text-white">
                    We help find the right professional
                  </h3>

                </div>

              </div>

              <p className="mt-3 text-xs text-[#B4DBDC] font-semibold leading-relaxed">
                Your request can be matched using service availability,
                location, skills and trust information.
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4">

                <div className="bg-white/10 border border-white/10 rounded-xl p-2 text-center">

                  <FaMapMarkerAlt className="mx-auto text-[#E1E9E5] text-xs" />

                  <p className="text-[8px] text-[#B4DBDC] font-black mt-1">
                    Nearby
                  </p>

                </div>

                <div className="bg-white/10 border border-white/10 rounded-xl p-2 text-center">

                  <FaShieldAlt className="mx-auto text-[#E1E9E5] text-xs" />

                  <p className="text-[8px] text-[#B4DBDC] font-black mt-1">
                    Verified
                  </p>

                </div>

                <div className="bg-white/10 border border-white/10 rounded-xl p-2 text-center">

                  <FaCheckCircle className="mx-auto text-[#E1E9E5] text-xs" />

                  <p className="text-[8px] text-[#B4DBDC] font-black mt-1">
                    Trusted
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            TRUST STRIP
        ====================================================== */}

        <div className="mt-5 bg-[#E9F4F3] border border-[#CFE4E2] rounded-2xl p-3 flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-[#08566E] text-white flex items-center justify-center shrink-0">
            <FaShieldAlt />
          </div>

          <div className="min-w-0">

            <p className="text-[10px] font-black text-[#08566E]">
              Safe & Trusted Service
            </p>

            <p className="text-[8px] text-[#6A888D] font-semibold mt-0.5">
              Verified professionals • Smart assignment • Support
            </p>

          </div>

          <FaCheckCircle className="ml-auto text-green-500 shrink-0" />

        </div>

      </div>

      {/* =====================================================
          3-LINE BOTTOM NAVIGATION
      ====================================================== */}

      <div className="fixed bottom-3 left-3 right-3 z-[90]">

        <div className="max-w-[430px] mx-auto">

          <div className="relative bg-white/90 backdrop-blur-2xl border border-white shadow-[0_15px_50px_rgba(8,86,110,0.22)] rounded-[28px] px-2 py-2">

            <div className="grid grid-cols-5 items-center">

              {/* HOME */}

              <button
                type="button"
                onClick={goHome}
                className="flex flex-col items-center justify-center gap-1 py-2 text-[#6FA8AA] active:scale-90 transition"
              >
                <FaHome className="text-sm" />

                <span className="text-[8px] font-black">
                  Home
                </span>
              </button>

              {/* SERVICES */}

              <button
                type="button"
                className="flex flex-col items-center justify-center gap-1 py-2 text-[#08566E] active:scale-90 transition"
              >
                <FaTools className="text-sm" />

                <span className="text-[8px] font-black">
                  Services
                </span>
              </button>

              {/* CENTER BOOK */}

              <button
                type="button"
                onClick={() => navigate("/services")}
                className="relative -mt-8 mx-auto w-14 h-14 rounded-full bg-[#08566E] border-[5px] border-[#F5FAF9] shadow-[0_8px_25px_rgba(8,86,110,0.35)] text-white flex items-center justify-center active:scale-90 transition"
              >
                <FaBolt />
              </button>

              {/* BOOKINGS */}

              <button
                type="button"
                onClick={goBookings}
                className="flex flex-col items-center justify-center gap-1 py-2 text-[#6FA8AA] active:scale-90 transition"
              >
                <FaClipboardList className="text-sm" />

                <span className="text-[8px] font-black">
                  Bookings
                </span>
              </button>

              {/* PROFILE */}

              <button
                type="button"
                onClick={goProfile}
                className="flex flex-col items-center justify-center gap-1 py-2 text-[#6FA8AA] active:scale-90 transition"
              >
                <FaUser className="text-sm" />

                <span className="text-[8px] font-black">
                  Profile
                </span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Services;