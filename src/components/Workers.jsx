import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";

function Workers({
  setSelectedWorker,
  selectedService,
  language = "en",
}) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const [workers, setWorkers] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchWorkers = () => {
      fetch(
        "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec"
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setWorkers(data);
          } else {
            setWorkers([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchWorkers();

    const interval = setInterval(() => {
      fetchWorkers();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isAvailable = (worker) => {
    return worker.status?.trim().toLowerCase() === "available";
  };

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

  let filteredWorkers = [...workers];

  if (sortBy === "rating") {
    filteredWorkers.sort(
      (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
    );
  }

  if (sortBy === "available") {
    filteredWorkers = filteredWorkers.filter((worker) =>
      isAvailable(worker)
    );
  }

  const visibleWorkers = filteredWorkers
    .filter((worker) =>
      selectedService === "All"
        ? true
        : worker.service?.toLowerCase() === selectedService.toLowerCase()
    )
    .filter((worker) =>
      worker.name?.toLowerCase().includes(search.toLowerCase()) ||
      worker.service?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <section
      id="workers"
      className="bg-[#B4DBDC] text-slate-900 py-24 px-5"
    >
      {/* BACK BUTTON */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate("/")}
          className="bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-5 py-3 rounded-xl font-bold shadow-lg transition"
        >
          ← {t.backToHome || "Back to Home"}
        </button>
      </div>

      <h2 className="text-5xl font-bold text-center text-[#08566E] mb-12">
        {t.ourWorkers || "Our Workers"}
      </h2>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder={t.searchWorkers || "Search Workers"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#E1E9E5] border border-[#8FBDBE] text-slate-900 focus:border-[#08566E] outline-none"
        />
      </div>

      <div className="max-w-xl mx-auto mb-8">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#E1E9E5] border border-[#8FBDBE] text-slate-900"
        >
          <option value="">
            {t.sortWorkers || "Sort Workers"}
          </option>

          <option value="rating">
            {t.ratingHighToLow || "Rating High → Low"}
          </option>

          <option value="available">
            {t.availableOnly || "Available Only"}
          </option>
        </select>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {visibleWorkers.length === 0 ? (
          <div className="bg-[#E1E9E5] border border-[#6FA8AA] rounded-3xl p-8 text-center">
            <p className="text-[#08566E] font-bold text-xl">
              {t.noWorkersFound || "No workers found"}
            </p>
          </div>
        ) : (
          visibleWorkers.map((worker, index) => (
            <div
              key={index}
              onClick={() => {
                if (!isAvailable(worker)) return;

                setSelectedWorker({
                  ...worker,
                  status: worker.status,
                });
              }}
              className={`bg-[#8FBDBE] border border-[#6FA6A8] rounded-3xl p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between transition
                ${
                  isAvailable(worker)
                    ? "hover:border-[#08566E] cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={worker.image || "https://via.placeholder.com/150"}
                  alt={worker.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                  className="w-16 h-16 rounded-2xl object-cover"
                />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xl text-[#08566E]">
                      {worker.name}
                    </h3>
                  </div>

                  <p className="text-[#0A5E75]">
                    {getServiceText(worker.service)}
                  </p>

                  {worker.CertificateLink && (
                    <a
                      href={worker.CertificateLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-[#08566E] text-xs font-semibold hover:underline"
                    >
                      📜 {t.verifiedSkillCertificate || "Verified Skill Certificate"}
                    </a>
                  )}

                  <div className="flex flex-wrap gap-3 mt-2 text-sm">
                    <span className="text-yellow-400">
                      ⭐ {worker.rating || "4.8"}
                    </span>

                    <span className="text-slate-700">
                      📍 {worker.location || t.localArea || "Local Area"}
                    </span>

                    <span className="text-green-500 font-semibold">
                      🛡️ {worker.TrustScore || "90"}% {t.trust || "Trust"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <h3 className="text-xl font-bold text-[#08566E]">
                  ✔ {t.verifiedProfessional || "Verified Professional"}
                </h3>

                <p className="text-[#E1E9E5] text-sm font-medium">
                  {t.inspectionBasedPricing || "Inspection Based Pricing"}
                </p>

                <div className="mt-2">
                  {isAvailable(worker) ? (
                    <span className="bg-[#08566E] text-[#E1E9E5] px-3 py-1 rounded-full text-sm">
                      {t.available || "Available"}
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      {t.busy || "Busy"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Workers;