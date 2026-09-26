import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";

import {
  FaArrowLeft,
  FaBolt,
  FaCertificate,
  FaClock,
  FaFilter,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaTimes,
  FaTools,
  FaUserCheck,
} from "react-icons/fa";

const API_URL = "/api/booking";

const LOCATION_STORAGE_KEY = "e-servoo-user-location";

// ======================================================
// HELPERS
// ======================================================

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getValue = (object, keys, fallback = "") => {
  if (!object || typeof object !== "object") {
    return fallback;
  }

  for (const key of keys) {
    if (
      object[key] !== undefined &&
      object[key] !== null &&
      String(object[key]).trim() !== ""
    ) {
      return object[key];
    }
  }

  return fallback;
};

// ======================================================
// DISTANCE
// ======================================================

const calculateDistanceKm = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const values = [lat1, lon1, lat2, lon2];

  if (
    values.some(
      (value) =>
        value === null ||
        value === undefined ||
        value === "" ||
        !Number.isFinite(Number(value))
    )
  ) {
    return null;
  }

  const latitude1 = Number(lat1) * (Math.PI / 180);
  const latitude2 = Number(lat2) * (Math.PI / 180);

  const deltaLatitude =
    (Number(lat2) - Number(lat1)) *
    (Math.PI / 180);

  const deltaLongitude =
    (Number(lon2) - Number(lon1)) *
    (Math.PI / 180);

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(deltaLongitude / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return 6371 * c;
};

const formatDistance = (distance) => {
  if (
    distance === null ||
    distance === undefined ||
    !Number.isFinite(Number(distance))
  ) {
    return null;
  }

  const value = Number(distance);

  if (value < 1) {
    return `${Math.round(value * 1000)} m`;
  }

  if (value < 10) {
    return `${value.toFixed(1)} km`;
  }

  return `${Math.round(value)} km`;
};

// ======================================================
// WORKERS
// ======================================================

