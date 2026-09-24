import { useEffect, useState } from "react";
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
  FaTimes,
} from "react-icons/fa";

function Hero({
  language = "en",
  customerLocation,
  setCustomerLocation,
}) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  /*
   * =========================================================
   * TEXT
   * =========================================================
   */

  const text = {
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
        ? "Verified local professionals aur smart assignment — ek hi platform par."
        : language === "od"
          ? "Verified local professionals ଏବଂ smart assignment — ସବୁ ଗୋଟିଏ platform ରେ।"
          : "Verified local professionals and smart assignment — all in one place.",

    book:
      language === "hi"
        ? "Book Service"
        : language === "od"
          ? "ସେବା ବୁକ୍ କରନ୍ତୁ"
          : "Book Service",

    services:
      language === "hi"
        ? "Services"
        : language === "od"
          ? "ସେବା"
          : "Services",

    bookings:
      language === "hi"
        ? "Bookings"
        : language === "od"
          ? "ବୁକିଂ"
          : "Bookings",

    rewards:
      language === "hi"
        ? "Rewards"
        : language === "od"
          ? "ପୁରସ୍କାର"
          : "Rewards",

    profile:
      language === "hi"
        ? "Profile"
        : language === "od"
          ? "ପ୍ରୋଫାଇଲ୍"
          : "Profile",

    location:
      language === "hi"
        ? "Service Location"
        : language === "od"
          ? "ସେବା ସ୍ଥାନ"
          : "Service Location",

    selectLocation:
      language === "hi"
        ? "Use your current location"
        : language === "od"
          ? "ଆପଣଙ୍କ ବର୍ତ୍ତମାନ ସ୍ଥାନ ବ୍ୟବହାର କରନ୍ତୁ"
          : "Use your current location",

    search:
      language === "hi"
        ? "Search for a service..."
        : language === "od"
          ? "ସେବା ଖୋଜନ୍ତୁ..."
          : "Search for a service...",

    smartAssignment:
      language === "hi"
        ? "Smart Assignment"
        : language === "od"
          ? "Smart Assignment"
          : "Smart Assignment",

    locationGetting:
      language === "hi"
        ? "Location detect ho rahi hai..."
        : language === "od"
          ? "ସ୍ଥାନ ଚିହ୍ନଟ ହେଉଛି..."
          : "Detecting your location...",

    locationReady:
      language === "hi"
        ? "Location confirmed"
        : language === "od"
          ? "ସ୍ଥାନ ନିଶ୍ଚିତ ହୋଇଛି"
          : "Location confirmed",

    nearbyWorkers:
      language === "hi"
        ? "Nearby Workers"
        : language === "od"
          ? "ନିକଟସ୍ଥ କର୍ମଚାରୀ"
          : "Nearby Workers",

    locationPermission:
      language === "hi"
        ? "Nearby workers dekhne ke liye location allow karein."
        : language === "od"
          ? "ନିକଟସ୍ଥ କର୍ମଚାରୀ ଦେଖିବା ପାଇଁ ସ୍ଥାନ ଅନୁମତି ଦିଅନ୍ତୁ।"
          : "Allow location access to find nearby workers.",

    locationDenied:
      language === "hi"
        ? "Location permission allow nahi hui. Browser settings se location allow karein."
        : language === "od"
          ? "ସ୍ଥାନ ଅନୁମତି ମିଳିଲା ନାହିଁ। Browser settings ରୁ location allow କରନ୍ତୁ।"
          : "Location permission was not granted. Please allow location from your browser settings.",

    locationUnsupported:
      language === "hi"
        ? "Aapke browser me location support nahi hai."
        : language === "od"
          ? "ଆପଣଙ୍କ browser ରେ location support ନାହିଁ।"
          : "Location is not supported by this browser.",

    retryLocation:
      language === "hi"
        ? "Try Again"
        : language === "od"
          ? "ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ"
          : "Try Again",
  };

  /*
   * =========================================================
   * ANALYTICS
   * =========================================================
   */

  const pushEvent = (eventName, extraData = {}) => {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "hero",
      ...extraData,
    });
  };

  /*
   * =========================================================
   * LOCATION
   * =========================================================
   */

  const hasCustomerLocation =
    customerLocation &&
    typeof customerLocation.latitude === "number" &&
    typeof customerLocation.longitude === "number";

  const getCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("GEOLOCATION_NOT_SUPPORTED"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000,
        }
      );
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const url =
        "https://nominatim.openstreetmap.org/reverse" +
        "?format=jsonv2" +
        `&lat=${encodeURIComponent(latitude)}` +
        `&lon=${encodeURIComponent(longitude)}` +
        "&zoom=18" +
        "&addressdetails=1";

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Reverse geocoding failed: ${response.status}`
        );
      }

      const data = await response.json();

      return data?.display_name || "Current Location";
    } catch (error) {
      console.warn("Reverse geocoding failed:", error);

      return "Current Location";
    }
  };

  const requestCustomerLocation = async () => {
    if (locationLoading) return;

    setLocationLoading(true);
    setLocationError("");

    pushEvent("location_request_started");

    try {
      const coordinates = await getCoordinates();

      const address = await reverseGeocode(
        coordinates.latitude,
        coordinates.longitude
      );

      const locationData = {
        address,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        accuracy: coordinates.accuracy,
      };

      /*
       * Update App.jsx state
       */
      if (typeof setCustomerLocation === "function") {
        setCustomerLocation(locationData);
      }

      /*
       * Broadcast location event
       */
      window.dispatchEvent(
        new CustomEvent("eservoo-location-updated", {
          detail: locationData,
        })
      );

      /*
       * Save local backup
       */
      try {
        localStorage.setItem(
          "eservoo_customer_location",
          JSON.stringify(locationData)
        );
      } catch (storageError) {
        console.warn(
          "Unable to save location locally:",
          storageError
        );
      }

      pushEvent("location_request_success", {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        accuracy: coordinates.accuracy,
      });
    } catch (error) {
      console.warn("Customer location error:", error);

      let message = text.locationDenied;

      if (
        error?.message ===
        "GEOLOCATION_NOT_SUPPORTED"
      ) {
        message = text.locationUnsupported;
      } else if (error?.code === 1) {
        message = text.locationDenied;
      } else if (error?.code === 2) {
        message =
          language === "hi"
            ? "Location detect nahi ho pa rahi. GPS/location ON karke dobara try karein."
            : language === "od"
              ? "ସ୍ଥାନ ଚିହ୍ନଟ ହେଉନାହିଁ। GPS/location ON କରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।"
              : "Unable to detect your location. Turn on GPS/location and try again.";
      } else if (error?.code === 3) {
        message =
          language === "hi"
            ? "Location request timeout ho gaya. Dobara try karein."
            : language === "od"
              ? "ସ୍ଥାନ request timeout ହୋଇଛି। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।"
              : "Location request timed out. Please try again.";
      }

      setLocationError(message);

      pushEvent("location_request_failed", {
        error_code: error?.code || "unknown",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (hasCustomerLocation) {
      setLocationError("");
    }
  }, [
    customerLocation?.latitude,
    customerLocation?.longitude,
  ]);

  /*
   * =========================================================
   * NAVIGATION
   * =========================================================
   */

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

    if (hasCustomerLocation) {
      navigate("/services");
      return;
    }

    requestCustomerLocation();
  };

  const handleNearbyWorkers = () => {
    pushEvent("nearby_workers_click", {
      has_customer_location: hasCustomerLocation,
    });

    if (!hasCustomerLocation) {
      requestCustomerLocation();
      return;
    }

    navigate("/services");
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-[#F5F9F8] text-[#043A4A] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            INTRO
        ====================================================== */}

        <section className="pt-8 sm:pt-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#0A9B70]" />

                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.14em] text-[#6A888D]">
                  {text.welcome}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#08566E]">
                {text.title}
              </h1>

              <p className="mt-2 text-sm sm:text-base font-bold text-[#315D67] max-w-xl">
                {text.subtitle}
              </p>

              <p className="mt-2 text-xs sm:text-sm text-[#6A888D] max-w-lg leading-relaxed">
                {text.description}
              </p>
            </div>

            {/* VERIFIED BADGE */}

            <div className="hidden sm:flex items-center gap-3 bg-white border border-[#DCE9E7] rounded-2xl px-4 py-3 shadow-sm">

              <div className="w-9 h-9 rounded-xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center">
                <FaUserCheck className="text-sm" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#08566E]">
                  Verified
                </p>

                <p className="text-[8px] font-bold text-[#7A969A]">
                  Local Professionals
                </p>
              </div>

              <FaCheckCircle className="text-[#0A9B70] text-sm" />
            </div>
          </div>
        </section>

        {/* =====================================================
            LOCATION + SEARCH
        ====================================================== */}

        <section className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-3">

          {/* LOCATION */}

          <button
            type="button"
            onClick={handleLocation}
            disabled={locationLoading}
            className="
              group
              w-full
              bg-white
              border border-[#DCE9E7]
              rounded-2xl
              px-4 py-3.5
              flex items-center gap-3
              text-left
              shadow-sm
              hover:border-[#9ECFD0]
              hover:shadow-md
              transition
              active:scale-[0.99]
              disabled:opacity-80
            "
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center shrink-0">
              {locationLoading ? (
                <FaLocationArrow className="text-sm animate-pulse" />
              ) : (
                <FaMapMarkerAlt className="text-sm" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[8px] uppercase tracking-[0.12em] text-[#8AA7AA] font-black">
                {hasCustomerLocation
                  ? text.locationReady
                  : text.location}
              </p>

              <p className="mt-0.5 text-xs font-black text-[#043A4A] truncate">
                {locationLoading
                  ? text.locationGetting
                  : hasCustomerLocation
                    ? customerLocation?.address ||
                      "Current Location"
                    : text.selectLocation}
              </p>
            </div>

            {hasCustomerLocation ? (
              <span className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <FaCheckCircle className="text-xs" />
              </span>
            ) : (
              <FaChevronRight className="text-[#9AB5B8] text-xs group-hover:text-[#08566E]" />
            )}
          </button>

          {/* SEARCH */}

          <button
            type="button"
            onClick={handleServices}
            className="
              w-full
              bg-white
              border border-[#DCE9E7]
              rounded-2xl
              px-4 py-3.5
              flex items-center gap-3
              text-left
              shadow-sm
              hover:border-[#9ECFD0]
              hover:shadow-md
              transition
              active:scale-[0.99]
            "
          >
            <FaSearch className="text-[#6FA8AA] text-sm" />

            <span className="text-xs font-bold text-[#8AA1A4]">
              {text.search}
            </span>
          </button>
        </section>

        {/* =====================================================
            LOCATION ERROR
        ====================================================== */}

        {locationError && (
          <div className="mt-3 bg-red-50 border border-red-100 rounded-2xl px-3 py-2.5">
            <div className="flex items-start gap-2">

              <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                <FaTimes className="text-[9px]" />
              </div>

              <div className="flex-1">
                <p className="text-[8px] text-red-700 font-bold leading-relaxed">
                  {locationError}
                </p>

                <button
                  type="button"
                  onClick={requestCustomerLocation}
                  disabled={locationLoading}
                  className="mt-1.5 text-[8px] text-[#08566E] font-black underline"
                >
                  {text.retryLocation}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            SMART SERVICE CTA
        ====================================================== */}

        <section className="mt-5">
          <div className="
            relative
            overflow-hidden
            bg-[#08566E]
            rounded-[24px]
            p-5 sm:p-7
            shadow-[0_12px_35px_rgba(8,86,110,0.15)]
          ">

            <div className="absolute right-[-50px] top-[-70px] w-48 h-48 rounded-full bg-white/[0.04]" />

            <div className="absolute left-[-70px] bottom-[-90px] w-56 h-56 rounded-full bg-[#9ECFD0]/[0.06]" />

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div className="max-w-xl">

                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1">
                  <FaBolt className="text-[#B4DBDC] text-[9px]" />

                  <span className="text-[8px] font-black tracking-[0.12em] text-[#DDEDEC] uppercase">
                    Smart Service
                  </span>
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Service when
                  <br className="sm:hidden" />
                  {" "}you need it.
                </h2>

                <p className="mt-2 text-[10px] sm:text-xs text-[#B4DBDC] leading-relaxed max-w-md">
                  Tell us what you need. E-SERVOO helps connect you with the right verified professional.
                </p>
              </div>

              <button
                type="button"
                onClick={handleBookNow}
                className="
                  shrink-0
                  bg-[#E1E9E5]
                  text-[#08566E]
                  rounded-xl
                  px-5 py-3
                  font-black
                  text-xs
                  flex items-center justify-center gap-2
                  hover:bg-white
                  transition
                  active:scale-95
                  shadow-sm
                "
              >
                <FaBolt className="text-[10px]" />

                {text.book}

                <FaArrowRight className="text-[9px]" />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            POPULAR SERVICES
        ====================================================== */}

        <section className="mt-7">

          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#043A4A]">
                Popular Services
              </h2>

              <p className="text-[9px] sm:text-[10px] text-[#7A969A] font-semibold mt-0.5">
                Trusted professionals near you
              </p>
            </div>

            <button
              type="button"
              onClick={handleServices}
              className="text-[9px] font-black text-[#08566E] uppercase tracking-wider hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            {/* ELECTRICIAN */}

            <button
              type="button"
              onClick={handleServices}
              className="
                bg-white
                border border-[#DCE9E7]
                rounded-2xl
                p-4
                text-left
                shadow-sm
                hover:-translate-y-0.5
                hover:shadow-md
                hover:border-[#9ECFD0]
                transition
              "
            >
              <div className="w-10 h-10 rounded-xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center">
                <FaBolt className="text-sm" />
              </div>

              <p className="mt-3 text-xs font-black text-[#043A4A]">
                Electrician
              </p>

              <p className="mt-1 text-[8px] font-semibold text-[#7A969A]">
                Electrical work
              </p>
            </button>

            {/* PLUMBER */}

            <button
              type="button"
              onClick={handleServices}
              className="
                bg-white
                border border-[#DCE9E7]
                rounded-2xl
                p-4
                text-left
                shadow-sm
                hover:-translate-y-0.5
                hover:shadow-md
                hover:border-[#9ECFD0]
                transition
              "
            >
              <div className="w-10 h-10 rounded-xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center">
                <FaWrench className="text-sm" />
              </div>

              <p className="mt-3 text-xs font-black text-[#043A4A]">
                Plumber
              </p>

              <p className="mt-1 text-[8px] font-semibold text-[#7A969A]">
                Plumbing service
              </p>
            </button>

            {/* CLEANER */}

            <button
              type="button"
              onClick={handleServices}
              className="
                bg-white
                border border-[#DCE9E7]
                rounded-2xl
                p-4
                text-left
                shadow-sm
                hover:-translate-y-0.5
                hover:shadow-md
                hover:border-[#9ECFD0]
                transition
              "
            >
              <div className="w-10 h-10 rounded-xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center">
                <FaBroom className="text-sm" />
              </div>

              <p className="mt-3 text-xs font-black text-[#043A4A]">
                Cleaner
              </p>

              <p className="mt-1 text-[8px] font-semibold text-[#7A969A]">
                Home cleaning
              </p>
            </button>

            {/* COOK */}

            <button
              type="button"
              onClick={handleServices}
              className="
                bg-white
                border border-[#DCE9E7]
                rounded-2xl
                p-4
                text-left
                shadow-sm
                hover:-translate-y-0.5
                hover:shadow-md
                hover:border-[#9ECFD0]
                transition
              "
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFF4E4] text-[#D98520] flex items-center justify-center">
                <FaUtensils className="text-sm" />
              </div>

              <p className="mt-3 text-xs font-black text-[#043A4A]">
                Cook
              </p>

              <p className="mt-1 text-[8px] font-semibold text-[#7A969A]">
                Home cooking
              </p>
            </button>
          </div>
        </section>

        {/* =====================================================
            SMART ASSIGNMENT
        ====================================================== */}

        <section className="mt-7">

          <div className="flex items-center justify-between mb-3">

            <div>
              <h2 className="text-sm sm:text-base font-black text-[#043A4A]">
                {text.smartAssignment}
              </h2>

              <p className="text-[9px] sm:text-[10px] text-[#7A969A] font-semibold mt-0.5">
                We help find the right professional for your request
              </p>
            </div>

            <span className="flex items-center gap-1.5 text-[8px] font-black text-[#0A9B70] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A9B70]" />
              Active
            </span>
          </div>

          <div className="bg-white border border-[#DCE9E7] rounded-[22px] p-4 sm:p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="relative w-12 h-12 rounded-2xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center shrink-0">

                <FaTools className="text-base" />

                <span className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-[#0A9B70] text-white border-2 border-white flex items-center justify-center text-[8px]">
                  ✓
                </span>
              </div>

              <div className="flex-1 min-w-0">

                <p className="text-[8px] uppercase tracking-wider text-[#6FA8AA] font-black">
                  Best Match
                </p>

                <p className="mt-0.5 text-sm font-black text-[#08566E]">
                  {hasCustomerLocation
                    ? "Nearby Professional"
                    : "Verified Professional"}
                </p>

                <div className="flex items-center gap-3 mt-1">

                  <span className="flex items-center gap-1 text-[9px] font-bold text-[#6A777A]">
                    <FaStar className="text-[#E4A72C]" />
                    4.9
                  </span>

                  <span className="text-[#C3CDCE]">
                    •
                  </span>

                  <span className="text-[9px] font-bold text-[#6A777A]">
                    {hasCustomerLocation
                      ? "Location Ready"
                      : "Nearby"}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block text-right">

                <p className="text-[8px] font-bold text-[#9AAEB0]">
                  Trust Score
                </p>

                <p className="text-lg font-black text-[#08566E]">
                  96%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-4">

              <div className="rounded-xl bg-[#F3F8F7] p-3 text-center">
                <FaMapMarkerAlt className="mx-auto text-[#08566E] text-xs" />

                <p className="mt-1 text-[8px] font-black text-[#6A888D]">
                  {hasCustomerLocation
                    ? "Location"
                    : "Nearby"}
                </p>
              </div>

              <div className="rounded-xl bg-[#F3F8F7] p-3 text-center">
                <FaClock className="mx-auto text-[#08566E] text-xs" />

                <p className="mt-1 text-[8px] font-black text-[#6A888D]">
                  Quick ETA
                </p>
              </div>

              <div className="rounded-xl bg-[#F3F8F7] p-3 text-center">
                <FaShieldAlt className="mx-auto text-[#08566E] text-xs" />

                <p className="mt-1 text-[8px] font-black text-[#6A888D]">
                  Verified
                </p>
              </div>
            </div>

            {/* NEARBY WORKERS */}

            <button
              type="button"
              onClick={handleNearbyWorkers}
              className={`
                mt-4
                w-full
                rounded-2xl
                py-3
                flex
                items-center
                justify-center
                gap-2
                font-black
                text-[9px]
                transition
                active:scale-[0.98]
                ${
                  hasCustomerLocation
                    ? "bg-[#08566E] text-white shadow-md"
                    : "bg-[#E7F4F3] text-[#08566E] border border-[#CFE4E2]"
                }
              `}
            >
              <FaLocationArrow />

              {hasCustomerLocation
                ? text.nearbyWorkers
                : text.locationPermission}

              <FaArrowRight className="text-[8px]" />
            </button>

            {/* BOOK BUTTON */}

            <button
              type="button"
              onClick={handleBookNow}
              className="
                mt-2.5
                w-full
                bg-[#043A4A]
                hover:bg-[#08566E]
                text-white
                rounded-2xl
                py-3
                flex
                items-center
                justify-center
                gap-2
                text-xs
                font-black
                transition
                active:scale-[0.98]
              "
            >
              <FaBolt className="text-[10px]" />

              {text.book}

              <FaArrowRight className="text-[9px]" />
            </button>
          </div>
        </section>

        {/* =====================================================
            TRUST FEATURES
        ====================================================== */}

        <section className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* VERIFIED */}

          <div className="bg-white border border-[#DCE9E7] rounded-2xl p-4 flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center">
              <FaShieldAlt className="text-xs" />
            </div>

            <div>
              <p className="text-[10px] font-black text-[#08566E]">
                Verified
              </p>

              <p className="text-[8px] text-[#7A969A] font-semibold">
                Trusted professionals
              </p>
            </div>
          </div>

          {/* HYPERLOCAL */}

          <div className="bg-white border border-[#DCE9E7] rounded-2xl p-4 flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center">
              <FaRoute className="text-xs" />
            </div>

            <div>
              <p className="text-[10px] font-black text-[#08566E]">
                Hyperlocal
              </p>

              <p className="text-[8px] text-[#7A969A] font-semibold">
                Professionals nearby
              </p>
            </div>
          </div>

          {/* SUPPORT */}

          <div className="bg-white border border-[#DCE9E7] rounded-2xl p-4 flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-[#E8F5F2] text-[#08566E] flex items-center justify-center">
              <FaHeadset className="text-xs" />
            </div>

            <div>
              <p className="text-[10px] font-black text-[#08566E]">
                Support
              </p>

              <p className="text-[8px] text-[#7A969A] font-semibold">
                Service assistance
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK NAVIGATION
        ====================================================== */}

        <section className="mt-7">

          <div className="bg-white border border-[#DCE9E7] rounded-[22px] p-2 shadow-sm">

            <div className="grid grid-cols-4 gap-1">

              <button
                type="button"
                onClick={() => navigate("/")}
                className="
                  rounded-xl
                  py-3
                  flex flex-col
                  items-center
                  gap-1
                  text-[#08566E]
                  bg-[#F0F7F6]
                  transition
                  active:scale-95
                "
              >
                <FaHome className="text-xs" />

                <span className="text-[8px] font-black">
                  Home
                </span>
              </button>

              <button
                type="button"
                onClick={handleServices}
                className="
                  rounded-xl
                  py-3
                  flex flex-col
                  items-center
                  gap-1
                  text-[#6A888D]
                  hover:bg-[#F3F8F7]
                  transition
                  active:scale-95
                "
              >
                <FaTools className="text-xs" />

                <span className="text-[8px] font-black">
                  {text.services}
                </span>
              </button>

              <button
                type="button"
                onClick={handleBookings}
                className="
                  rounded-xl
                  py-3
                  flex flex-col
                  items-center
                  gap-1
                  text-[#6A888D]
                  hover:bg-[#F3F8F7]
                  transition
                  active:scale-95
                "
              >
                <FaClipboardList className="text-xs" />

                <span className="text-[8px] font-black">
                  {text.bookings}
                </span>
              </button>

              <button
                type="button"
                onClick={handleProfile}
                className="
                  rounded-xl
                  py-3
                  flex flex-col
                  items-center
                  gap-1
                  text-[#6A888D]
                  hover:bg-[#F3F8F7]
                  transition
                  active:scale-95
                "
              >
                <FaUser className="text-xs" />

                <span className="text-[8px] font-black">
                  {text.profile}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="mt-5">

          <button
            type="button"
            onClick={handleBookNow}
            className="
              w-full
              bg-[#043A4A]
              hover:bg-[#08566E]
              text-white
              rounded-2xl
              py-3.5
              flex
              items-center
              justify-center
              gap-2
              text-xs
              font-black
              transition
              active:scale-[0.99]
            "
          >
            <FaBolt className="text-[10px]" />

            {text.book}

            <FaArrowRight className="text-[9px]" />
          </button>
        </section>

        {/* =====================================================
            FOOTNOTE
        ====================================================== */}

        <div className="py-6 text-center">
          <p className="text-[8px] sm:text-[9px] text-[#91A5A7] font-semibold">
            E-SERVOO • Smart Hyperlocal Service Network
          </p>
        </div>

      </div>
    </main>
  );
}

export default Hero;