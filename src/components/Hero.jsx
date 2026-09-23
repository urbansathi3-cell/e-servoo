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
  FaClipboardList,
  FaGift,
  FaUser,
  FaHome,
  FaSearch,
  FaChevronRight,
  FaWrench,
  FaBroom,
  FaUtensils,
  FaLocationArrow,
} from "react-icons/fa";

function Hero({ language = "en" }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const text = {
    badge: t.heroBadge || "Smart Local Services Hub",

    welcome:
      language === "hi"
        ? "Aapke aas-paas ki trusted services"
        : language === "od"
          ? "ଆପଣଙ୍କ ନିକଟରେ ବିଶ୍ୱସ୍ତ ସେବା"
          : "Trusted services around you",

    title: "E-SERVOO",

    subtitle:
      language === "hi"
        ? "Right Professional. Right Service. Right When You Need It."
        : language === "od"
          ? "Right Professional. Right Service. Right When You Need It."
          : "Right Professional. Right Service. Right When You Need It.",

    description:
      language === "hi"
        ? "Verified local professionals, smart assignment और trusted service support — एक ही platform पर।"
        : language === "od"
          ? "Verified local professionals, smart assignment ଏବଂ trusted service support — ସବୁ ଗୋଟିଏ platform ରେ।"
          : "Verified local professionals, smart assignment and trusted service support — all in one platform.",

    book:
      language === "hi"
        ? "Book Service"
        : language === "od"
          ? "Book Service"
          : "Book Service",

    services:
      language === "hi"
        ? "All Services"
        : language === "od"
          ? "All Services"
          : "All Services",

    bookings:
      language === "hi"
        ? "My Bookings"
        : language === "od"
          ? "My Bookings"
          : "My Bookings",

    rewards:
      language === "hi"
        ? "Rewards"
        : language === "od"
          ? "Rewards"
          : "Rewards",

    profile:
      language === "hi"
        ? "Profile"
        : language === "od"
          ? "Profile"
          : "Profile",

    location:
      language === "hi"
        ? "Service Location"
        : language === "od"
          ? "ସେବା ସ୍ଥାନ"
          : "Service Location",

    selectLocation:
      language === "hi"
        ? "Select your location"
        : language === "od"
          ? "ଆପଣଙ୍କ ସ୍ଥାନ ବାଛନ୍ତୁ"
          : "Select your location",

    quickAccess:
      language === "hi"
        ? "Quick Access"
        : language === "od"
          ? "Quick Access"
          : "Quick Access",

    smartAssignment:
      language === "hi"
        ? "Smart Assignment"
        : language === "od"
          ? "Smart Assignment"
          : "Smart Assignment",
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
      cta_name: "book_service",
    });

    navigate("/services");
  };

  const handleServices = () => {
    pushEvent("hero_navigation_click", {
      navigation_name: "services",
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

  const handleProfile = () => {
    pushEvent("hero_navigation_click", {
      navigation_name: "profile",
    });

    navigate("/profile");
  };

  const handleLocation = () => {
    pushEvent("hero_location_click");
    navigate("/services");
  };

  return (
    <section className="relative overflow-hidden min-h-screen bg-[#DDE8E8] px-4 pt-16 pb-24 sm:px-6">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-[#08566E]/10 blur-3xl" />

        <div className="absolute top-[35%] -right-40 w-[420px] h-[420px] rounded-full bg-[#6FA8AA]/25 blur-3xl" />

        <div className="absolute bottom-0 left-[30%] w-[360px] h-[360px] rounded-full bg-white/60 blur-3xl" />

      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* =====================================================
            SMALL DESKTOP INTRO
        ====================================================== */}

        <div className="text-center max-w-3xl mx-auto mb-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-white shadow-md text-[#08566E] text-xs sm:text-sm font-black">

            <FaBolt />

            {text.badge}

          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#08566E]">

            {text.title}

          </h1>

          <p className="mt-2 text-base sm:text-xl font-black text-[#043A4A]">

            {text.subtitle}

          </p>

          <p className="hidden sm:block mt-3 max-w-2xl mx-auto text-sm text-[#315D67] font-semibold leading-relaxed">

            {text.description}

          </p>

        </div>

        {/* =====================================================
            PHONE SHOWCASE
        ====================================================== */}

        <div className="flex justify-center">

          <div className="relative w-full max-w-[420px]">

            {/* =================================================
                FLOATING VERIFIED CARD
            ================================================== */}

            <div className="absolute -top-4 -left-3 sm:-left-12 z-40 bg-white/95 backdrop-blur-xl border border-white rounded-2xl px-3 py-2 shadow-[0_15px_45px_rgba(8,86,110,0.20)]">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-[#08566E] text-white flex items-center justify-center">

                  <FaUserCheck />

                </div>

                <div>

                  <p className="text-[10px] font-black text-[#08566E]">
                    VERIFIED
                  </p>

                  <p className="text-[9px] font-bold text-[#6FA8AA]">
                    Professionals
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                FLOATING MATCHING BADGE
            ================================================== */}

            <div className="absolute top-24 -right-3 sm:-right-10 z-40 bg-[#08566E] text-white rounded-2xl px-3 py-2 shadow-xl">

              <div className="flex items-center gap-2">

                <span className="relative flex w-2.5 h-2.5">

                  <span className="absolute inline-flex w-full h-full rounded-full bg-green-300 animate-ping" />

                  <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-green-400" />

                </span>

                <span className="text-[9px] font-black">
                  LIVE MATCHING
                </span>

              </div>

            </div>

            {/* =================================================
                9:16 PHONE
            ================================================== */}

            <div
              className="
                relative
                w-full
                aspect-[9/16]
                max-h-[780px]
                rounded-[44px]
                sm:rounded-[52px]
                bg-[#F7FAF9]
                border-[7px]
                border-[#043A4A]
                shadow-[0_35px_100px_rgba(8,86,110,0.35)]
                overflow-hidden
              "
            >

              {/* PHONE SCREEN */}

              <div className="absolute inset-0 bg-[#F7FAF9] overflow-hidden">

                {/* =================================================
                    STATUS / TOP BAR
                ================================================== */}

                <div className="px-5 pt-5 pb-2">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[8px] uppercase tracking-[0.16em] text-[#7B9B9F] font-black">
                        {text.welcome}
                      </p>

                      <h2 className="text-xl font-black text-[#08566E] leading-tight">
                        E-SERVOO
                      </h2>

                    </div>

                    <button
                      type="button"
                      onClick={handleProfile}
                      className="w-10 h-10 rounded-2xl bg-[#08566E] text-white flex items-center justify-center shadow-md active:scale-95 transition"
                    >
                      <FaUser className="text-sm" />
                    </button>

                  </div>

                </div>

                {/* =================================================
                    LOCATION
                ================================================== */}

                <div className="px-5 mt-2">

                  <button
                    type="button"
                    onClick={handleLocation}
                    className="w-full flex items-center gap-3 bg-white border border-[#DDEAE9] rounded-[20px] px-3.5 py-3 shadow-sm active:scale-[0.99] transition text-left"
                  >

                    <div className="w-9 h-9 rounded-xl bg-[#E5F3F2] flex items-center justify-center text-[#08566E] shrink-0">

                      <FaMapMarkerAlt className="text-sm" />

                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="text-[8px] uppercase tracking-wider text-[#8AA7AA] font-black">
                        {text.location}
                      </p>

                      <p className="text-[11px] text-[#043A4A] font-black truncate">
                        {text.selectLocation}
                      </p>

                    </div>

                    <FaChevronRight className="text-[#6FA8AA] text-[10px]" />

                  </button>

                </div>

                {/* =================================================
                    SEARCH BAR
                ================================================== */}

                <div className="px-5 mt-3">

                  <button
                    type="button"
                    onClick={handleServices}
                    className="w-full bg-[#EEF5F4] rounded-2xl px-4 py-3 flex items-center gap-3 text-left border border-[#E1EBEA]"
                  >

                    <FaSearch className="text-[#6FA8AA] text-xs" />

                    <span className="text-[10px] text-[#7A969A] font-bold">
                      Search for a service...
                    </span>

                  </button>

                </div>

                {/* =================================================
                    MAIN HERO CARD
                ================================================== */}

                <div className="px-5 mt-4">

                  <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] p-5 shadow-xl">

                    <div className="absolute -top-20 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-20 -left-16 w-52 h-52 rounded-full bg-[#9ECFD0]/20 blur-3xl" />

                    <div className="relative">

                      <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[#E1E9E5] text-[8px] font-black">

                        <FaBolt />

                        SMART SERVICE

                      </div>

                      <h3 className="mt-3 text-[25px] font-black text-white leading-[1.05]">

                        Service when
                        <br />
                        you need it.

                      </h3>

                      <p className="mt-2 text-[9px] text-[#B4DBDC] font-semibold leading-relaxed max-w-[250px]">

                        Tell us your problem. E-SERVOO helps connect you with the right professional.

                      </p>

                      <button
                        type="button"
                        onClick={handleBookNow}
                        className="mt-4 w-full bg-[#E1E9E5] text-[#08566E] rounded-2xl py-3 font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition"
                      >

                        <FaBolt />

                        {text.book}

                        <FaArrowRight className="text-[9px]" />

                      </button>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    QUICK SERVICES
                ================================================== */}

                <div className="px-5 mt-4">

                  <div className="flex items-center justify-between">

                    <h3 className="text-xs font-black text-[#043A4A]">
                      Popular Services
                    </h3>

                    <button
                      type="button"
                      onClick={handleServices}
                      className="text-[8px] font-black text-[#08566E]"
                    >
                      VIEW ALL
                    </button>

                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-2.5">

                    <button
                      type="button"
                      onClick={handleServices}
                      className="bg-white border border-[#E1EBEA] rounded-2xl p-2.5 shadow-sm active:scale-95 transition"
                    >

                      <div className="w-8 h-8 mx-auto rounded-xl bg-[#E7F4F3] text-[#08566E] flex items-center justify-center">
                        <FaBolt className="text-xs" />
                      </div>

                      <p className="mt-1.5 text-[7px] font-black text-[#315D67]">
                        Electrician
                      </p>

                    </button>

                    <button
                      type="button"
                      onClick={handleServices}
                      className="bg-white border border-[#E1EBEA] rounded-2xl p-2.5 shadow-sm active:scale-95 transition"
                    >

                      <div className="w-8 h-8 mx-auto rounded-xl bg-[#E7F4F3] text-[#08566E] flex items-center justify-center">
                        <FaWrench className="text-xs" />
                      </div>

                      <p className="mt-1.5 text-[7px] font-black text-[#315D67]">
                        Plumber
                      </p>

                    </button>

                    <button
                      type="button"
                      onClick={handleServices}
                      className="bg-white border border-[#E1EBEA] rounded-2xl p-2.5 shadow-sm active:scale-95 transition"
                    >

                      <div className="w-8 h-8 mx-auto rounded-xl bg-[#E7F4F3] text-[#08566E] flex items-center justify-center">
                        <FaBroom className="text-xs" />
                      </div>

                      <p className="mt-1.5 text-[7px] font-black text-[#315D67]">
                        Cleaner
                      </p>

                    </button>

                    <button
                      type="button"
                      onClick={handleServices}
                      className="bg-white border border-[#E1EBEA] rounded-2xl p-2.5 shadow-sm active:scale-95 transition"
                    >

                      <div className="w-8 h-8 mx-auto rounded-xl bg-[#FFF2DE] text-[#D98520] flex items-center justify-center">
                        <FaUtensils className="text-xs" />
                      </div>

                      <p className="mt-1.5 text-[7px] font-black text-[#315D67]">
                        Cook
                      </p>

                    </button>

                  </div>

                </div>

                {/* =================================================
                    SMART ASSIGNMENT
                ================================================== */}

                <div className="px-5 mt-4">

                  <div className="flex items-center justify-between mb-2">

                    <h3 className="text-xs font-black text-[#043A4A]">
                      {text.smartAssignment}
                    </h3>

                    <span className="flex items-center gap-1 text-[8px] text-green-600 font-black">

                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

                      ACTIVE

                    </span>

                  </div>

                  <div className="bg-white rounded-[22px] border border-[#DDEAE9] p-3.5 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#08566E] to-[#6FA8AA] flex items-center justify-center text-white shrink-0">

                        <FaTools />

                        <span className="absolute -right-1 -bottom-1 w-5 h-5 bg-green-500 text-white rounded-full border-2 border-white flex items-center justify-center text-[7px]">
                          ✓
                        </span>

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="text-[7px] uppercase text-[#6FA8AA] font-black">
                          BEST MATCH
                        </p>

                        <p className="text-[11px] font-black text-[#08566E] truncate">
                          Verified Professional
                        </p>

                        <div className="flex items-center gap-2 mt-1">

                          <span className="flex items-center gap-1 text-[8px] font-bold text-[#777]">

                            <FaStar className="text-yellow-500" />

                            4.9

                          </span>

                          <span className="text-[#CCC]">
                            •
                          </span>

                          <span className="text-[8px] font-bold text-[#777]">
                            Nearby
                          </span>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-[7px] text-[#999] font-bold">
                          Trust
                        </p>

                        <p className="text-xs font-black text-[#08566E]">
                          96%
                        </p>

                      </div>

                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">

                      <div className="rounded-xl bg-[#F2F8F7] p-2 text-center">

                        <FaMapMarkerAlt className="mx-auto text-[#08566E] text-[10px]" />

                        <p className="text-[7px] font-black text-[#6FA8AA] mt-1">
                          Nearby
                        </p>

                      </div>

                      <div className="rounded-xl bg-[#F2F8F7] p-2 text-center">

                        <FaClock className="mx-auto text-[#08566E] text-[10px]" />

                        <p className="text-[7px] font-black text-[#6FA8AA] mt-1">
                          Quick ETA
                        </p>

                      </div>

                      <div className="rounded-xl bg-[#F2F8F7] p-2 text-center">

                        <FaShieldAlt className="mx-auto text-[#08566E] text-[10px]" />

                        <p className="text-[7px] font-black text-[#6FA8AA] mt-1">
                          Verified
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    3-LINE APP NAVIGATION
                ================================================== */}

                <div className="px-5 mt-4">

                  <div className="grid grid-cols-3 gap-2">

                    {/* LINE 1 */}

                    <button
                      type="button"
                      onClick={handleServices}
                      className="flex items-center gap-2 bg-white border border-[#E0EBEA] rounded-xl px-2.5 py-2.5 text-left active:scale-95 transition"
                    >

                      <FaTools className="text-[#08566E] text-[10px]" />

                      <span className="text-[7px] font-black text-[#315D67]">
                        {text.services}
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={handleBookings}
                      className="flex items-center gap-2 bg-white border border-[#E0EBEA] rounded-xl px-2.5 py-2.5 text-left active:scale-95 transition"
                    >

                      <FaClipboardList className="text-[#08566E] text-[10px]" />

                      <span className="text-[7px] font-black text-[#315D67]">
                        {text.bookings}
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={handleRewards}
                      className="flex items-center gap-2 bg-white border border-[#E0EBEA] rounded-xl px-2.5 py-2.5 text-left active:scale-95 transition"
                    >

                      <FaGift className="text-[#D98520] text-[10px]" />

                      <span className="text-[7px] font-black text-[#315D67]">
                        {text.rewards}
                      </span>

                    </button>

                    {/* LINE 2 */}

                    <button
                      type="button"
                      onClick={handleProfile}
                      className="flex items-center gap-2 bg-white border border-[#E0EBEA] rounded-xl px-2.5 py-2.5 text-left active:scale-95 transition"
                    >

                      <FaUser className="text-[#08566E] text-[10px]" />

                      <span className="text-[7px] font-black text-[#315D67]">
                        {text.profile}
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={handleServices}
                      className="flex items-center gap-2 bg-white border border-[#E0EBEA] rounded-xl px-2.5 py-2.5 text-left active:scale-95 transition"
                    >

                      <FaRoute className="text-[#08566E] text-[10px]" />

                      <span className="text-[7px] font-black text-[#315D67]">
                        Nearby
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={handleBookNow}
                      className="flex items-center gap-2 bg-[#08566E] border border-[#08566E] rounded-xl px-2.5 py-2.5 text-left active:scale-95 transition"
                    >

                      <FaBolt className="text-[#E1E9E5] text-[10px]" />

                      <span className="text-[7px] font-black text-white">
                        Book Now
                      </span>

                    </button>

                  </div>

                </div>

                {/* =================================================
                    TRUST STRIP
                ================================================== */}

                <div className="px-5 mt-3">

                  <div className="rounded-2xl bg-[#E9F4F3] border border-[#CFE4E2] px-3 py-2.5 flex items-center gap-2.5">

                    <div className="w-8 h-8 rounded-xl bg-[#08566E] text-white flex items-center justify-center shrink-0">

                      <FaShieldAlt className="text-xs" />

                    </div>

                    <div className="min-w-0">

                      <p className="text-[8px] font-black text-[#08566E]">
                        Safe & Trusted Service
                      </p>

                      <p className="text-[7px] text-[#6A888D] font-semibold mt-0.5 truncate">
                        Verified • Smart Assignment • Support
                      </p>

                    </div>

                    <FaCheckCircle className="ml-auto text-green-500 text-xs shrink-0" />

                  </div>

                </div>

                {/* =================================================
                    BOTTOM MOBILE NAV
                ================================================== */}

                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-3 bg-white/95 backdrop-blur-xl border-t border-[#E2ECEB]">

                  <div className="flex items-center justify-between">

                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="flex flex-col items-center gap-1 w-12 text-[#08566E]"
                    >

                      <FaHome className="text-xs" />

                      <span className="text-[6px] font-black">
                        Home
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={handleServices}
                      className="flex flex-col items-center gap-1 w-12 text-[#7A999D]"
                    >

                      <FaTools className="text-xs" />

                      <span className="text-[6px] font-black">
                        Services
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={handleBookNow}
                      className="relative -mt-7 w-12 h-12 rounded-full bg-[#08566E] border-[4px] border-[#F7FAF9] shadow-[0_8px_25px_rgba(8,86,110,0.35)] text-white flex items-center justify-center active:scale-95 transition"
                    >

                      <FaBolt className="text-sm" />

                    </button>

                    <button
                      type="button"
                      onClick={handleBookings}
                      className="flex flex-col items-center gap-1 w-12 text-[#7A999D]"
                    >

                      <FaClipboardList className="text-xs" />

                      <span className="text-[6px] font-black">
                        Bookings
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={handleProfile}
                      className="flex flex-col items-center gap-1 w-12 text-[#7A999D]"
                    >

                      <FaUser className="text-xs" />

                      <span className="text-[6px] font-black">
                        Profile
                      </span>

                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* PHONE SHADOW */}

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[75%] h-12 bg-[#08566E]/25 blur-2xl rounded-full" />

          </div>

        </div>

        {/* =====================================================
            OUTSIDE FEATURES
        ====================================================== */}

        <div className="mt-10 max-w-2xl mx-auto grid grid-cols-3 gap-2.5">

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 text-center border border-white shadow-sm">

            <FaShieldAlt className="mx-auto text-[#08566E] text-sm" />

            <p className="mt-1.5 text-[9px] font-black text-[#08566E]">
              Verified
            </p>

            <p className="text-[7px] text-[#6A888D] font-semibold">
              Professionals
            </p>

          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 text-center border border-white shadow-sm">

            <FaRoute className="mx-auto text-[#08566E] text-sm" />

            <p className="mt-1.5 text-[9px] font-black text-[#08566E]">
              Hyperlocal
            </p>

            <p className="text-[7px] text-[#6A888D] font-semibold">
              Nearby service
            </p>

          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 text-center border border-white shadow-sm">

            <FaHeadset className="mx-auto text-[#08566E] text-sm" />

            <p className="mt-1.5 text-[9px] font-black text-[#08566E]">
              Support
            </p>

            <p className="text-[7px] text-[#6A888D] font-semibold">
              Service assistance
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;