function Workers({
  setSelectedWorker,
  selectedService = "All",
  language = "en",
}) {
  const navigate = useNavigate();

  const t =
    translations?.[language] ||
    translations?.en ||
    {};

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [detailsWorker, setDetailsWorker] =
    useState(null);

  const [search, setSearch] = useState("");

  const [activeService, setActiveService] =
    useState(selectedService || "All");

  const [sortBy, setSortBy] =
    useState("nearest");

  const [userLocation, setUserLocation] =
    useState(null);

  const [locationAvailable, setLocationAvailable] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  // ====================================================
  // SYNC SERVICE
  // ====================================================

  useEffect(() => {
    setActiveService(
      selectedService || "All"
    );
  }, [selectedService]);

  // ====================================================
  // READ LOCATION
  // ====================================================

  const readSavedLocation = () => {
    try {
      const saved = localStorage.getItem(
        LOCATION_STORAGE_KEY
      );

      if (!saved) {
        setUserLocation(null);
        setLocationAvailable(false);
        return null;
      }

      const parsed = JSON.parse(saved);

      const latitude = Number(parsed?.latitude);
      const longitude = Number(parsed?.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        setUserLocation(null);
        setLocationAvailable(false);
        return null;
      }

      const location = {
        latitude,
        longitude,
        accuracy: Number(parsed?.accuracy || 0),
        timestamp:
          parsed?.timestamp || Date.now(),
      };

      setUserLocation(location);
      setLocationAvailable(true);

      return location;
    } catch (error) {
      console.warn(
        "E-SERVOO location read error:",
        error
      );

      setUserLocation(null);
      setLocationAvailable(false);

      return null;
    }
  };

  // ====================================================
  // LOCATION EVENT
  // ====================================================

  useEffect(() => {
    readSavedLocation();

    const handleLocationUpdated = (event) => {
      const location = event?.detail;

      if (
        location &&
        Number.isFinite(
          Number(location.latitude)
        ) &&
        Number.isFinite(
          Number(location.longitude)
        )
      ) {
        const nextLocation = {
          latitude: Number(
            location.latitude
          ),
          longitude: Number(
            location.longitude
          ),
          accuracy: Number(
            location.accuracy || 0
          ),
          timestamp:
            location.timestamp ||
            Date.now(),
        };

        localStorage.setItem(
          LOCATION_STORAGE_KEY,
          JSON.stringify(nextLocation)
        );

        setUserLocation(nextLocation);
        setLocationAvailable(true);
        setSortBy("nearest");

        return;
      }

      readSavedLocation();
    };

    window.addEventListener(
      "location-updated",
      handleLocationUpdated
    );

    return () => {
      window.removeEventListener(
        "location-updated",
        handleLocationUpdated
      );
    };
  }, []);

  // ====================================================
  // REQUEST LOCATION
  // ====================================================

  const requestLocationAgain = () => {
    if (!navigator.geolocation) {
      alert(
        "Location is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: Number(
            position.coords.latitude
          ),
          longitude: Number(
            position.coords.longitude
          ),
          accuracy: Number(
            position.coords.accuracy || 0
          ),
          timestamp: Date.now(),
        };

        localStorage.setItem(
          LOCATION_STORAGE_KEY,
          JSON.stringify(location)
        );

        setUserLocation(location);
        setLocationAvailable(true);
        setSortBy("nearest");
        setLocationLoading(false);

        window.dispatchEvent(
          new CustomEvent("location-updated", {
            detail: location,
          })
        );
      },

      (error) => {
        console.warn(
          "Location request failed:",
          error
        );

        setLocationLoading(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          alert(
            "Location permission denied. Please allow location access from your browser settings."
          );
        } else {
          alert(
            "Unable to get your location. Please try again."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  };

  // ====================================================
  // FETCH WORKERS
  // ====================================================

  const fetchWorkers = async (
    showLoader = true
  ) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `${API_URL}?action=workers&nocache=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data = await response.json();

      let workerList = [];

      if (Array.isArray(data)) {
        workerList = data;
      } else if (
        Array.isArray(data?.workers)
      ) {
        workerList = data.workers;
      } else if (
        Array.isArray(data?.data)
      ) {
        workerList = data.data;
      }

      setWorkers(workerList);
    } catch (error) {
      console.error(
        "Workers fetch error:",
        error
      );

      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers(true);

    const interval = setInterval(() => {
      fetchWorkers(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ====================================================
  // WORKER HELPERS
  // ====================================================

  const getWorkerId = (worker) =>
    String(
      getValue(
        worker,
        [
          "id",
          "ID",
          "workerId",
          "WorkerID",
          "Worker Id",
          "worker_id",
        ],
        ""
      )
    ).trim();

  const getWorkerName = (worker) =>
    String(
      getValue(
        worker,
        [
          "name",
          "Name",
          "workerName",
          "WorkerName",
        ],
        "Worker"
      )
    ).trim();

  const getWorkerService = (worker) =>
    String(
      getValue(
        worker,
        [
          "service",
          "Service",
          "category",
          "Category",
        ],
        "Service"
      )
    ).trim();

  const getWorkerPhone = (worker) =>
    String(
      getValue(
        worker,
        [
          "phone",
          "Phone",
          "mobile",
          "Mobile",
        ],
        ""
      )
    ).trim();

  const getWorkerRating = (worker) =>
    getValue(
      worker,
      [
        "rating",
        "Rating",
        "stars",
      ],
      "0"
    );

  const getTrustScore = (worker) =>
    getValue(
      worker,
      [
        "TrustScore",
        "trustScore",
        "trust_score",
      ],
      "0"
    );

  const getWorkerLocation = (worker) =>
    String(
      getValue(
        worker,
        [
          "location",
          "Location",
          "address",
          "Address",
          "area",
          "Area",
        ],
        "Local Area"
      )
    ).trim();

  const getWorkerExperience = (worker) =>
    getValue(
      worker,
      [
        "experience",
        "Experience",
        "years",
        "Years",
      ],
      ""
    );

  const getWorkerImage = (worker) =>
    String(
      getValue(
        worker,
        [
          "image",
          "Image",
          "photo",
          "Photo",
          "imageUrl",
          "ImageURL",
          "image_url",
        ],
        ""
      )
    ).trim();

  const getWorkerCertificate = (worker) =>
    String(
      getValue(
        worker,
        [
          "CertificateLink",
          "certificateLink",
          "certificate",
          "Certificate",
        ],
        ""
      )
    ).trim();

  const getWorkerStatus = (worker) =>
    String(
      getValue(
        worker,
        [
          "status",
          "Status",
          "availability",
          "Availability",
        ],
        "Available"
      )
    ).trim();

  const getWorkerLatitude = (worker) =>
    Number(
      getValue(
        worker,
        [
          "latitude",
          "Latitude",
          "lat",
          "Lat",
          "workerLatitude",
        ],
        NaN
      )
    );

  const getWorkerLongitude = (worker) =>
    Number(
      getValue(
        worker,
        [
          "longitude",
          "Longitude",
          "lng",
          "Lng",
          "workerLongitude",
        ],
        NaN
      )
    );

  const isAvailable = (worker) => {
    const status = normalize(
      getWorkerStatus(worker)
    );

    return (
      status === "available" ||
      status === "active" ||
      status === "free" ||
      status === "online"
    );
  };

  const getWorkerDistance = (worker) => {
    if (!userLocation) {
      return null;
    }

    const workerLatitude =
      getWorkerLatitude(worker);

    const workerLongitude =
      getWorkerLongitude(worker);

    if (
      !Number.isFinite(workerLatitude) ||
      !Number.isFinite(workerLongitude)
    ) {
      return null;
    }

    return calculateDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      workerLatitude,
      workerLongitude
    );
  };

  const getServiceText = (service) => {
    const value = String(service || "");

    if (normalize(value) === "electrician") {
      return "Electrician";
    }

    if (normalize(value) === "plumber") {
      return "Plumber";
    }

    if (normalize(value) === "carpenter") {
      return "Carpenter";
    }

    if (normalize(value) === "cleaner") {
      return "Cleaner";
    }

    if (normalize(value) === "cook") {
      return "Cook";
    }

    return value || "Service";
  };

  // ====================================================
  // ANALYTICS
  // ====================================================

  const pushEvent = (
    eventName,
    extraData = {}
  ) => {
    window.dataLayer =
      window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "workers",
      ...extraData,
    });
  };

  // ====================================================
  // SERVICE FILTERS
  // ====================================================

  const serviceFilters = [
    "All",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Cleaner",
    "Cook",
  ];

  // ====================================================
  // VISIBLE WORKERS
  // ====================================================

  const visibleWorkers = useMemo(() => {
    let list = workers.map((worker) => ({
      ...worker,
      __distanceKm:
        getWorkerDistance(worker),
    }));

    // Service
    if (
      normalize(activeService) !==
      "all"
    ) {
      list = list.filter(
        (worker) =>
          normalize(
            getWorkerService(worker)
          ) ===
          normalize(activeService)
      );
    }

    // Search
    const searchText =
      normalize(search);

    if (searchText) {
      list = list.filter((worker) => {
        const name = normalize(
          getWorkerName(worker)
        );

        const service = normalize(
          getWorkerService(worker)
        );

        const location = normalize(
          getWorkerLocation(worker)
        );

        return (
          name.includes(searchText) ||
          service.includes(searchText) ||
          location.includes(searchText)
        );
      });
    }

    // Sort
    if (sortBy === "nearest") {
      list.sort((a, b) => {
        const distanceA =
          a.__distanceKm;

        const distanceB =
          b.__distanceKm;

        if (
          distanceA === null &&
          distanceB !== null
        ) {
          return 1;
        }

        if (
          distanceA !== null &&
          distanceB === null
        ) {
          return -1;
        }

        if (
          distanceA !== null &&
          distanceB !== null
        ) {
          return distanceA - distanceB;
        }

        return (
          Number(
            getWorkerRating(b)
          ) -
          Number(
            getWorkerRating(a)
          )
        );
      });
    }

    if (sortBy === "rating") {
      list.sort(
        (a, b) =>
          Number(
            getWorkerRating(b)
          ) -
          Number(
            getWorkerRating(a)
          )
      );
    }

    if (sortBy === "available") {
      list.sort((a, b) => {
        const availableA =
          isAvailable(a) ? 1 : 0;

        const availableB =
          isAvailable(b) ? 1 : 0;

        return (
          availableB -
          availableA
        );
      });
    }

    return list;
  }, [
    workers,
    activeService,
    search,
    sortBy,
    userLocation,
  ]);

  // ====================================================
  // BOOK WORKER
  // ====================================================

  const handleBookWorker = (worker) => {
    if (!isAvailable(worker)) {
      return;
    }

    const preparedWorker = {
      ...worker,

      id: getWorkerId(worker),
      workerId: getWorkerId(worker),

      name: getWorkerName(worker),
      workerName: getWorkerName(worker),

      service:
        getWorkerService(worker),
      workerService:
        getWorkerService(worker),

      rating:
        getWorkerRating(worker),

      TrustScore:
        getTrustScore(worker),

      location:
        getWorkerLocation(worker),

      experience:
        getWorkerExperience(worker),

      image:
        getWorkerImage(worker),

      CertificateLink:
        getWorkerCertificate(worker),

      status:
        getWorkerStatus(worker),

      distanceKm:
        getWorkerDistance(worker),
    };

    pushEvent(
      "worker_book_click",
      {
        worker_id:
          getWorkerId(worker),
        worker_name:
          getWorkerName(worker),
        worker_service:
          getWorkerService(worker),
        worker_distance_km:
          getWorkerDistance(worker),
      }
    );

    setDetailsWorker(null);
    setSelectedWorker(
      preparedWorker
    );
  };

  // ====================================================
  // OPEN DETAILS
  // ====================================================

  const openWorkerDetails = (
    worker
  ) => {
    setDetailsWorker(worker);

    pushEvent(
      "worker_details_open",
      {
        worker_id:
          getWorkerId(worker),
        worker_service:
          getWorkerService(worker),
        worker_distance_km:
          getWorkerDistance(worker),
      }
    );
  };

  // ====================================================
  // SKELETON
  // ====================================================

  const WorkerSkeleton = () => (
    <div className="relative aspect-square overflow-hidden rounded-[24px] border border-white/70 bg-[#E1E9E5]/70 shadow-xl animate-pulse">
      <div className="absolute top-0 left-0 right-0 h-[52%] bg-[#08566E]/25" />

      <div className="absolute left-3 right-3 bottom-3">
        <div className="h-5 w-3/4 rounded-full bg-[#08566E]/20" />
        <div className="h-4 w-1/2 rounded-full bg-[#08566E]/20 mt-2" />
        <div className="h-4 w-2/3 rounded-full bg-[#08566E]/20 mt-3" />
      </div>
    </div>
  );

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <>
      <section
        id="workers"
        className="relative overflow-hidden bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-[#08566E] py-10 md:py-20 px-4 md:px-5 min-h-screen"
      >
        {/* Background */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#08566E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6FA8AA]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="es-secondary-cta inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black"
            >
              <FaArrowLeft />
              {t.backToHome ||
                "Back to Home"}
            </button>

            <div className="mt-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white px-4 py-2 rounded-full shadow-md text-[#08566E] text-xs font-black">
                <FaUserCheck />
                Verified Professionals
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-[#08566E] mt-4">
                {t.ourWorkers ||
                  "Our Workers"}
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

          {/* Location */}
          <div className="mb-5">
            {locationAvailable ? (
              <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[22px] p-3 shadow-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#E5F3F2] text-[#08566E] flex items-center justify-center shrink-0">
                    <FaLocationArrow />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[#08566E] font-black text-sm">
                      Nearby workers enabled
                    </p>

                    <p className="text-[#6FA8AA] text-xs font-semibold truncate">
                      Workers are being arranged by your location.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    requestLocationAgain
                  }
                  disabled={
                    locationLoading
                  }
                  className="shrink-0 px-3 py-2 rounded-xl bg-[#08566E] text-white text-xs font-black"
                >
                  {locationLoading
                    ? "..."
                    : "Update"}
                </button>
              </div>
            ) : (
              <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-[#6FA8AA]/40 rounded-[22px] p-3 shadow-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#08566E] flex items-center justify-center">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-[#08566E] font-black text-sm">
                      Find nearby professionals
                    </p>

                    <p className="text-[#6FA8AA] text-xs font-semibold">
                      Allow location for nearest-worker sorting.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    requestLocationAgain
                  }
                  disabled={
                    locationLoading
                  }
                  className="shrink-0 px-3 py-2 rounded-xl bg-[#08566E] text-white text-xs font-black"
                >
                  {locationLoading
                    ? "..."
                    : "Enable"}
                </button>
              </div>
            )}
          </div>

          {/* Search + Sort */}
          <div className="bg-[#E1E9E5]/90 backdrop-blur-xl border border-white/80 rounded-[24px] p-3 md:p-4 shadow-xl mb-5">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">

              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6FA8AA]" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search worker, service or area..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#B4DBDC] text-[#08566E] font-bold outline-none focus:ring-2 focus:ring-[#08566E]"
                />
              </div>

              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6FA8AA]" />

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value
                    )
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#B4DBDC] text-[#08566E] font-bold outline-none"
                >
                  <option value="nearest">
                    Nearest First
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                  <option value="available">
                    Available First
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* Service filters */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
            {serviceFilters.map(
              (service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() =>
                    setActiveService(
                      service
                    )
                  }
                  className={`shrink-0 px-4 py-2.5 rounded-2xl font-black text-sm transition ${
                    normalize(
                      activeService
                    ) ===
                    normalize(service)
                      ? "bg-[#08566E] text-[#E1E9E5] shadow-lg"
                      : "bg-white/80 text-[#08566E] border border-[#B4DBDC] hover:bg-white"
                  }`}
                >
                  {service}
                </button>
              )
            )}
          </div>

          {/* Worker count */}
          {!loading && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[#08566E] font-black text-sm">
                {visibleWorkers.length}{" "}
                professional
                {visibleWorkers.length !==
                1
                  ? "s"
                  : ""}{" "}
                found
              </p>

              {locationAvailable &&
                sortBy ===
                  "nearest" && (
                  <p className="text-[#6FA8AA] font-bold text-xs">
                    📍 Nearest first
                  </p>
                )}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <WorkerSkeleton
                  key={index}
                />
              ))}
            </div>
          ) : visibleWorkers.length ===
            0 ? (
            <div className="bg-white/90 rounded-[28px] p-10 text-center border border-white shadow-xl">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E5F3F2] text-[#08566E] flex items-center justify-center text-2xl">
                <FaSearch />
              </div>

              <h3 className="text-xl font-black text-[#08566E] mt-4">
                No professionals found
              </h3>

              <p className="text-[#6FA8AA] font-semibold mt-2">
                Try another service,
                worker name or area.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {visibleWorkers.map(
                (worker, index) => {
                  const workerName =
                    getWorkerName(
                      worker
                    );

                  const service =
                    getWorkerService(
                      worker
                    );

                  const image =
                    getWorkerImage(
                      worker
                    );

                  const rating =
                    getWorkerRating(
                      worker
                    );

                  const trust =
                    getTrustScore(
                      worker
                    );

                  const distance =
                    worker.__distanceKm;

                  const available =
                    isAvailable(
                      worker
                    );

                  return (
                    <article
                      key={`${getWorkerId(
                        worker
                      ) || workerName}-${index}`}
                      className="group bg-white/90 backdrop-blur-xl border border-white/80 rounded-[28px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Image */}
                      <div className="relative h-56 bg-[#08566E]">

                        {image ? (
                          <img
                            src={image}
                            alt={workerName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(
                              event
                            ) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#08566E] to-[#9ECFD0]">
                            <span className="text-7xl">
                              👷
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

                        {/* Status */}
                        <div className="absolute top-3 left-3">
                          {available ? (
                            <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                              <FaUserCheck />
                              Available
                            </span>
                          ) : (
                            <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg">
                              Busy
                            </span>
                          )}
                        </div>

                        {/* Certificate */}
                        {getWorkerCertificate(
                          worker
                        ) && (
                          <a
                            href={getWorkerCertificate(
                              worker
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute top-3 right-3 bg-white text-[#08566E] px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >
                            <FaCertificate />
                            Certificate
                          </a>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-xl font-black truncate">
                            {workerName}
                          </h3>

                          <p className="text-[#D9F4F2] font-bold text-sm">
                            {getServiceText(
                              service
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="p-4">

                        <div className="grid grid-cols-3 gap-2">

                          <div className="bg-[#F6F8F7] rounded-2xl p-2 text-center">
                            <FaStar className="mx-auto text-yellow-500" />

                            <p className="text-[10px] text-[#6FA8AA] font-black mt-1">
                              Rating
                            </p>

                            <p className="text-[#08566E] font-black text-sm">
                              {rating}
                            </p>
                          </div>

                          <div className="bg-[#F6F8F7] rounded-2xl p-2 text-center">
                            <FaShieldAlt className="mx-auto text-[#0A7F88]" />

                            <p className="text-[10px] text-[#6FA8AA] font-black mt-1">
                              Trust
                            </p>

                            <p className="text-[#08566E] font-black text-sm">
                              {trust}%
                            </p>
                          </div>

                          <div className="bg-[#F6F8F7] rounded-2xl p-2 text-center">
                            <FaClock className="mx-auto text-[#0A7F88]" />

                            <p className="text-[10px] text-[#6FA8AA] font-black mt-1">
                              Experience
                            </p>

                            <p className="text-[#08566E] font-black text-xs">
                              {getWorkerExperience(
                                worker
                              ) || "—"}
                            </p>
                          </div>

                        </div>

                        <div className="mt-3 flex items-center gap-2 text-[#6FA8AA]">
                          <FaMapMarkerAlt className="shrink-0" />

                          <span className="text-xs font-bold truncate">
                            {getWorkerLocation(
                              worker
                            )}
                          </span>
                        </div>

                        {distance !==
                          null && (
                          <div className="mt-2 flex items-center gap-2 text-[#08566E]">
                            <FaLocationArrow className="shrink-0" />

                            <span className="text-xs font-black">
                              {formatDistance(
                                distance
                              )}{" "}
                              away
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-4">

                          <button
                            type="button"
                            onClick={() =>
                              openWorkerDetails(
                                worker
                              )
                            }
                            className="py-2.5 rounded-xl bg-[#E5F3F2] text-[#08566E] font-black text-sm"
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            disabled={
                              !available
                            }
                            onClick={() =>
                              handleBookWorker(
                                worker
                              )
                            }
                            className={`py-2.5 rounded-xl font-black text-sm ${
                              available
                                ? "bg-[#08566E] text-white hover:bg-[#06485C]"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {available
                              ? "Book Now"
                              : "Busy"}
                          </button>

                        </div>

                      </div>
                    </article>
                  );
                }
              )}

            </div>
          )}

        </div>
      </section>

      {/* ==================================================
          WORKER DETAILS MODAL
      ================================================== */}

      {detailsWorker && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

          <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[32px] bg-[#E1E9E5] shadow-2xl border border-white">

            {/* Close */}
            <button
              type="button"
              onClick={() =>
                setDetailsWorker(null)
              }
              className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/90 text-[#08566E] flex items-center justify-center shadow-xl"
            >
              <FaTimes />
            </button>

            {/* Hero */}
            <div className="relative h-64 bg-[#08566E]">

              {getWorkerImage(
                detailsWorker
              ) ? (
                <img
                  src={getWorkerImage(
                    detailsWorker
                  )}
                  alt={getWorkerName(
                    detailsWorker
                  )}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(
                    event
                  ) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#08566E] to-[#9ECFD0]">
                  <span className="text-7xl">
                    👷
                  </span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <h2 className="text-3xl font-black">
                  {getWorkerName(
                    detailsWorker
                  )}
                </h2>

                <p className="text-[#D9F4F2] font-bold mt-1">
                  {getServiceText(
                    getWorkerService(
                      detailsWorker
                    )
                  )}
                </p>
              </div>

              <div className="absolute top-4 left-4">
                {isAvailable(
                  detailsWorker
                ) ? (
                  <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1">
                    <FaUserCheck />
                    Available
                  </span>
                ) : (
                  <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-black">
                    Busy
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 pb-7">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">

                <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC]">
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

                <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC]">
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

                <div className="bg-white rounded-2xl p-3 text-center border border-[#B4DBDC]">
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

              {/* Distance */}
              {getWorkerDistance(
                detailsWorker
              ) !== null && (
                <div className="mt-3 bg-[#E8F7F5] border border-[#B4DBDC] rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#08566E] text-white flex items-center justify-center">
                    <FaLocationArrow />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#6FA8AA] font-black">
                      Distance from you
                    </p>

                    <p className="text-[#08566E] font-black">
                      {formatDistance(
                        getWorkerDistance(
                          detailsWorker
                        )
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Professional Details */}
              <div className="mt-4 bg-white rounded-3xl p-4 border border-[#B4DBDC]">

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

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[#6FA8AA] font-bold text-sm">
                      Experience
                    </span>

                    <span className="text-[#08566E] font-black text-sm">
                      {getWorkerExperience(
                        detailsWorker
                      ) || "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[#6FA8AA] font-bold text-sm">
                      Location
                    </span>

                    <span className="text-[#08566E] font-black text-sm text-right">
                      {getWorkerLocation(
                        detailsWorker
                      )}
                    </span>
                  </div>

                </div>
              </div>

              {/* Certificate */}
              {getWorkerCertificate(
                detailsWorker
              ) && (
                <a
                  href={getWorkerCertificate(
                    detailsWorker
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white border border-[#B4DBDC] text-[#08566E] font-black"
                >
                  <FaCertificate />
                  View Certificate
                </a>
              )}

              {/* Booking */}
              <button
                type="button"
                disabled={
                  !isAvailable(
                    detailsWorker
                  )
                }
                onClick={() =>
                  handleBookWorker(
                    detailsWorker
                  )
                }
                className={`mt-5 w-full py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition ${
                  isAvailable(
                    detailsWorker
                  )
                    ? "bg-[#08566E] text-[#E1E9E5] hover:bg-[#06485C] active:scale-[0.98]"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                <FaBolt />

                {isAvailable(
                  detailsWorker
                )
                  ? "Book Now"
                  : "Worker Currently Busy"}
              </button>

              {/* Footnote */}
              <div className="mt-4 flex items-start gap-2 justify-center">
                <FaClock className="text-[#6FA8AA] mt-0.5 shrink-0" />

                <p className="text-center text-[#6FA8AA] text-xs font-semibold leading-relaxed">
                  Final service price depends
                  on inspection, actual issue
                  and work required.
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