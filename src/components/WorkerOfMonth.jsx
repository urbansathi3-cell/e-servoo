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

  const [bestWorker, setBestWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL =
    "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

  const text = {
    badge:
      language === "hi"
        ? "महीने का सर्वश्रेष्ठ वर्कर"
        : language === "od"
          ? "ମାସର ସର୍ବଶ୍ରେଷ୍ଠ worker"
          : "Worker of the Month",

    title:
      language === "hi"
        ? "E-SERVOO Top Performer"
        : language === "od"
          ? "E-SERVOO Top Performer"
          : "E-SERVOO Top Performer",

    subtitle:
      language === "hi"
        ? "Rating, trust score और availability के आधार पर चुना गया best worker."
        : language === "od"
          ? "Rating, trust score ଏବଂ availability ଆଧାରରେ ଚୟନ ହୋଇଥିବା best worker."
          : "Selected using rating, trust score, and service performance.",

    loading:
      language === "hi"
        ? "Top worker load हो रहा है..."
        : language === "od"
          ? "Top worker load ହେଉଛି..."
          : "Loading top worker...",

    noData:
      language === "hi"
        ? "Top worker data जल्द ही update होगा"
        : language === "od"
          ? "Top worker data ଶୀଘ୍ର update ହେବ"
          : "Top worker data will update soon",

    verified:
      t.verifiedProfessional || "Verified Professional",

    rating: t.ratingLabel || "Rating",

    trust: t.trust || "Trust",

    area: t.localArea || "Area",

    certificate:
      t.verifiedSkillCertificate || "Verified Skill Certificate",
  };

  const getValue = (obj, keys, fallback = "") => {
    for (const key of keys) {
      if (obj?.[key] !== undefined && obj?.[key] !== null && obj?.[key] !== "") {
        return obj[key];
      }
    }

    return fallback;
  };

  const toNumber = (value, fallback = 0) => {
    const num = parseFloat(String(value || "").replace(/[^\d.]/g, ""));

    if (Number.isNaN(num)) {
      return fallback;
    }

    return num;
  };

  const normalizeWorker = (worker) => {
    return {
      id: getValue(worker, ["WorkerId", "WorkerID", "Worker id", "id"], ""),
      name: getValue(worker, ["name", "Name"], ""),
      service: getValue(worker, ["service", "Service"], ""),
      rating: toNumber(getValue(worker, ["rating", "Rating"], 0), 0),
      trustScore: toNumber(
        getValue(worker, ["TrustScore", "trustScore", "Trust Score"], 0),
        0
      ),
      location: getValue(worker, ["location", "Location"], "Local Area"),
      image: getValue(worker, ["image", "Image"], ""),
      status: getValue(worker, ["status", "Status"], "Available"),
      verified: getValue(worker, ["Verified", "verified"], "Yes"),
      certificate: getValue(
        worker,
        ["CertificateLink", "certificateLink", "Certificate Link"],
        ""
      ),
    };
  };

  const getServiceText = (service) => {
    const serviceName = String(service || "").trim().toLowerCase();

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

    return service || "Service Expert";
  };

  useEffect(() => {
    const fetchTopWorker = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}?nocache=${Date.now()}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          setBestWorker(null);
          setLoading(false);
          return;
        }

        const cleanWorkers = data
          .map((worker) => normalizeWorker(worker))
          .filter((worker) => worker.name || worker.service);

        if (cleanWorkers.length === 0) {
          setBestWorker(null);
          setLoading(false);
          return;
        }

        const sortedWorkers = cleanWorkers.sort((a, b) => {
          const scoreA = a.rating * 20 + a.trustScore;
          const scoreB = b.rating * 20 + b.trustScore;

          return scoreB - scoreA;
        });

        setBestWorker(sortedWorkers[0]);
      } catch (error) {
        console.log("Worker of Month Error:", error);
        setBestWorker(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopWorker();
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/35 backdrop-blur-xl border border-white/60 rounded-[36px] p-7 md:p-10 shadow-2xl animate-pulse">
            <div className="h-8 w-56 bg-[#08566E]/20 rounded-full mb-6"></div>

            <div className="grid md:grid-cols-[220px_1fr] gap-8 items-center">
              <div className="w-44 h-44 rounded-[36px] bg-[#08566E]/20 mx-auto"></div>

              <div>
                <div className="h-10 w-72 bg-[#08566E]/20 rounded-full"></div>
                <div className="h-5 w-48 bg-[#08566E]/20 rounded-full mt-4"></div>
                <div className="h-5 w-full max-w-xl bg-[#08566E]/20 rounded-full mt-5"></div>

                <div className="grid grid-cols-3 gap-3 mt-7">
                  <div className="h-24 bg-[#08566E]/15 rounded-2xl"></div>
                  <div className="h-24 bg-[#08566E]/15 rounded-2xl"></div>
                  <div className="h-24 bg-[#08566E]/15 rounded-2xl"></div>
                </div>

                <div className="h-12 w-full bg-[#08566E]/20 rounded-2xl mt-7"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const worker = bestWorker;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] py-16 px-5">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#08566E]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#6FA8AA]/35 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-9">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2 rounded-full shadow-lg text-[#08566E] font-extrabold mb-4">
            <FaTrophy className="text-yellow-500" />
            {text.badge}
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#08566E]">
            {text.title}
          </h2>

          <p className="text-[#08566E]/75 mt-3 font-semibold max-w-2xl mx-auto">
            {text.subtitle}
          </p>
        </div>

        {!worker ? (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[36px] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center text-3xl shadow-xl">
              <FaTrophy />
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-[#08566E] mt-6">
              {text.noData}
            </h3>

            <p className="text-[#08566E]/70 font-semibold mt-2">
              Worker records are loading from E-SERVOO database.
            </p>
          </div>
        ) : (
          <div className="animate-workerSlide bg-white/40 backdrop-blur-xl border border-white/60 rounded-[36px] p-7 md:p-10 shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-[220px_1fr] gap-8 items-center">
              <div className="relative mx-auto">
                <div className="absolute -inset-3 bg-[#08566E]/20 rounded-[42px] blur-xl"></div>

                <img
                  src={worker.image || "https://via.placeholder.com/200"}
                  alt={worker.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                  className="relative w-44 h-44 rounded-[36px] object-cover border-4 border-[#E1E9E5] shadow-2xl"
                />

                <div className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl bg-yellow-400 text-[#08566E] flex items-center justify-center text-2xl shadow-xl">
                  <FaTrophy />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-[#08566E] text-[#E1E9E5] px-4 py-2 rounded-full text-sm font-extrabold shadow-md">
                    #{worker.id || "TOP"}
                  </span>

                  <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-extrabold shadow-md flex items-center gap-2">
                    <FaUserCheck />
                    {text.verified}
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-black text-[#08566E] leading-tight">
                  {worker.name}
                </h3>

                <p className="text-[#0A5E75] font-extrabold text-xl mt-2">
                  {getServiceText(worker.service)}
                </p>

                <div className="grid sm:grid-cols-3 gap-4 mt-7">
                  <div className="bg-[#E1E9E5]/90 rounded-3xl p-5 text-center shadow-md">
                    <p className="text-[#6FA8AA] font-extrabold text-sm flex justify-center items-center gap-2">
                      <FaStar className="text-yellow-500" />
                      {text.rating}
                    </p>

                    <p className="text-[#08566E] text-2xl font-black mt-1">
                      {worker.rating || "4.8"}
                    </p>
                  </div>

                  <div className="bg-[#E1E9E5]/90 rounded-3xl p-5 text-center shadow-md">
                    <p className="text-[#6FA8AA] font-extrabold text-sm flex justify-center items-center gap-2">
                      <FaShieldAlt />
                      {text.trust}
                    </p>

                    <p className="text-[#08566E] text-2xl font-black mt-1">
                      {worker.trustScore || "90"}%
                    </p>
                  </div>

                  <div className="bg-[#E1E9E5]/90 rounded-3xl p-5 text-center shadow-md">
                    <p className="text-[#6FA8AA] font-extrabold text-sm flex justify-center items-center gap-2">
                      <FaMapMarkerAlt />
                      {text.area}
                    </p>

                    <p className="text-[#08566E] text-lg font-black mt-1 truncate">
                      {worker.location || "Local Area"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 bg-[#08566E] rounded-3xl p-5 shadow-xl">
                  <p className="text-[#E1E9E5] font-black text-lg">
                    ✔ {text.verified}
                  </p>

                  <p className="text-[#B4DBDC] font-semibold mt-1">
                    High trust score, strong service rating and verified worker profile.
                  </p>

                  {worker.certificate && (
                    <a
                      href={worker.certificate}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-3 text-[#E1E9E5] font-extrabold underline"
                    >
                      📜 {text.certificate}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default WorkerOfMonth;