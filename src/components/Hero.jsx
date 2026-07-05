import { translations } from "../translations";
import {
  FaBolt,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaStar,
  FaTools,
  FaUserCheck,
} from "react-icons/fa";

function Hero({ language }) {
  const t = translations[language] || translations.en;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] min-h-[82vh] flex items-center px-5 pt-20 pb-16">

      {/* BACKGROUND BLOBS */}
      <div className="absolute top-20 left-[-80px] w-72 h-72 bg-[#08566E]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-[-90px] w-80 h-80 bg-[#6FA8AA]/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/30 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">

        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">

          <div className="inline-flex items-center gap-2 bg-white/35 backdrop-blur-xl border border-white/50 px-5 py-2 rounded-full shadow-lg text-[#08566E] font-extrabold mb-6">
            <FaBolt className="text-[#08566E]" />
            Smart Local Services Hub
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#08566E] leading-tight">
            E-SERVOO
            <span className="block text-[#0A6F78]">
              Services Near You
            </span>
          </h1>

          <p className="mt-6 text-2xl md:text-3xl font-extrabold text-[#08566E]">
            {t.heroTitle}
          </p>

          <p className="mt-5 text-lg md:text-xl text-[#08566E]/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {t.heroDescription}
          </p>

          {/* TRUST POINTS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-7">
            <div className="bg-white/35 backdrop-blur-xl border border-white/50 px-4 py-2 rounded-full text-[#08566E] font-bold flex items-center gap-2">
              <FaShieldAlt />
              Verified Workers
            </div>

            <div className="bg-white/35 backdrop-blur-xl border border-white/50 px-4 py-2 rounded-full text-[#08566E] font-bold flex items-center gap-2">
              <FaMapMarkerAlt />
              Hyperlocal
            </div>

            <div className="bg-white/35 backdrop-blur-xl border border-white/50 px-4 py-2 rounded-full text-[#08566E] font-bold flex items-center gap-2">
              <FaStar />
              Trusted Service
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-5 mt-10">

            <a
              href="#workers"
              className="group relative overflow-hidden bg-[#08566E] px-9 py-4 rounded-full text-[#E1E9E5] font-extrabold shadow-2xl hover:bg-[#06485C] transition hover:-translate-y-1"
            >
              <span className="relative z-10">
                ⚡ {t.bookProfessional}
              </span>
            </a>

            <a
              href="#services"
              className="bg-white/35 backdrop-blur-xl border border-white/60 px-9 py-4 rounded-full text-[#08566E] font-extrabold shadow-xl hover:bg-[#08566E] hover:text-[#E1E9E5] transition hover:-translate-y-1"
            >
              {t.exploreServices}
            </a>

          </div>

          {/* MINI STATS */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl mx-auto lg:mx-0">
            <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">
                40+
              </h3>
              <p className="text-sm font-bold text-[#08566E]/75">
                Workers
              </p>
            </div>

            <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">
                12+
              </h3>
              <p className="text-sm font-bold text-[#08566E]/75">
                Services
              </p>
            </div>

            <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-lg">
              <h3 className="text-3xl font-black text-[#08566E]">
                24/7
              </h3>
              <p className="text-sm font-bold text-[#08566E]/75">
                Support
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT VISUAL CARD */}
        <div className="relative hidden lg:block">

          <div className="absolute -top-8 -left-8 bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-2xl animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#08566E] rounded-2xl flex items-center justify-center text-[#E1E9E5]">
                <FaUserCheck />
              </div>

              <div>
                <p className="text-[#08566E] font-black">
                  Verified Expert
                </p>
                <p className="text-[#08566E]/70 text-sm font-bold">
                  Assigned instantly
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 -right-5 bg-[#08566E] rounded-3xl p-5 shadow-2xl text-[#E1E9E5] z-20">
            <p className="font-black text-xl">
              ⭐ 4.9 Rating
            </p>
            <p className="text-[#B4DBDC] text-sm">
              Trusted by local users
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-2xl border border-white/60 rounded-[40px] shadow-2xl p-8">

            <div className="bg-[#08566E] rounded-[32px] p-7 shadow-xl">

              <div className="flex items-center justify-between mb-7">
                <div>
                  <p className="text-[#B4DBDC] font-bold text-sm">
                    Live Booking
                  </p>

                  <h2 className="text-3xl font-black text-[#E1E9E5]">
                    Electrician
                  </h2>
                </div>

                <div className="w-16 h-16 bg-[#E1E9E5] rounded-2xl flex items-center justify-center text-[#08566E] text-3xl">
                  <FaTools />
                </div>
              </div>

              <div className="space-y-4">

                <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                  <p className="text-[#6FA8AA] text-sm font-bold">
                    Issue
                  </p>
                  <p className="text-[#08566E] font-extrabold">
                    Fan not working
                  </p>
                </div>

                <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                  <p className="text-[#6FA8AA] text-sm font-bold">
                    Service Location
                  </p>
                  <p className="text-[#08566E] font-extrabold">
                    Near customer address
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#6FA8AA] rounded-2xl p-4 text-center">
                    <p className="text-[#E1E9E5] text-sm">
                      Trust Score
                    </p>
                    <p className="text-[#08566E] text-2xl font-black">
                      96%
                    </p>
                  </div>

                  <div className="bg-[#6FA8AA] rounded-2xl p-4 text-center">
                    <p className="text-[#E1E9E5] text-sm">
                      Status
                    </p>
                    <p className="text-[#08566E] text-2xl font-black">
                      Active
                    </p>
                  </div>
                </div>

                <button className="w-full bg-[#E1E9E5] text-[#08566E] py-4 rounded-2xl font-black shadow-lg">
                  Smart Match Found
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;