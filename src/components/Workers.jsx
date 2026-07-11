import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";
import {
  FaArrowLeft,
  FaBolt,
  FaCertificate,
  FaFilter,
  FaMapMarkerAlt,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaUserCheck,
} from "react-icons/fa";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

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

      fetch(`${API_URL}?action=workers&nocache=${Date.now()}`)
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

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "workers",
      ...extraData,
    });
  };

  const getValue = (worker, keys, fallback = "") => {
    for (const key of keys) {
      if (
        worker?.[key] !== undefined &&
        worker?.[key] !== null &&
        worker?.[key] !== ""
      ) {
        return worker[key];
      }
    }

    return fallback;
  };

  const getWorkerId = (worker) => {
    return getValue(worker, ["WorkerId", "WorkerID", "Worker id", "id"], "");
  };

  const getWorkerName = (worker) => {
    return getValue(worker, ["name", "Name"], "Worker");
  };

  const getWorkerService = (worker) => {
    return getValue(worker, ["service", "Service"], "Service");
  };

  const getWorkerRating = (worker) => {
    return getValue(worker, ["rating", "Rating"], "4.8");
  };

  const getWorkerLocation = (worker) => {
    return getValue(worker, ["location", "Location"], t.localArea || "Local");
  };

  const getWorkerImage = (worker) => {
    return getValue(worker, ["image", "Image"], "");
  };

  const getWorkerStatus = (worker) => {
    return getValue(worker, ["status", "Status"], "Available");
  };

  const getTrustScore = (worker) => {
    return getValue(
      worker,
      ["TrustScore", "trustScore", "Trust Score", "trust score"],
      "90"
    );
  };

  const getCertificateLink = (worker) => {
    return getValue(
      worker,
      ["CertificateLink", "certificateLink", "Certificate Link"],
      ""
    );
  };

  const isAvailable = (worker) => {
    return String(getWorkerStatus(worker)).trim().toLowerCase() === "available";
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

    return service || "Service";
  };

  const getFilterText = (service) => {
    if (service === "All") return t.all || "All";
    return getServiceText(service);
  };

  const handleServiceFilter = (service) => {
    setActiveService(service);

    pushEvent("service_filter_click", {
      service_name: service,
    });
  };

  const handleBookWorker = (worker) => {
    if (!isAvailable(worker)) return;

    const service = getWorkerService(worker);

    pushEvent("booking_started", {
      service_name: service,
      worker_id: getWorkerId(worker),
      worker_service: service,
    });

    setSelectedWorker({
      ...worker,
      status: getWorkerStatus(worker),
    });
  };

  let filteredWorkers = [...workers];

  if (sortBy === "rating") {
    filteredWorkers.sort(
      (a, b) => Number(getWorkerRating(b) || 0) - Number(getWorkerRating(a) || 0)
    );
  }

  if (sortBy === "available") {
    filteredWorkers = filteredWorkers.filter((worker) => isAvailable(worker));
  }

  const visibleWorkers = filteredWorkers
    .filter((worker) => {
      const service = getWorkerService(worker);

      return activeService === "All"
        ? true
        : service.trim().toLowerCase() === activeService.trim().toLowerCase();
    })
    .filter((worker) => {
      const searchText = search.toLowerCase();

      return (
        getWorkerName(worker).toLowerCase().includes(searchText) ||
        getWorkerService(worker).toLowerCase().includes(searchText) ||
        getWorkerLocation(worker).toLowerCase().includes(searchText)
      );
    });

  const WorkerSkeleton = () => {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[#E1E9E5]/70 backdrop-blur-xl shadow-xl animate-pulse">
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
      className="bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-[#08566E] py-20 px-5"
    >
      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="es-secondary-cta inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition"
            >
              <FaArrowLeft />
              {t.backToHome || "Back to Home"}
            </button>

            <h2 className="text-4xl md:text-5xl font-black text-[#08566E] mt-6">
              {t.ourWorkers || "Our Workers"}
            </h2>

            <p className="text-[#06485C] mt-2 font-semibold max-w-2xl">
              {language === "hi"
                ? "Verified local professionals आपके service request के लिए ready हैं।"
                : language === "od"
                  ? "Verified local professionals ଆପଣଙ୍କ service request ପାଇଁ ready ଅଛନ୍ତି।"
                  : "Verified local professionals ready for your service request."}
            </p>
          </div>

          <div className="bg-[#E1E9E5]/85 backdrop-blur-xl border border-white/80 rounded-3xl p-4 shadow-xl w-full md:w-[420px]">
            <label className="text-[#08566E] font-black text-sm flex items-center gap-2 mb-2">
              <FaSearch />
              {t.searchWorkers || "Search Workers"}
            </label>

            <input
              type="text"
              placeholder={t.searchWorkers || "Search Workers"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#E1E9E5] border border-[#8FBDBE] text-[#08566E] font-semibold focus:border-[#08566E] outline-none mb-3"
            />

            <label className="text-[#08566E] font-black text-sm flex items-center gap-2 mb-2">
              <FaFilter />
              {t.sortWorkers || "Sort Workers"}
            </label>

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
        <div className="mb-10 bg-[#E1E9E5]/85 backdrop-blur-xl border border-white/80 rounded-[28px] p-4 shadow-xl">
          <p className="text-[#08566E] font-black mb-4 flex items-center gap-2">
            <FaFilter />
            {language === "hi"
              ? "Service के हिसाब से Filter करें"
              : language === "od"
                ? "Service ଅନୁସାରେ Filter କରନ୍ତୁ"
                : "Filter by Service"}
          </p>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {serviceFilters.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => handleServiceFilter(service)}
                className={`shrink-0 px-5 py-3 rounded-2xl font-black transition border ${
                  activeService === service
                    ? "bg-[#08566E] text-[#E1E9E5] border-[#08566E] shadow-lg"
                    : "bg-[#E1E9E5] text-[#08566E] border-[#6FA8AA] hover:bg-[#B4DBDC]"
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
            <p className="text-[#08566E] font-black text-xl">
              {t.noWorkersFound || "No workers found"}
            </p>

            <p className="text-[#06485C] font-semibold mt-2">
              Try another service filter or search term.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleWorkers.map((worker, index) => {
              const workerName = getWorkerName(worker);
              const workerService = getWorkerService(worker);
              const workerLocation = getWorkerLocation(worker);
              const workerImage = getWorkerImage(worker);
              const certificateLink = getCertificateLink(worker);
              const available = isAvailable(worker);

              return (
                <div
                  key={getWorkerId(worker) || index}
                  onClick={() => handleBookWorker(worker)}
                  className={`group relative overflow-hidden rounded-[28px] border shadow-xl transition duration-300 ${
                    available
                      ? "bg-[#E1E9E5]/88 border-white/90 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                      : "bg-[#E1E9E5]/55 border-white/60 opacity-70 cursor-not-allowed"
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-24 bg-[#08566E]"></div>

                  <div className="relative p-5">
                    <div className="flex items-start justify-between">
                      <img
                        src={workerImage || "https://via.placeholder.com/150"}
                        alt={workerName}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                        className="w-20 h-20 rounded-3xl object-cover border-4 border-[#E1E9E5] shadow-xl"
                      />

                      {available ? (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1">
                          <FaUserCheck />
                          {t.available || "Available"}
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-md">
                          {t.busy || "Busy"}
                        </span>
                      )}
                    </div>

                    <div className="mt-5">
                      <h3 className="text-2xl font-black text-[#08566E] leading-tight">
                        {workerName}
                      </h3>

                      <p className="text-[#06485C] font-extrabold mt-1">
                        {getServiceText(workerService)}
                      </p>
                    </div>

                    {certificateLink && (
                      <a
                        href={certificateLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();

                          pushEvent("worker_certificate_click", {
                            worker_id: getWorkerId(worker),
                            worker_service: workerService,
                          });
                        }}
                        className="inline-flex items-center gap-2 mt-3 text-[#08566E] text-xs font-black hover:underline"
                      >
                        <FaCertificate />
                        {t.verifiedSkillCertificate || "Verified Skill Certificate"}
                      </a>
                    )}

                    <div className="grid grid-cols-3 gap-2 mt-5">
                      <div className="bg-white/90 rounded-2xl p-3 text-center border border-[#B4DBDC]">
                        <p className="text-xs text-[#6FA8AA] font-black flex justify-center items-center gap-1">
                          <FaStar />
                          Rating
                        </p>

                        <p className="text-[#08566E] font-black">
                          ⭐ {getWorkerRating(worker)}
                        </p>
                      </div>

                      <div className="bg-white/90 rounded-2xl p-3 text-center border border-[#B4DBDC]">
                        <p className="text-xs text-[#6FA8AA] font-black flex justify-center items-center gap-1">
                          <FaShieldAlt />
                          {t.trust || "Trust"}
                        </p>

                        <p className="text-[#08566E] font-black">
                          {getTrustScore(worker)}%
                        </p>
                      </div>

                      <div className="bg-white/90 rounded-2xl p-3 text-center border border-[#B4DBDC]">
                        <p className="text-xs text-[#6FA8AA] font-black flex justify-center items-center gap-1">
                          <FaMapMarkerAlt />
                          Area
                        </p>

                        <p className="text-[#08566E] font-black truncate">
                          {workerLocation}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 bg-[#08566E] rounded-3xl p-4">
                      <p className="text-[#E1E9E5] font-black text-lg">
                        ✔ {t.verifiedProfessional || "Verified Professional"}
                      </p>

                      <p className="text-[#B4DBDC] text-sm font-semibold mt-1">
                        {t.inspectionBasedPricing || "Inspection Based Pricing"}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!available}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookWorker(worker);
                      }}
                      className={`es-booking-cta mt-5 w-full py-3 rounded-2xl font-black transition flex items-center justify-center gap-2 ${
                        available
                          ? "bg-[#08566E] text-[#E1E9E5] hover:bg-[#06485C]"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    >
                      {available ? (
                        <>
                          <FaBolt />
                          {t.bookNow || "Book Now"}
                        </>
                      ) : (
                        t.busy || "Busy"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

export default Workers;