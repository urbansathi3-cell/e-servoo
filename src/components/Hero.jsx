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
  FaClipboardList,
  FaGift,
  FaUser,
  FaHome,
} from "react-icons/fa";

function Hero({ language = "en" }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const text = {
    badge: t.heroBadge || "Smart Local Services Hub",

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

    workers:
      language === "hi"
        ? "Professionals"
        : language === "od"
          ? "Professionals"
          : "Professionals",

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

  return (
    <section className="relative overflow-hidden min-h-screen bg-[#DDE8E8] px-4 pt-20 pb-28 sm:px-6">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#08566E]/10 blur-3xl" />

        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#6FA8AA]/25 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-white/50 blur-3xl" />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ===================================================
            DESKTOP INTRO
        ==================================================== */}

        <div className="text-center max-w-3xl mx-auto mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 backdrop-blur-xl border border-white shadow-lg text-[#08566E] text-xs sm:text-sm font-black">
            <FaBolt />
            {text.badge}
          </div>

          <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#08566E]">
            {text.title}
          </h1>

          <p className="mt-3 text-lg sm:text-2xl font-black text-[#043A4A]">
            {text.subtitle}
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#315D67] font-semibold leading-relaxed">
            {text.description}
          </p>

        </div>

        {/* ===================================================
            PHONE PREVIEW AREA
        ==================================================== */}

        <div className="flex justify-center">

          {/* PHONE OUTER SHELL */}

          <div className="relative w-full max-w-[430px]">

            {/* Floating Verified Badge */}

            <div className="absolute -top-5 -left-3 sm:-left-8 z-40 bg-white/95 backdrop-blur-xl border border-white rounded-2xl px-3 py-2 shadow-[0_15px_40px_rgba(8,86,110,0.20)]">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-[#08566E] text-white flex items-center justify-center">
                  <FaUserCheck />
                </div>

                <div>
                  <p className="text-[11px] font-black text-[#08566E]">
                    VERIFIED
                  </p>

                  <p className="text-[10px] font-bold text-[#6FA8AA]">
                    Professionals
                  </p>
                </div>

              </div>

            </div>

            {/* Floating Live Badge */}

            <div className="absolute top-28 -right-3 sm:-right-8 z-40 bg-[#08566E] text-white rounded-2xl px-3 py-2 shadow-xl">

              <div className="flex items-center gap-2">

                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-green-300 animate-ping" />
                  <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-green-400" />
                </span>

                <span className="text-[10px] font-black">
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
                max-h-[760px]
                rounded-[42px]
                sm:rounded-[50px]
                bg-[#F8FBFA]
                border-[7px]
                border-[#043A4A]
                shadow-[0_35px_100px_rgba(8,86,110,0.35)]
                overflow-hidden
              "
            >

              {/* Phone Inner */}

              <div className="absolute inset-0 bg-[#F7FAF9] overflow-hidden">

                {/* ===========================================
                    TOP APP BAR
                ============================================ */}

                <div className="relative z-20 px-5 pt-5 pb-3">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[10px] text-[#6FA8AA] font-black uppercase tracking-widest">
                        Welcome to
                      </p>

                      <h2 className="text-xl sm:text-2xl font-black text-[#08566E]">
                        E-SERVOO
                      </h2>

                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-white flex items-center justify-center shadow-lg">
                      <FaUser />
                    </div>

                  </div>

                </div>

                {/* ===========================================
                    LOCATION BAR
                ============================================ */}

                <div className="px-5">

                  <button
                    type="button"
                    onClick={() => navigate("/services")}
                    className="w-full flex items-center gap-3 bg-white border border-[#DCE9E8] rounded-2xl px-4 py-3 shadow-sm text-left"
                  >

                    <div className="w-9 h-9 rounded-xl bg-[#E5F3F2] flex items-center justify-center text-[#08566E]">
                      <FaMapMarkerAlt />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] uppercase tracking-wider text-[#8AA7AA] font-black">
                        Service Location
                      </p>

                      <p className="text-xs sm:text-sm text-[#043A4A] font-black truncate">
                        Select your location
                      </p>

                    </div>

                    <FaArrowRight className="text-[#6FA8AA] text-xs" />

                  </button>

                </div>

                {/* ===========================================
                    HERO CARD
                ============================================ */}

                <div className="px-5 mt-4">

                  <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] p-5 shadow-xl">

                    <div className="absolute -top-20 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#9ECFD0]/20 blur-3xl" />

                    <div className="relative">

                      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[#E1E9E5] text-[9px] font-black">
                        <FaBolt />
                        SMART SERVICE
                      </div>

                      <h3 className="mt-4 text-2xl sm:text-3xl font-black text-white leading-tight">
                        Service when
                        <br />
                        you need it.
                      </h3>

                      <p className="mt-2 text-xs text-[#B4DBDC] font-semibold leading-relaxed">
                        Tell us your problem. E-SERVOO helps connect you with the right professional.
                      </p>

                      <button
                        type="button"
                        onClick={handleBookNow}
                        className="mt-5 w-full bg-[#E1E9E5] text-[#08566E] rounded-2xl py-3.5 font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition"
                      >
                        <FaBolt />
                        {text.book}
                        <FaArrowRight className="text-xs" />
                      </button>

                    </div>

                  </div>

                </div>

                {/* ===========================================
                    QUICK NAVIGATION
                ============================================ */}

                <div className="px-5 mt-5">

                  <div className="flex items-center justify-between">

                    <h3 className="text-sm font-black text-[#043A4A]">
                      Quick Access
                    </h3>

                    <span className="text-[9px] text-[#6FA8AA] font-black">
                      EXPLORE
                    </span>

                  </div>

                  <div className="grid grid-cols-3 gap-2.5 mt-3">

                    <button
                      type="button"
                      onClick={handleServices}
                      className="bg-white border border-[#E0EBEA] rounded-2xl p-3 shadow-sm active:scale-95 transition"
                    >
                      <div className="w-9 h-9 mx-auto rounded-xl bg-[#E5F3F2] text-[#08566E] flex items-center justify-center">
                        <FaTools />
                      </div>

                      <p className="mt-2 text-[9px] font-black text-[#08566E]">
                        Services
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={handleBookings}
                      className="bg-white border border-[#E0EBEA] rounded-2xl p-3 shadow-sm active:scale-95 transition"
                    >
                      <div className="w-9 h-9 mx-auto rounded-xl bg-[#E5F3F2] text-[#08566E] flex items-center justify-center">
                        <FaClipboardList />
                      </div>

                      <p className="mt-2 text-[9px] font-black text-[#08566E]">
                        Bookings
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={handleRewards}
                      className="bg-white border border-[#E0EBEA] rounded-2xl p-3 shadow-sm active:scale-95 transition"
                    >
                      <div className="w-9 h-9 mx-auto rounded-xl bg-[#FFF2DE] text-[#D98520] flex items-center justify-center">
                        <FaGift />
                      </div>

                      <p className="mt-2 text-[9px] font-black text-[#08566E]">
                        Rewards
                      </p>
                    </button>

                  </div>

                </div>

                {/* ===========================================
                    SMART MATCH CARD
                ============================================ */}

                <div className="px-5 mt-5">

                  <div className="flex items-center justify-between mb-3">

                    <h3 className="text-sm font-black text-[#043A4A]">
                      Smart Assignment
                    </h3>

                    <span className="text-[9px] font-black text-green-600">
                      ACTIVE
                    </span>

                  </div>

                  <div className="bg-white rounded-[24px] border border-[#DCE9E8] p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#08566E] to-[#6FA8AA] flex items-center justify-center text-white text-lg shrink-0">

                        <FaTools />

                        <span className="absolute -right-1 -bottom-1 w-5 h-5 bg-green-500 text-white rounded-full border-2 border-white flex items-center justify-center text-[8px]">
                          ✓
                        </span>

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-[9px] text-[#6FA8AA] font-black uppercase">
                          Best Match
                        </p>

                        <p className="text-sm font-black text-[#08566E] truncate">
                          Verified Professional
                        </p>

                        <div className="flex items-center gap-2 mt-1">

                          <span className="flex items-center gap-1 text-[9px] font-bold text-[#777]">
                            <FaStar className="text-yellow-500" />
                            4.9
                          </span>

                          <span className="text-[#CCC]">
                            •
                          </span>

                          <span className="text-[9px] font-bold text-[#777]">
                            Nearby
                          </span>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-[9px] text-[#999] font-bold">
                          Trust
                        </p>

                        <p className="text-sm font-black text-[#08566E]">
                          96%
                        </p>

                      </div>

                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">

                      <div className="rounded-xl bg-[#F2F8F7] p-2 text-center">
                        <FaMapMarkerAlt className="mx-auto text-[#08566E] text-xs" />
                        <p className="text-[8px] font-black text-[#6FA8AA] mt-1">
                          Nearby
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#F2F8F7] p-2 text-center">
                        <FaClock className="mx-auto text-[#08566E] text-xs" />
                        <p className="text-[8px] font-black text-[#6FA8AA] mt-1">
                          Quick ETA
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#F2F8F7] p-2 text-center">
                        <FaShieldAlt className="mx-auto text-[#08566E] text-xs" />
                        <p className="text-[8px] font-black text-[#6FA8AA] mt-1">
                          Verified
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* ===========================================
                    TRUST STRIP
                ============================================ */}

                <div className="px-5 mt-5">

                  <div className="rounded-2xl bg-[#E9F4F3] border border-[#CFE4E2] p-3 flex items-center gap-3">

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

                {/* ===========================================
                    3-LINE / COMPACT NAVIGATION
                ============================================ */}

                <div className="px-5 mt-5">

                  <div className="grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={handleServices}
                      className="flex items-center gap-2 bg-white border border-[#E1EBEA] rounded-xl px-3 py-2.5 text-left"
                    >
                      <FaTools className="text-[#08566E] text-xs" />
                      <span className="text-[9px] font-black text-[#315D67]">
                        {text.services}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBookings}
                      className="flex items-center gap-2 bg-white border border-[#E1EBEA] rounded-xl px-3 py-2.5 text-left"
                    >
                      <FaClipboardList className="text-[#08566E] text-xs" />
                      <span className="text-[9px] font-black text-[#315D67]">
                        {text.bookings}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRewards}
                      className="flex items-center gap-2 bg-white border border-[#E1EBEA] rounded-xl px-3 py-2.5 text-left"
                    >
                      <FaGift className="text-[#D98520] text-xs" />
                      <span className="text-[9px] font-black text-[#315D67]">
                        {text.rewards}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProfile}
                      className="flex items-center gap-2 bg-white border border-[#E1EBEA] rounded-xl px-3 py-2.5 text-left"
                    >
                      <FaUser className="text-[#08566E] text-xs" />
                      <span className="text-[9px] font-black text-[#315D67]">
                        {text.profile}
                      </span>
                    </button>

                  </div>

                </div>

                {/* ===========================================
                    PHONE BOTTOM NAV
                ============================================ */}

                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-3 bg-white/90 backdrop-blur-xl border-t border-[#E4ECEB]">

                  <div className="flex items-center justify-between">

                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="flex flex-col items-center gap-1 w-12 text-[#08566E]"
                    >
                      <FaHome className="text-sm" />
                      <span className="text-[7px] font-black">
                        Home
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleServices}
                      className="flex flex-col items-center gap-1 w-12 text-[#6FA8AA]"
                    >
                      <FaTools className="text-sm" />
                      <span className="text-[7px] font-black">
                        Services
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBookNow}
                      className="relative -mt-8 w-14 h-14 rounded-full bg-[#08566E] border-[5px] border-[#F7FAF9] shadow-[0_8px_25px_rgba(8,86,110,0.35)] text-white flex items-center justify-center"
                    >
                      <FaBolt />
                    </button>

                    <button
                      type="button"
                      onClick={handleBookings}
                      className="flex flex-col items-center gap-1 w-12 text-[#6FA8AA]"
                    >
                      <FaClipboardList className="text-sm" />
                      <span className="text-[7px] font-black">
                        Bookings
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProfile}
                      className="flex flex-col items-center gap-1 w-12 text-[#6FA8AA]"
                    >
                      <FaUser className="text-sm" />
                      <span className="text-[7px] font-black">
                        Profile
                      </span>
                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* Phone shadow */}

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[75%] h-12 bg-[#08566E]/20 blur-2xl rounded-full" />

          </div>

        </div>

        {/* ===================================================
            OUTSIDE QUICK FEATURES
        ==================================================== */}

        <div className="mt-12 max-w-3xl mx-auto grid grid-cols-3 gap-3">

          <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-4 text-center border border-white shadow-sm">

            <FaShieldAlt className="mx-auto text-[#08566E]" />

            <p className="mt-2 text-xs font-black text-[#08566E]">
              Verified
            </p>

            <p className="text-[9px] text-[#6A888D] font-semibold mt-1">
              Professionals
            </p>

          </div>

          <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-4 text-center border border-white shadow-sm">

            <FaRoute className="mx-auto text-[#08566E]" />

            <p className="mt-2 text-xs font-black text-[#08566E]">
              Hyperlocal
            </p>

            <p className="text-[9px] text-[#6A888D] font-semibold mt-1">
              Nearby service
            </p>

          </div>

          <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-4 text-center border border-white shadow-sm">

            <FaHeadset className="mx-auto text-[#08566E]" />

            <p className="mt-2 text-xs font-black text-[#08566E]">
              Support
            </p>

            <p className="text-[9px] text-[#6A888D] font-semibold mt-1">
              Service assistance
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;