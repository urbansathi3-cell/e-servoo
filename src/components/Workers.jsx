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
  FaTimes,
  FaUserCheck,
  FaClock,
  FaCheckCircle,
  FaTools,
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

  const [activeService, setActiveService] = useState(
    selectedService || "All"
  );

  const [loading, setLoading] = useState(true);

  const [detailsWorker, setDetailsWorker] = useState(null);

  /* =====================================================
     SYNC SELECTED SERVICE
  ====================================================== */

  useEffect(() => {
    setActiveService(selectedService || "All");
  }, [selectedService]);

  /* =====================================================
     FETCH WORKERS
  ====================================================== */

  useEffect(() => {
    const fetchWorkers = (showLoader = false) => {
      if (showLoader) {
        setLoading(true);
      }

      fetch(`${API_URL}?action=workers&nocache=${Date.now()}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setWorkers(data);
          } else {
            setWorkers([]);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error("Workers fetch error:", error);

          setWorkers([]);

          setLoading(false);
        });
    };

    fetchWorkers(true);

    /*
      Refresh worker availability periodically.
      This keeps Available / Busy status updated.
    */

    const interval = setInterval(() => {
      fetchWorkers(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
     SERVICE FILTERS
  ====================================================== */

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

  /* =====================================================
     ANALYTICS
  ====================================================== */

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "workers",
      ...extraData,
    });
  };

  /* =====================================================
     SAFE VALUE HELPER
  ====================================================== */

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

  /* =====================================================
     WORKER DATA HELPERS
  ====================================================== */

  const getWorkerId = (worker) => {
    return getValue(
      worker,
      [
        "WorkerId",
        "WorkerID",
        "Worker id",
        "workerId",
        "workerid",
        "id",
        "ID",
      ],
      ""
    );
  };

  const getWorkerName = (worker) => {
    return getValue(
      worker,
      [
        "name",
        "Name",
        "worker",
        "Worker",
        "workerName",
        "WorkerName",
      ],
      "Worker"
    );
  };

  const getWorkerService = (worker) => {
    return getValue(
      worker,
      [
        "service",
        "Service",
        "services",
        "Services",
        "category",
        "Category",
      ],
      "Service"
    );
  };

  const getWorkerRating = (worker) => {
    return getValue(worker, ["rating", "Rating"], "4.8");
  };

  const getWorkerLocation = (worker) => {
    return getValue(
      worker,
      ["location", "Location"],
      t.localArea || "Local"
    );
  };

  const getWorkerImage = (worker) => {
    return getValue(
      worker,
      ["image", "Image", "photo", "Photo"],
      ""
    );
  };

  const getWorkerStatus = (worker) => {
    return getValue(
      worker,
      ["status", "Status", "availability"],
      "Available"
    );
  };

  const getTrustScore = (worker) => {
    return getValue(
      worker,
      [
        "TrustScore",
        "trustScore",
        "trustscore",
        "Trust Score",
        "trust score",
      ],
      "90"
    );
  };

  const getCertificateLink = (worker) => {
    return getValue(
      worker,
      [
        "CertificateLink",
        "certificateLink",
        "Certificate Link",
      ],
      ""
    );
  };

  const getExperience = (worker) => {
    return getValue(
      worker,
      [
        "experience",
        "Experience",
        "yearsExperience",
        "YearsExperience",
      ],
      ""
    );
  };

  /* =====================================================
     AVAILABILITY
  ====================================================== */

  const isAvailable = (worker) => {
    return (
      String(getWorkerStatus(worker))
        .trim()
        .toLowerCase() === "available"
    );
  };

  /* =====================================================
     SERVICE TRANSLATION
  ====================================================== */

  const getServiceText = (service) => {
    const serviceName = String(service || "")
      .trim()
      .toLowerCase();

    if (serviceName === "electrician") {
      return t.electrician || service;
    }

    if (serviceName === "plumber") {
      return t.plumber || service;
    }

    if (serviceName === "carpenter") {
      return t.carpenter || service;
    }

    if (serviceName === "cleaner") {
      return t.cleaner || service;
    }

    if (serviceName === "cook") {
      return t.cook || service;
    }

    if (serviceName === "painter") {
      return t.painter || service;
    }

    if (serviceName === "ac repair") {
      return t.acRepair || service;
    }

    if (serviceName === "home tutor") {
      return t.tutor || service;
    }

    if (serviceName === "appliance repair") {
      return t.applianceRepair || service;
    }

    if (serviceName === "cctv service") {
      return t.cctvService || service;
    }

    return service || "Service";
  };

  const getFilterText = (service) => {
    if (service === "All") {
      return t.all || "All";
    }

    return getServiceText(service);
  };

  /* =====================================================
     SERVICE FILTER
  ====================================================== */

  const handleServiceFilter = (service) => {
    setActiveService(service);

    pushEvent("service_filter_click", {
      service_name: service,
    });
  };

  /* =====================================================
     PREPARE WORKER FOR BOOKING FORM
  ====================================================== */

  const prepareWorkerForBooking = (worker) => {
    const workerId = getWorkerId(worker);
    const workerName = getWorkerName(worker);
    const workerService = getWorkerService(worker);
    const workerStatus = getWorkerStatus(worker);

    return {
      ...worker,

      id: workerId,
      WorkerID: workerId,
      workerId: workerId,

      name: workerName,
      worker: workerName,
      workerName: workerName,

      service: workerService,
      Service: workerService,

      status: workerStatus,
      Status: workerStatus,
    };
  };

  /* =====================================================
     BOOK WORKER
  ====================================================== */

  const handleBookWorker = (worker) => {
    if (!worker || !isAvailable(worker)) {
      return;
    }

    const preparedWorker = prepareWorkerForBooking(worker);

    pushEvent("booking_started", {
      service_name: getWorkerService(worker),
      worker_id: getWorkerId(worker),
      worker_service: getWorkerService(worker),
    });

    setDetailsWorker(null);

    setSelectedWorker(preparedWorker);
  };

  /* =====================================================
     OPEN DETAILS
  ====================================================== */

  const openWorkerDetails = (worker) => {
    setDetailsWorker(worker);

    pushEvent("worker_details_open", {
      worker_id: getWorkerId(worker),
      worker_service: getWorkerService(worker),
    });
  };

  /* =====================================================
     CLOSE DETAILS
  ====================================================== */

  const closeWorkerDetails = () => {
    setDetailsWorker(null);
  };

  /* =====================================================
     SORT
  ====================================================== */

  let filteredWorkers = [...workers];

  if (sortBy === "rating") {
    filteredWorkers.sort(
      (a, b) =>
        Number(getWorkerRating(b) || 0) -
        Number(getWorkerRating(a) || 0)
    );
  }

  if (sortBy === "available") {
    filteredWorkers = filteredWorkers.filter((worker) =>
      isAvailable(worker)
    );
  }

  /* =====================================================
     FILTER + SEARCH
  ====================================================== */

  const visibleWorkers = filteredWorkers
    .filter((worker) => {
      const service = String(getWorkerService(worker)).trim();

      return activeService === "All"
        ? true
        : service.toLowerCase() ===
            String(activeService).trim().toLowerCase();
    })
    .filter((worker) => {
      const searchText = search.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      return (
        String(getWorkerName(worker))
          .toLowerCase()
          .includes(searchText) ||
        String(getWorkerService(worker))
          .toLowerCase()
          .includes(searchText) ||
        String(getWorkerLocation(worker))
          .toLowerCase()
          .includes(searchText)
      );
    });

  /* =====================================================
     UNIQUE KEY
  ====================================================== */

  const getWorkerKey = (worker, index) => {
    const id = String(getWorkerId(worker) || "").trim();

    const name = String(getWorkerName(worker) || "").trim();

    const service = String(
      getWorkerService(worker) || ""
    ).trim();

    return `worker-${id || name || service || "item"}-${index}`;
  };

  /* =====================================================
     SKELETON
  ====================================================== */

  const WorkerSkeleton = () => {
    return (
      <div className="relative aspect-square overflow-hidden rounded-[24px] border border-white/70 bg-[#E1E9E5]/70 shadow-xl animate-pulse">
        <div className="absolute top-0 left-0 right-0 h-[52%] bg-[#08566E]/25"></div>

        <div className="absolute left-3 right-3 bottom-3">
          <div className="h-5 w-3/4 rounded-full bg-[#08566E]/20"></div>

          <div className="h-4 w-1/2 rounded-full bg-[#08566E]/20 mt-2"></div>

          <div className="h-4 w-2/3 rounded-full bg-[#08566E]/20 mt-3"></div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* =====================================================
          WORKERS SECTION
      ====================================================== */}

      <section
        id="workers"
        className="relative overflow-hidden bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-[#08566E] py-10 md:py-20 px-4 md:px-5 min-h-screen"
      >
        {/* BACKGROUND GLOW */}

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#08566E]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6FA8AA]/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-6">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="es-secondary-cta inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black"
            >
              <FaArrowLeft />

              {t.backToHome || "Back to Home"}
            </button>

            <div className="mt-6">

              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white px-4 py-2 rounded-full shadow-md text-[#08566E] text-xs font-black">
                <FaUserCheck />

                Verified Professionals
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-[#08566E] mt-4">
                {t.ourWorkers || "Our Workers"}
              </h2>

              <p className="text-[#06485C] mt-2 font-semibold text-sm md:text-base max-w-2xl">
                {language === "hi"
                  ? "Verified local professionals आपके service request के लिए ready हैं।"
                  : language === "od"
                    ? "Verified local professionals ଆପଣଙ୍କ service request ପାଇଁ ready ଅଛନ୍ତି।"
                    : "Verified local professionals ready for your service request."}
              </p>

            </div>
          </div>

          {/* =================================================
              SEARCH + SORT
          ================================================== */}

          <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-[24px] p-3 md:p-4 shadow-xl mb-5">

            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">

              {/* SEARCH */}

              <div>

                <label className="text-[#08566E] font-black text-xs flex items-center gap-2 mb-2">
                  <FaSearch />

                  {t.searchWorkers || "Search Workers"}
                </label>

                <input
                  type="text"
                  placeholder="Search worker, service or area..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="w-full p-3 rounded-2xl bg-white border border-[#8FBDBE] text-[#08566E] font-semibold focus:border-[#08566E] outline-none"
                />

              </div>

              {/* SORT */}

              <div>

                <label className="text-[#08566E] font-black text-xs flex items-center gap-2 mb-2">
                  <FaFilter />

                  {t.sortWorkers || "Sort Workers"}
                </label>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="w-full p-3 rounded-2xl bg-white border border-[#8FBDBE] text-[#08566E] font-semibold outline-none"
                >
                  <option value="">
                    {t.sortWorkers || "Sort Workers"}
                  </option>

                  <option value="rating">
                    {t.ratingHighToLow ||
                      "Rating High → Low"}
                  </option>

                  <option value="available">
                    {t.availableOnly ||
                      "Available Only"}
                  </option>
                </select>

              </div>

            </div>
          </div>

          {/* =================================================
              SERVICE FILTER
          ================================================== */}

          <div className="mb-6 bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-[24px] p-3 shadow-xl">

            <p className="text-[#08566E] font-black mb-3 text-sm flex items-center gap-2">
              <FaFilter />

              {language === "hi"
                ? "Service के हिसाब से Filter करें"
                : language === "od"
                  ? "Service ଅନୁସାରେ Filter କରନ୍ତୁ"
                  : "Filter by Service"}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

              {serviceFilters.map((service, index) => (
                <button
                  key={`service-filter-${service}-${index}`}
                  type="button"
                  onClick={() =>
                    handleServiceFilter(service)
                  }
                  className={`shrink-0 px-4 py-2.5 rounded-full text-xs md:text-sm font-black transition border ${
                    activeService === service
                      ? "bg-[#08566E] text-[#E1E9E5] border-[#08566E] shadow-lg"
                      : "bg-white text-[#08566E] border-[#6FA8AA]"
                  }`}
                >
                  {getFilterText(service)}
                </button>
              ))}

            </div>
          </div>

          {/* =================================================
              RESULT COUNT
          ================================================== */}

          {!loading && (
            <div className="flex items-center justify-between mb-4 px-1">

              <p className="text-[#08566E] text-sm font-black">
                {visibleWorkers.length}{" "}
                {visibleWorkers.length === 1
                  ? "Professional"
                  : "Professionals"}
              </p>

              {activeService !== "All" && (
                <button
                  type="button"
                  onClick={() =>
                    handleServiceFilter("All")
                  }
                  className="text-xs font-black text-[#08566E] flex items-center gap-1"
                >
                  <FaTimes />

                  Clear Filter
                </button>
              )}

            </div>
          )}

          {/* =================================================
              WORKER GRID
          ================================================== */}

          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:gap-5">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <WorkerSkeleton
                  key={`worker-skeleton-${item}`}
                />
              ))}

            </div>
          ) : visibleWorkers.length === 0 ? (

            <div className="bg-[#E1E9E5] border border-[#6FA8AA] rounded-3xl p-8 text-center shadow-xl">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#08566E] text-white flex items-center justify-center text-2xl">
                <FaSearch />
              </div>

              <p className="text-[#08566E] font-black text-xl mt-4">
                {t.noWorkersFound || "No workers found"}
              </p>

              <p className="text-[#06485C] font-semibold mt-2">
                Try another service filter or search term.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveService("All");
                  setSortBy("");
                }}
                className="mt-5 bg-[#08566E] text-[#E1E9E5] px-5 py-3 rounded-2xl font-black"
              >
                Show All Professionals
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-3 md:gap-5">

              {visibleWorkers.map((worker, index) => {

                const workerName =
                  getWorkerName(worker);

                const workerService =
                  getWorkerService(worker);

                const workerImage =
                  getWorkerImage(worker);

                const available =
                  isAvailable(worker);

                return (
                  <button
                    key={getWorkerKey(
                      worker,
                      index
                    )}
                    type="button"
                    onClick={() =>
                      openWorkerDetails(worker)
                    }
                    className={`group relative aspect-square overflow-hidden rounded-[22px] md:rounded-[28px] border shadow-lg text-left transition duration-300 ${
                      available
                        ? "bg-white border-white hover:-translate-y-1 hover:shadow-2xl"
                        : "bg-[#E1E9E5]/70 border-white/60 opacity-65"
                    }`}
                  >

                    {/* IMAGE */}

                    <div className="absolute inset-0">

                      {workerImage ? (

                        <img
                          src={workerImage}
                          alt={workerName}
                          referrerPolicy="no-referrer"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://via.placeholder.com/500x500?text=Worker";
                          }}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="w-full h-full bg-gradient-to-br from-[#08566E] to-[#9ECFD0] flex items-center justify-center">
                          <span className="text-5xl">
                            👷
                          </span>
                        </div>

                      )}

                    </div>

                    {/* IMAGE GRADIENT */}

                    <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

                    {/* STATUS */}

                    <div className="absolute top-2.5 left-2.5">

                      {available ? (

                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-[9px] md:text-xs font-black shadow-lg flex items-center gap-1">
                          <FaUserCheck />

                          Available
                        </span>

                      ) : (

                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-[9px] md:text-xs font-black shadow-lg">
                          Busy
                        </span>

                      )}

                    </div>

                    {/* RATING */}

                    <div className="absolute top-2.5 right-2.5 bg-white/95 text-[#08566E] px-2 py-1 rounded-full text-[10px] md:text-xs font-black shadow-lg flex items-center gap-1">

                      <FaStar className="text-yellow-500" />

                      {getWorkerRating(worker)}

                    </div>

                    {/* CARD INFO */}

                    <div className="absolute left-3 right-3 bottom-3 text-white">

                      <h3 className="font-black text-base md:text-xl leading-tight line-clamp-1">
                        {workerName}
                      </h3>

                      <p className="text-[#D9F4F2] text-xs md:text-sm font-bold mt-1 line-clamp-1">
                        {getServiceText(
                          workerService
                        )}
                      </p>

                      <div className="flex items-center gap-1 text-[10px] md:text-xs text-white/90 font-semibold mt-1">

                        <FaMapMarkerAlt />

                        <span className="truncate">
                          {getWorkerLocation(worker)}
                        </span>

                      </div>

                    </div>

                  </button>
                );
              })}

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          WORKER DETAILS MODAL
      ====================================================== */}

      {detailsWorker && (

        <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center">

          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close worker details"
            onClick={closeWorkerDetails}
            className="absolute inset-0 cursor-default"
          ></button>

          {/* MODAL */}

          <div className="relative w-full md:max-w-lg max-h-[92vh] overflow-y-auto bg-[#E1E9E5] rounded-t-[32px] md:rounded-[32px] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] border border-white/80">

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeWorkerDetails}
              className="absolute z-30 top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#08566E] flex items-center justify-center shadow-xl"
            >
              <FaTimes />
            </button>

            {/* =================================================
                HERO IMAGE
            ================================================== */}

            <div className="relative h-64 md:h-72 bg-[#08566E]">

              {getWorkerImage(detailsWorker) ? (

                <img
                  src={getWorkerImage(detailsWorker)}
                  alt={getWorkerName(detailsWorker)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://via.placeholder.com/700x500?text=Worker";
                  }}
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#08566E] to-[#9ECFD0]">

                  <span className="text-7xl">
                    👷
                  </span>

                </div>

              )}

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>

              {/* WORKER NAME */}

              <div className="absolute bottom-4 left-5 right-5 text-white">

                <h2 className="text-3xl font-black leading-tight">
                  {getWorkerName(detailsWorker)}
                </h2>

                <p className="text-[#D9F4F2] font-bold mt-1">
                  {getServiceText(
                    getWorkerService(detailsWorker)
                  )}
                </p>

              </div>

              {/* STATUS */}

              <div className="absolute top-4 left-4">

                {isAvailable(detailsWorker) ? (

                  <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-xl flex items-center gap-1">

                    <FaUserCheck />

                    Available

                  </span>

                ) : (

                  <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-xl">
                    Busy
                  </span>

                )}

              </div>

            </div>

            {/* =================================================
                DETAILS CONTENT
            ================================================== */}

            <div className="p-5 pb-7">

              {/* =================================================
                  RATING / TRUST / LOCATION
              ================================================== */}

              <div className="grid grid-cols-3 gap-2">

                <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC] shadow-sm">

                  <FaStar className="mx-auto text-yellow-500" />

                  <p className="text-xs text-[#6FA8AA] font-black mt-1">
                    Rating
                  </p>

                  <p className="font-black text-[#08566E]">
                    {getWorkerRating(
                      detailsWorker
                    )}
                  </p>

                </div>

                <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC] shadow-sm">

                  <FaShieldAlt className="mx-auto text-[#0A7F88]" />

                  <p className="text-xs text-[#6FA8AA] font-black mt-1">
                    Trust
                  </p>

                  <p className="font-black text-[#08566E]">
                    {getTrustScore(
                      detailsWorker
                    )}
                    %
                  </p>

                </div>

                <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC] shadow-sm">

                  <FaMapMarkerAlt className="mx-auto text-[#0A7F88]" />

                  <p className="text-xs text-[#6FA8AA] font-black mt-1">
                    Area
                  </p>

                  <p className="font-black text-[#08566E] text-xs truncate">
                    {getWorkerLocation(
                      detailsWorker
                    )}
                  </p>

                </div>

              </div>

              {/* =================================================
                  PROFESSIONAL DETAILS
              ================================================== */}

              <div className="mt-4 bg-white rounded-3xl p-4 border border-[#B4DBDC] shadow-sm">

                <div className="flex items-center gap-2">

                  <div className="w-10 h-10 rounded-xl bg-[#E5F3F2] text-[#08566E] flex items-center justify-center">
                    <FaTools />
                  </div>

                  <div>

                    <p className="text-[#08566E] font-black text-lg">
                      Professional Details
                    </p>

                    <p className="text-[#6FA8AA] text-xs font-semibold">
                      Verified service professional
                    </p>

                  </div>

                </div>

                <div className="mt-4 space-y-3">

                  {/* SERVICE */}

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-[#6FA8AA] font-bold text-sm">
                      Service
                    </span>

                    <span className="text-[#08566E] font-black text-sm text-right">
                      {getServiceText(
                        getWorkerService(
                          detailsWorker
                        )
                      )}
                    </span>

                  </div>

                  {/* EXPERIENCE */}

                  {getExperience(
                    detailsWorker
                  ) && (

                    <div className="flex items-center justify-between gap-3">

                      <span className="text-[#6FA8AA] font-bold text-sm">
                        Experience
                      </span>

                      <span className="text-[#08566E] font-black text-sm">
                        {getExperience(
                          detailsWorker
                        )}{" "}
                        years
                      </span>

                    </div>

                  )}

                  {/* LOCATION */}

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-[#6FA8AA] font-bold text-sm">
                      Service Area
                    </span>

                    <span className="text-[#08566E] font-black text-sm text-right">
                      {getWorkerLocation(
                        detailsWorker
                      )}
                    </span>

                  </div>

                  {/* AVAILABILITY */}

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-[#6FA8AA] font-bold text-sm">
                      Availability
                    </span>

                    <span
                      className={`font-black text-sm ${
                        isAvailable(
                          detailsWorker
                        )
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {isAvailable(
                        detailsWorker
                      )
                        ? "Available Now"
                        : "Currently Busy"}
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================================
                  INSPECTION PRICING
              ================================================== */}

              <div className="mt-4 bg-[#F1F9F8] border border-[#B4DBDC] rounded-3xl p-4">

                <div className="flex items-start gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-[#08566E] text-white flex items-center justify-center shrink-0">
                    <FaCheckCircle />
                  </div>

                  <div>

                    <p className="text-[10px] font-black text-[#6FA8AA] uppercase tracking-wider">
                      Pricing
                    </p>

                    <h3 className="text-lg font-black text-[#043A4A] mt-1">
                      Inspection-Based Pricing
                    </h3>

                    <p className="text-sm text-[#4F686D] font-semibold mt-1 leading-relaxed">
                      No fixed service charge is shown here.
                      The final amount will be determined
                      after inspection based on the actual
                      issue and required work.
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  VERIFIED PROFESSIONAL
              ================================================== */}

              <div className="mt-4 bg-[#08566E] rounded-3xl p-4 text-white">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                    <FaShieldAlt />
                  </div>

                  <div>

                    <p className="font-black text-lg">
                      Verified Professional
                    </p>

                    <p className="text-[#B4DBDC] text-sm font-semibold mt-1">
                      Trusted local service with inspection-based pricing.
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  CERTIFICATE
              ================================================== */}

              {getCertificateLink(
                detailsWorker
              ) && (

                <a
                  href={getCertificateLink(
                    detailsWorker
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    pushEvent(
                      "worker_certificate_click",
                      {
                        worker_id:
                          getWorkerId(
                            detailsWorker
                          ),
                        worker_service:
                          getWorkerService(
                            detailsWorker
                          ),
                      }
                    );
                  }}
                  className="mt-4 w-full bg-white border border-[#B4DBDC] rounded-2xl px-4 py-3 flex items-center justify-center gap-2 text-[#08566E] font-black shadow-sm hover:bg-[#F4FAF9] transition"
                >

                  <FaCertificate />

                  View Verified Skill Certificate

                </a>

              )}

              {/* =================================================
                  BOOK NOW
              ================================================== */}

              <button
                type="button"
                disabled={
                  !isAvailable(detailsWorker)
                }
                onClick={() =>
                  handleBookWorker(
                    detailsWorker
                  )
                }
                className={`mt-5 w-full py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition ${
                  isAvailable(detailsWorker)
                    ? "bg-[#08566E] text-[#E1E9E5] hover:bg-[#06485C] active:scale-[0.98]"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >

                <FaBolt />

                {isAvailable(detailsWorker)
                  ? "Book Now"
                  : "Worker Currently Busy"}

              </button>

              {/* FOOTNOTE */}

              <div className="mt-4 flex items-start gap-2 justify-center">

                <FaClock className="text-[#6FA8AA] mt-0.5 shrink-0" />

                <p className="text-center text-[#6FA8AA] text-xs font-semibold leading-relaxed">
                  Final service price depends on inspection,
                  actual issue and work required.
                </p>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Workers;