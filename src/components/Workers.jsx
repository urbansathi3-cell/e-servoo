import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";

function Workers({
  setSelectedWorker,
  selectedService = "All",
  language = "en",
}) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const [workers, setWorkers] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [activeService, setActiveService] = useState(selectedService || "All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveService(selectedService || "All");
  }, [selectedService]);

  useEffect(() => {
    const fetchWorkers = (showLoader = false) => {
      if (showLoader) {
        setLoading(true);
      }

      fetch(
        "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?nocache=" +
          Date.now()
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setWorkers(data);
          } else {
            setWorkers([]);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setWorkers([]);
          setLoading(false);
        });
    };

    fetchWorkers(true);

    const interval = setInterval(() => {
      fetchWorkers(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const serviceFilters = [
    "All",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Cleaner",
    "Cook",
    "Painter",
    "AC Repair",
    "Home Tutor",
    "Appliance Repair",
    "CCTV Service",
  ];

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

  const getFilterText = (service) => {
    if (service === "All") return t.all || "All";
    return getServiceText(service);
  };

  let filteredWorkers = [...workers];

  if (sortBy === "rating") {
    filteredWorkers.sort(
      (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
    );
  }

  if (sortBy === "available") {
    filteredWorkers = filteredWorkers.filter((worker) => isAvailable(worker));
  }

  const visibleWorkers = filteredWorkers
    .filter((worker) =>
      activeService === "All"
        ? true
        : worker.service?.trim().toLowerCase() ===
          activeService.trim().toLowerCase()
    )
    .filter((worker) =>
      worker.name?.toLowerCase().includes(search.toLowerCase()) ||
      worker.service?.toLowerCase().includes(search.toLowerCase()) ||
      worker.location?.toLowerCase().includes(search.toLowerCase())
    );

  const WorkerSkeleton = () => {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/35 backdrop-blur-xl shadow-xl animate-pulse">
        <div className="absolute top-0 left-0 right-0 h-24 bg-[#08566E]/30"></div>

        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="w-20 h-20 rounded-3xl bg-[#08566E]/20 border-4 border-[#E1E9E5]"></div>

            <div className="h-7 w-24 rounded-full bg-[#08566E]/20"></div>
          </div>

          <div className="mt-5">
            <div className="h-7 w-44 rounded-full bg-[#08566E]/20"></div>
            <div className="h-4 w-28 rounded-full bg-[#08566E]/20 mt-3"></div>
            <div className="h-4 w-52 rounded-full bg-[#08566E]/20 mt-4"></div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="h-20 rounded-2xl bg-[#08566E]/15"></div>
            <div className="h-20 rounded-2xl bg-[#08566E]/15"></div>
            <div className="h-20 rounded-2xl bg-[#08566E]/15"></div>
          </div>

          <div className="mt-5 bg-[#08566E]/20 rounded-3xl p-4">
            <div className="h-5 w-52 rounded-full bg-[#E1E9E5]/60"></div>
            <div className="h-4 w-40 rounded-full bg-[#E1E9E5]/50 mt-3"></div>
          </div>

          <div className="mt-5 h-12 w-full rounded-2xl bg-[#08566E]/25"></div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="workers"
      className="bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-slate-900 py-20 px-5"
    >
      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <button
              onClick={() => navigate("/")}
              className="bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-5 py-3 rounded-full font-bold shadow-lg transition"
            >
              ← {t.backToHome || "Back to Home"}
            </button>

            <h2 className="text-4xl md:text-5xl font-extrabold text-[#08566E] mt-6">
              {t.ourWorkers || "Our Workers"}
            </h2>

            <p className="text-[#08566E]/75 mt-2 font-semibold">
              Verified local professionals ready for your service.
            </p>
          </div>

          <div className="bg-white/35 backdrop-blur-xl border border-white/60 rounded-3xl p-4 shadow-xl w-full md:w-[420px]">
            <input
              type="text"
              placeholder={t.searchWorkers || "Search Workers"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#E1E9E5] border border-[#8FBDBE] text-[#08566E] font-semibold focus:border-[#08566E] outline-none mb-3"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#E1E9E5] border border-[#8FBDBE] text-[#08566E] font-semibold outline-none"
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
        </div>

        {/* SERVICE FILTER BUTTONS */}
        <div className="mb-10 bg-white/35 backdrop-blur-xl border border-white/60 rounded-[28px] p-4 shadow-xl">
          <p className="text-[#08566E] font-extrabold mb-4">
            Filter by Service
          </p>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {serviceFilters.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => setActiveService(service)}
                className={`shrink-0 px-5 py-3 rounded-full font-extrabold transition ${
                  activeService === service
                    ? "bg-[#08566E] text-[#E1E9E5] shadow-lg"
                    : "bg-[#E1E9E5] text-[#08566E] hover:bg-[#B4DBDC]"
                }`}
              >
                {getFilterText(service)}
              </button>
            ))}
          </div>
        </div>

        {/* WORKER GRID */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <WorkerSkeleton key={item} />
            ))}
          </div>
        ) : visibleWorkers.length === 0 ? (
          <div className="bg-[#E1E9E5] border border-[#6FA8AA] rounded-3xl p-8 text-center shadow-xl">
            <p className="text-[#08566E] font-bold text-xl">
              {t.noWorkersFound || "No workers found"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleWorkers.map((worker, index) => (
              <div
                key={index}
                onClick={() => {
                  if (!isAvailable(worker)) return;

                  setSelectedWorker({
                    ...worker,
                    status: worker.status,
                  });
                }}
                className={`group relative overflow-hidden rounded-[28px] border shadow-xl transition duration-300 ${
                  isAvailable(worker)
                    ? "bg-white/45 border-white/70 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                    : "bg-white/30 border-white/50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="absolute top-0 left-0 right-0 h-24 bg-[#08566E]"></div>

                <div className="relative p-5">
                  <div className="flex items-start justify-between">
                    <img
                      src={worker.image || "https://via.placeholder.com/150"}
                      alt={worker.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                      className="w-20 h-20 rounded-3xl object-cover border-4 border-[#E1E9E5] shadow-xl"
                    />

                    {isAvailable(worker) ? (
                      <span className="bg-[#E1E9E5] text-[#08566E] px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                        {t.available || "Available"}
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                        {t.busy || "Busy"}
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    <h3 className="text-2xl font-extrabold text-[#08566E] leading-tight">
                      {worker.name}
                    </h3>

                    <p className="text-[#0A5E75] font-bold mt-1">
                      {getServiceText(worker.service)}
                    </p>
                  </div>

                  {worker.CertificateLink && (
                    <a
                      href={worker.CertificateLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="inline-block mt-3 text-[#08566E] text-xs font-extrabold hover:underline"
                    >
                      📜 {t.verifiedSkillCertificate || "Verified Skill Certificate"}
                    </a>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <div className="bg-[#E1E9E5]/90 rounded-2xl p-3 text-center">
                      <p className="text-xs text-[#6FA8AA] font-bold">
                        Rating
                      </p>

                      <p className="text-[#08566E] font-extrabold">
                        ⭐ {worker.rating || "4.8"}
                      </p>
                    </div>

                    <div className="bg-[#E1E9E5]/90 rounded-2xl p-3 text-center">
                      <p className="text-xs text-[#6FA8AA] font-bold">
                        {t.trust || "Trust"}
                      </p>

                      <p className="text-[#08566E] font-extrabold">
                        {worker.TrustScore || "90"}%
                      </p>
                    </div>

                    <div className="bg-[#E1E9E5]/90 rounded-2xl p-3 text-center">
                      <p className="text-xs text-[#6FA8AA] font-bold">
                        Area
                      </p>

                      <p className="text-[#08566E] font-extrabold truncate">
                        {worker.location || t.localArea || "Local"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 bg-[#08566E] rounded-3xl p-4">
                    <p className="text-[#E1E9E5] font-extrabold text-lg">
                      ✔ {t.verifiedProfessional || "Verified Professional"}
                    </p>

                    <p className="text-[#B4DBDC] text-sm font-semibold mt-1">
                      {t.inspectionBasedPricing || "Inspection Based Pricing"}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!isAvailable(worker)}
                    className={`mt-5 w-full py-3 rounded-2xl font-extrabold transition ${
                      isAvailable(worker)
                        ? "bg-[#08566E] text-[#E1E9E5] hover:bg-[#06485C]"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                  >
                    {isAvailable(worker)
                      ? `⚡ ${t.bookNow || "Book Now"}`
                      : t.busy || "Busy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Workers;