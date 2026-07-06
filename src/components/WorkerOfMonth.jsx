import { useEffect, useState } from "react";
import { translations } from "../translations";
import {
  FaStar,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaUserCheck,
} from "react-icons/fa";

function WorkerOfMonth({ language = "en" }) {
  const t = translations[language] || translations.en;

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  const getText = {
    badge:
      language === "hi"
        ? "महीने का बेस्ट प्रोफेशनल"
        : language === "od"
          ? "ମାସର ଶ୍ରେଷ୍ଠ ପ୍ରୋଫେସନାଲ୍"
          : "Best Professional of the Month",

    title:
      language === "hi"
        ? "Worker of the Month"
        : language === "od"
          ? "ମାସର ଶ୍ରେଷ୍ଠ କର୍ମଚାରୀ"
          : "Worker of the Month",

    subtitle:
      language === "hi"
        ? "सबसे अच्छा rating और trust score वाला verified worker"
        : language === "od"
          ? "ସର୍ବୋତ୍ତମ rating ଏବଂ trust score ଥିବା verified worker"
          : "Top verified worker based on rating and trust score",

    topRated:
      language === "hi"
        ? "Top Rated"
        : language === "od"
          ? "Top Rated"
          : "Top Rated",

    verified:
      language === "hi"
        ? "Verified Professional"
        : language === "od"
          ? "Verified Professional"
          : "Verified Professional",

    localExpert:
      language === "hi"
        ? "Local Expert"
        : language === "od"
          ? "Local Expert"
          : "Local Expert",

    performance:
      language === "hi"
        ? "Performance Score"
        : language === "od"
          ? "Performance Score"
          : "Performance Score",
  };

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?nocache=" +
        Date.now()
    )
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setLoading(false);
          return;
        }

        const bestWorker = [...data]
          .filter((item) => item.name)
          .sort((a, b) => {
            const ratingA = Number(a.rating || 0);
            const ratingB = Number(b.rating || 0);

            const trustA = Number(a.TrustScore || 0);
            const trustB = Number(b.TrustScore || 0);

            const scoreA = ratingA * 20 + trustA;
            const scoreB = ratingB * 20 + trustB;

            return scoreB - scoreA;
          })[0];

        setWorker(bestWorker || null);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Worker of Month Error:", error);
        setLoading(false);
      });
  }, []);

  const getServiceText = (service) => {
    const serviceName = service?.trim().toLowerCase();

    if (serviceName === "electrician") return t.electrician || service;
    if (serviceName === "plumber") return t.plumber || service;
    if (serviceName === "carpenter") return t.carpenter || service;
    if (serviceName === "cleaner") return t.cleaner || service;
    if (serviceName === "cook") return t.cook || service;
    if (serviceName === "painter") return t.painter || service;
    if (serviceName === "ac repair") return t.acRepair || service;
    if (serviceName === "home tutor") return t.tutor || service;
    if (serviceName === "appliance repair") return t.applianceRepair || service;
    if (serviceName === "cctv service") return t.cctvService || service;

    return service;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-white/35 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl animate-pulse">
            <div className="h-8 w-56 bg-[#08566E]/20 rounded-full mx-auto"></div>
            <div className="h-24 w-24 bg-[#08566E]/20 rounded-full mx-auto mt-6"></div>
            <div className="h-6 w-40 bg-[#08566E]/20 rounded-full mx-auto mt-6"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!worker) return null;

  const rating = worker.rating || "4.8";
  const trustScore = worker.TrustScore || "90";
  const performanceScore = Math.min(
    100,
    Math.round(Number(rating || 0) * 10 + Number(trustScore || 0) / 2)
  );

  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0]">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#08566E]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#6FA8AA]/35 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-5">

        {/* HEADING */}
        <div className="text-center mb-9">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2 rounded-full shadow-lg text-[#08566E] font-extrabold mb-4">
            <FaTrophy />
            {getText.badge}
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#08566E]">
            🏆 {getText.title}
          </h2>

          <p className="text-[#08566E]/75 font-semibold mt-3">
            {getText.subtitle}
          </p>
        </div>

        {/* SPOTLIGHT CARD */}
        <div className="relative max-w-4xl mx-auto bg-white/35 backdrop-blur-xl border border-white/60 rounded-[36px] shadow-2xl overflow-hidden">

          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-[#08566E] via-[#0A6F78] to-[#6FA8AA]"></div>

          <div className="relative p-6 md:p-8 grid md:grid-cols-[0.8fr_1.2fr] gap-7 items-center">

            {/* LEFT PROFILE */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={worker.image || "https://via.placeholder.com/150"}
                  alt={worker.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] object-cover border-4 border-[#E1E9E5] shadow-2xl mx-auto"
                />

                <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-[#E1E9E5] rounded-2xl flex items-center justify-center shadow-xl text-[#08566E] text-2xl">
                  <FaTrophy />
                </div>
              </div>

              <h3 className="text-3xl font-black text-[#08566E] mt-7">
                {worker.name}
              </h3>

              <p className="text-[#0A6F78] font-extrabold mt-1">
                {getServiceText(worker.service)}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 bg-[#08566E] text-[#E1E9E5] px-4 py-2 rounded-full font-extrabold shadow-lg">
                <FaUserCheck />
                {getText.verified}
              </div>
            </div>

            {/* RIGHT DETAILS */}
            <div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#E1E9E5]/90 rounded-3xl p-4 text-center shadow-md">
                  <FaStar className="text-[#08566E] mx-auto text-2xl" />

                  <p className="text-xs text-[#6FA8AA] font-bold mt-2">
                    Rating
                  </p>

                  <h4 className="text-2xl font-black text-[#08566E]">
                    {rating}
                  </h4>
                </div>

                <div className="bg-[#E1E9E5]/90 rounded-3xl p-4 text-center shadow-md">
                  <FaShieldAlt className="text-[#08566E] mx-auto text-2xl" />

                  <p className="text-xs text-[#6FA8AA] font-bold mt-2">
                    {t.trust || "Trust"}
                  </p>

                  <h4 className="text-2xl font-black text-[#08566E]">
                    {trustScore}%
                  </h4>
                </div>

                <div className="bg-[#E1E9E5]/90 rounded-3xl p-4 text-center shadow-md">
                  <FaMapMarkerAlt className="text-[#08566E] mx-auto text-2xl" />

                  <p className="text-xs text-[#6FA8AA] font-bold mt-2">
                    Area
                  </p>

                  <h4 className="text-lg font-black text-[#08566E] truncate">
                    {worker.location || t.localArea || "Local"}
                  </h4>
                </div>
              </div>

              {/* PERFORMANCE BAR */}
              <div className="mt-6 bg-[#08566E] rounded-[28px] p-5 shadow-xl">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[#E1E9E5] font-extrabold">
                    {getText.performance}
                  </p>

                  <p className="text-[#B4DBDC] font-black">
                    {performanceScore}%
                  </p>
                </div>

                <div className="h-3 bg-[#E1E9E5]/25 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E1E9E5] to-[#9ECFD0] rounded-full"
                    style={{
                      width: `${performanceScore}%`,
                    }}
                  ></div>
                </div>

                <p className="text-[#B4DBDC] text-sm font-semibold mt-4">
                  ⭐ {getText.topRated} • 🛡️ {getText.localExpert} • ⚡ Fast Service
                </p>
              </div>

              {worker.CertificateLink && (
                <a
                  href={worker.CertificateLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-block text-[#08566E] font-extrabold underline hover:text-[#06485C]"
                >
                  📜 {t.verifiedSkillCertificate || "Verified Skill Certificate"}
                </a>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default WorkerOfMonth;