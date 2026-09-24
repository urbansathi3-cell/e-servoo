import { useEffect, useState } from "react";

import {
  FaTimes,
  FaCheckCircle,
  FaBolt,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaTools,
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaStar,
  FaChevronRight,
  FaCertificate,
} from "react-icons/fa";

import LocationPicker from "./LocationPicker";
import { getStoredUser, getStoredToken } from "../utils/storage";

const API_URL = "/api/booking";

function BookingForm({ selectedWorker, setSelectedWorker }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    issueDescription: "",
    urgency: "Normal",
    service: "",
    worker: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // =
  // LOCATION
  // =

  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [serviceLocation, setServiceLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });

  // =
  // WORKER HELPERS
  // =

  const getWorkerValue = (keys, fallback = "") => {
    if (!selectedWorker) return fallback;

    for (const key of keys) {
      if (
        selectedWorker[key] !== undefined &&
        selectedWorker[key] !== null &&
        selectedWorker[key] !== ""
      ) {
        return selectedWorker[key];
      }
    }

    return fallback;
  };

  const getWorkerId = () =>
    getWorkerValue(
      [
        "id",
        "ID",
        "WorkerID",
        "WorkerId",
        "workerID",
        "workerId",
        "workerid",
        "Worker id",
        "worker id",
      ],
      ""
    );

  const getWorkerName = () =>
    getWorkerValue(
      [
        "name",
        "Name",
        "worker",
        "Worker",
        "workerName",
        "WorkerName",
        "workername",
        "Worker Name",
        "worker name",
      ],
      ""
    );

  const getWorkerService = () =>
    getWorkerValue(
      [
        "service",
        "Service",
        "services",
        "Services",
        "category",
        "Category",
      ],
      ""
    );

  // =
  // LOAD USER DETAILS
  // =

  useEffect(() => {
    if (!selectedWorker) return;

    const user = getStoredUser();

    const savedAddress = user?.address || "";

    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: savedAddress,
      issueDescription: "",
      urgency: "Normal",
      service: getWorkerService(),
      worker: getWorkerName(),
    });

    setAcceptedTerms(false);
    setSuccess(false);
    setBookingId(false);

    setServiceLocation({
      address: savedAddress,
      latitude: null,
      longitude: null,
    });
  }, [selectedWorker]);

  // =
  // ANALYTICS
  // =

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "booking_form",
      ...extraData,
    });
  };

  // =
  // FORM CHANGE
  // =

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Keep typed address synchronized.
    if (name === "address") {
      setServiceLocation((previous) => ({
        ...previous,
        address: value,
      }));
    }
  };

  const changeUrgency = (urgency) => {
    setFormData((previous) => ({
      ...previous,
      urgency,
    }));
  };

  // =
  // RESET
  // =

  const resetBookingForm = () => {
    setSuccess(false);
    setBookingId("");
    setAcceptedTerms(false);
    setLoading(false);
    setShowLocationPicker(false);

    setServiceLocation({
      address: "",
      latitude: null,
      longitude: null,
    });

    setFormData({
      name: "",
      phone: "",
      address: "",
      issueDescription: "",
      urgency: "Normal",
      service: "",
      worker: "",
    });

    setSelectedWorker(null);
  };

  // =
  // CLOSE
  // =

  const closeBooking = () => {
    if (loading) return;

    setShowLocationPicker(false);
    setSelectedWorker(null);
  };

  // =
  // SUBMIT BOOKING
  // =

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const cleanPhone = String(formData.phone || "").replace(/\D/g, "");

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!formData.name.trim()) {
      alert("Name is required.");
      return;
    }

    if (cleanPhone.length < 10) {
      alert("Enter a valid phone number.");
      return;
    }

    if (!serviceLocation.address.trim()) {
      alert("Please select your service location.");
      return;
    }

    if (
      serviceLocation.latitude === null ||
      serviceLocation.longitude === null
    ) {
      alert("Please confirm your location on the map.");
      return;
    }

    if (!formData.issueDescription.trim()) {
      alert("Please describe your issue.");
      return;
    }

    if (!acceptedTerms) {
      alert("Please accept Terms and Conditions before booking.");
      return;
    }

    setLoading(true);

    try {
      // -----------------------------------------------------
      // WORKER
      // -----------------------------------------------------

      const workerId = getWorkerId();

      const finalService =
        formData.service || getWorkerService();

      const finalWorker =
        formData.worker || getWorkerName();

      // -----------------------------------------------------
      // USER
      // -----------------------------------------------------

      const storedUser = getStoredUser();
      const storedToken = getStoredToken();

      // -----------------------------------------------------
      // PAYLOAD
      // -----------------------------------------------------

      const payload = {
        action: "booking",

        token: storedToken || "",

        // Worker ID
        workerId,
        WorkerID: workerId,
        selectedWorkerId: workerId,

        // Worker name
        worker: finalWorker,
        Worker: finalWorker,
        workerName: finalWorker,
        WorkerName: finalWorker,
        selectedWorkerName: finalWorker,

        // Service
        service: finalService,
        Service: finalService,
        selectedService: finalService,
        category: finalService,

        // Customer
        name: formData.name.trim(),
        phone: cleanPhone,
        email: storedUser?.email || "",

        // Booking
        address: serviceLocation.address.trim(),
        latitude: serviceLocation.latitude,
        longitude: serviceLocation.longitude,

        issueDescription:
          formData.issueDescription.trim(),

        urgency: formData.urgency,

        // Terms
        acceptedTerms: true,
      };

      console.log("=====");
      console.log("E-SERVOO BOOKING");
      console.log("=====");
      console.log("Worker:", selectedWorker);
      console.log("Worker ID:", workerId);
      console.log("Worker Name:", finalWorker);
      console.log("Service:", finalService);
      console.log("Payload:", payload);
      console.log("API:", API_URL);

      // -----------------------------------------------------
      // API REQUEST
      // -----------------------------------------------------

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(
        "Booking response status:",
        response.status
      );

      // -----------------------------------------------------
      // RESPONSE
      // -----------------------------------------------------

      const responseText = await response.text();

      console.log(
        "Raw booking response:",
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error(
          "Could not parse booking response:",
          error
        );

        data = {
          success: false,
          message:
            responseText ||
            "Invalid response from booking server.",
        };
      }

      console.log(
        "Parsed booking response:",
        data
      );

      // -----------------------------------------------------
      // SERVER ERROR
      // -----------------------------------------------------

      if (!response.ok) {
        setLoading(false);

        alert(
          data?.message ||
            `Booking server returned error ${response.status}.`
        );

        return;
      }

      // -----------------------------------------------------
      // BOOKING FAILED
      // -----------------------------------------------------

      if (data?.success === false) {
        setLoading(false);

        alert(
          data?.message ||
            "Booking failed. Please try again."
        );

        return;
      }

      // -----------------------------------------------------
      // WORKER STATUS
      // -----------------------------------------------------

      if (data?.statusUpdated === false) {
        console.warn(
          "Worker status was not updated:",
          data
        );
      }

      // -----------------------------------------------------
      // BOOKING ID
      // -----------------------------------------------------

      const finalBookingId =
        data?.bookingId ||
        data?.BookingID ||
        data?.bookingID ||
        data?.id ||
        `BK-${Date.now()}`;

      setBookingId(finalBookingId);

      // -----------------------------------------------------
      // ANALYTICS
      // -----------------------------------------------------

      pushEvent("booking_success", {
        booking_id: finalBookingId,
        service_name: finalService,
        urgency: formData.urgency,
        accepted_terms: true,
        worker_status_updated:
          Boolean(data?.statusUpdated),
      });

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      setLoading(false);
      setSuccess(true);

      console.log(
        "Booking completed successfully:",
        finalBookingId
      );
    } catch (error) {
      console.error(
        "Booking request failed:",
        error
      );

      setLoading(false);

      alert(
        "Booking failed. Please check your internet connection and try again."
      );
    }
  };

  // =
  // NO WORKER
  // =

  if (!selectedWorker) {
    return null;
  }

  // =
  // WORKER DISPLAY DATA
  // =

  const workerName =
    getWorkerName() || "Worker";

  const workerService =
    getWorkerService() || "Service";

  const workerImage = getWorkerValue(
    ["image", "Image", "photo", "Photo"],
    ""
  );

  const workerStatus = getWorkerValue(
    ["status", "Status", "availability"],
    "Available"
  );

  const workerRating = getWorkerValue(
    ["rating", "Rating"],
    "4.8"
  );

  const workerTrustScore = getWorkerValue(
    [
      "TrustScore",
      "trustScore",
      "trustscore",
      "Trust Score",
      "trust score",
    ],
    "95"
  );

  const workerLocation = getWorkerValue(
    ["location", "Location"],
    "Nearby"
  );

  const workerExperience = getWorkerValue(
    ["experience", "Experience"],
    "Experienced"
  );

  const certificateLink = getWorkerValue(
    [
      "CertificateLink",
      "certificateLink",
      "Certificate Link",
    ],
    ""
  );

  const isAvailable =
    String(workerStatus).toLowerCase() === "available";

  // =
  // URGENCY OPTIONS
  // =

  const urgencyOptions = [
    {
      value: "Normal",
      title: "Normal",
      subtitle: "Regular help",
      icon: <FaClock />,
      active:
        "bg-[#08566E] text-white border-[#08566E]",
    },
    {
      value: "Urgent",
      title: "Urgent",
      subtitle: "Faster help",
      icon: <FaBolt />,
      active:
        "bg-orange-500 text-white border-orange-500",
    },
    {
      value: "Emergency",
      title: "Emergency",
      subtitle: "Immediate",
      icon: <FaExclamationTriangle />,
      active:
        "bg-red-600 text-white border-red-600",
    },
  ];

  // =
  // UI
  // =

  return (
    <>
      {/* ====
          SUCCESS SCREEN
      ==== */}

      {success && (
        <div className="fixed inset-0 z-[500] bg-[#043A4A]/80 backdrop-blur-md flex items-center justify-center px-4">
          <div className="relative w-full max-w-[400px] max-h-[90dvh] overflow-y-auto bg-[#F8FCFA] rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.45)] p-6">
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#9ECFD0]/60 rounded-full blur-3xl pointer-events-none" />

            <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-[#6FA8AA]/50 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-4xl shadow-xl">
                  <FaCheckCircle />
                </div>
              </div>

              <p className="text-center text-[10px] font-black tracking-[0.25em] text-[#6FA8AA] mt-5 uppercase">
                E-SERVOO
              </p>

              <h2 className="text-center text-2xl font-black text-[#043A4A] mt-1">
                Booking Successful
              </h2>

              <p className="text-center text-sm font-semibold text-[#08566E] mt-2">
                Your service request has been placed.
              </p>

              <div className="mt-5 bg-white rounded-2xl border border-[#B4DBDC] p-4 text-center">
                <p className="text-[10px] text-[#6FA8AA] font-black tracking-widest">
                  BOOKING ID
                </p>

                <p className="text-xl font-black text-[#043A4A] mt-1 break-all">
                  {bookingId}
                </p>
              </div>

              <div className="mt-4 bg-white rounded-2xl border border-[#B4DBDC] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 font-black uppercase">
                      Worker
                    </p>

                    <p className="text-base font-black text-[#043A4A] truncate">
                      {formData.worker}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E] shrink-0">
                    <FaUser />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E]">
                    <FaTools />
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase">
                      Service
                    </p>

                    <p className="text-sm font-black text-[#043A4A]">
                      {formData.service}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E]">
                    <FaClock />
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase">
                      Priority
                    </p>

                    <p className="text-sm font-black text-[#043A4A]">
                      {formData.urgency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#EAF6F5] border border-[#B4DBDC] rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <FaClipboardCheck className="text-[#08566E] mt-0.5 shrink-0" />

                  <div>
                    <p className="text-xs font-black text-[#043A4A]">
                      Inspection-Based Pricing
                    </p>

                    <p className="text-xs font-semibold text-[#08566E] mt-1 leading-relaxed">
                      No fixed service charge is shown.
                      The final amount will be determined
                      after inspection based on the actual
                      issue and required work.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 justify-center">
                <FaShieldAlt className="text-green-600 mt-0.5" />

                <p className="text-xs text-gray-500 font-semibold text-center">
                  Our team will contact you shortly.
                </p>
              </div>

              <button
                type="button"
                onClick={resetBookingForm}
                className="w-full mt-5 py-4 rounded-2xl bg-gradient-to-r from-[#043A4A] via-[#08566E] to-[#0A7F88] text-white font-black shadow-xl active:scale-[0.98] transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====
          BOOKING MODAL
      ==== */}

      <div className="fixed inset-0 z-[200] bg-[#DDE8E8]">
        <div className="relative mx-auto w-full max-w-[430px] h-[100dvh] sm:h-auto sm:aspect-[9/16] sm:max-h-[calc(100dvh-2rem)] bg-[#F7FAF9] overflow-hidden shadow-2xl">
          {/* TOP BAR */}

          <div className="absolute top-0 left-0 right-0 z-[50] h-[64px] bg-white/95 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={closeBooking}
              disabled={loading}
              className="w-10 h-10 rounded-full bg-[#F1F5F4] flex items-center justify-center text-[#043A4A] active:scale-95 transition disabled:opacity-50"
              aria-label="Close booking"
            >
              <FaTimes />
            </button>

            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#6FA8AA]">
                E-SERVOO
              </p>

              <p className="text-sm font-black text-[#043A4A]">
                Book Service
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#EAF6F5] flex items-center justify-center text-[#08566E]">
              <FaShieldAlt />
            </div>
          </div>

          {/* CONTENT */}

          <div className="h-full overflow-y-auto pb-10 pt-[64px]">
            {/* WORKER HERO */}

            <section className="bg-white">
              <div className="relative w-full h-[245px] bg-[#DDEBE9]">
                <img
                  src={workerImage || "/logo.png"}
                  alt={workerName}
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.src = "/logo.png";
                  }}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                <div className="absolute left-4 right-4 bottom-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        isAvailable
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {isAvailable
                        ? "AVAILABLE"
                        : "BUSY"}
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-white/90 text-[#043A4A] text-[10px] font-black flex items-center gap-1">
                      <FaCheckCircle className="text-green-600" />
                      VERIFIED
                    </span>
                  </div>

                  <h1 className="text-2xl font-black text-white mt-2 drop-shadow-lg truncate">
                    {workerName}
                  </h1>

                  <p className="text-sm font-bold text-white/90 truncate">
                    {workerService}
                  </p>
                </div>
              </div>

              {/* STATS */}

              <div className="grid grid-cols-3 divide-x border-b border-gray-200">
                <div className="py-4 text-center">
                  <p className="text-sm font-black text-[#043A4A] flex items-center justify-center gap-1">
                    {workerRating}
                    <FaStar className="text-yellow-500 text-xs" />
                  </p>

                  <p className="text-[10px] text-gray-500 font-bold mt-1">
                    Rating
                  </p>
                </div>

                <div className="py-4 text-center">
                  <p className="text-sm font-black text-[#043A4A]">
                    {workerTrustScore}%
                  </p>

                  <p className="text-[10px] text-gray-500 font-bold mt-1">
                    Trust
                  </p>
                </div>

                <div className="py-4 text-center">
                  <p className="text-sm font-black text-[#043A4A] truncate px-2">
                    {workerExperience}
                  </p>

                  <p className="text-[10px] text-gray-500 font-bold mt-1">
                    Experience
                  </p>
                </div>
              </div>
            </section>

            {/* PRICING */}

            <section className="bg-white mt-2 px-4 py-5 border-y border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E] text-xl shrink-0">
                  <FaClipboardCheck />
                </div>

                <div>
                  <p className="text-[10px] font-black text-[#6FA8AA] uppercase tracking-widest">
                    PRICING
                  </p>

                  <h3 className="text-lg font-black text-[#043A4A] mt-1">
                    Inspection-Based Pricing
                  </h3>

                  <p className="text-sm text-gray-600 font-semibold mt-1 leading-relaxed">
                    The final amount will be determined
                    after the worker inspects the actual
                    issue and required work.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#F1F9F8] border border-[#B4DBDC] p-3">
                <div className="flex items-start gap-2">
                  <FaShieldAlt className="text-[#08566E] mt-0.5 shrink-0" />

                  <p className="text-xs text-[#043A4A] font-bold leading-relaxed">
                    No fixed service charge is displayed
                    before inspection.
                  </p>
                </div>
              </div>
            </section>

            {/* SERVICE INFORMATION */}

            <section className="bg-white mt-2 px-4 py-5 border-y border-gray-200">
              <h3 className="text-lg font-black text-[#043A4A]">
                Service Information
              </h3>

              <div className="mt-4 space-y-3">
                {/* LOCATION */}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E] shrink-0">
                    <FaMapMarkerAlt />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 font-black">
                      SERVICE AREA
                    </p>

                    <p className="text-sm font-black text-[#043A4A] truncate">
                      {workerLocation}
                    </p>
                  </div>
                </div>

                {/* SERVICE */}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E] shrink-0">
                    <FaTools />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 font-black">
                      SERVICE
                    </p>

                    <p className="text-sm font-black text-[#043A4A] truncate">
                      {workerService}
                    </p>
                  </div>
                </div>

                {/* CERTIFICATE */}

                {certificateLink && (
                  <a
                    href={certificateLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between bg-[#F5FAF9] border border-[#B4DBDC] rounded-2xl p-3 active:scale-[0.99] transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E] shrink-0">
                        <FaCertificate />
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          VERIFICATION
                        </p>

                        <p className="text-sm font-black text-[#043A4A]">
                          View Certificate
                        </p>
                      </div>
                    </div>

                    <FaChevronRight className="text-[#08566E]" />
                  </a>
                )}
              </div>
            </section>

            {/* BOOKING FORM */}

            <section className="bg-white mt-2 px-4 py-5 border-y border-gray-200">
              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6FA8AA]">
                  SERVICE REQUEST
                </p>

                <h2 className="text-2xl font-black text-[#043A4A] mt-1">
                  Your Details
                </h2>

                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Your saved information is pre-filled.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* NAME */}

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-[#043A4A]">
                    <FaUser />
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full mt-2 p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#B4DBDC] text-[#043A4A] placeholder:text-gray-400 outline-none focus:border-[#08566E] font-bold disabled:opacity-60"
                    required
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-[#043A4A]">
                    <FaPhoneAlt />
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    inputMode="numeric"
                    className="w-full mt-2 p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#B4DBDC] text-[#043A4A] placeholder:text-gray-400 outline-none focus:border-[#08566E] font-bold disabled:opacity-60"
                    required
                  />
                </div>

                {/* SERVICE LOCATION */}

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-[#043A4A]">
                    <FaMapMarkerAlt />
                    Service Location
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setShowLocationPicker(true)
                    }
                    disabled={loading}
                    className="w-full mt-2 rounded-2xl border border-[#B4DBDC] bg-[#F4FAFA] p-4 text-left flex items-center gap-3 active:scale-[0.99] transition disabled:opacity-60"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#08566E] text-white flex items-center justify-center shrink-0">
                      <FaMapMarkerAlt />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-black text-[#08566E] text-sm">
                        {serviceLocation.address
                          ? "Change Service Location"
                          : "Select Service Location"}
                      </p>

                      <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed break-words">
                        {serviceLocation.address ||
                          "Use your current location or select a point on the map"}
                      </p>

                      {serviceLocation.latitude !==
                        null &&
                        serviceLocation.longitude !==
                          null && (
                          <p className="text-[10px] text-[#6FA8AA] font-black mt-2">
                            {serviceLocation.latitude.toFixed(
                              6
                            )}
                            ,{" "}
                            {serviceLocation.longitude.toFixed(
                              6
                            )}
                          </p>
                        )}
                    </div>

                    <FaChevronRight className="text-[#08566E] shrink-0" />
                  </button>

                  <p className="text-[10px] text-gray-500 font-semibold mt-2 px-1">
                    Exact location helps the worker reach you
                    correctly.
                  </p>

                  {/* Manual address fallback/display */}

                  <input
                    type="text"
                    name="address"
                    placeholder="Or enter complete service address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full mt-3 p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#B4DBDC] text-[#043A4A] placeholder:text-gray-400 outline-none focus:border-[#08566E] font-bold disabled:opacity-60"
                  />
                </div>

                {/* URGENCY */}

                <div>
                  <label className="text-xs font-black text-[#043A4A]">
                    Select Urgency
                  </label>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {urgencyOptions.map((option) => {
                      const isActive =
                        formData.urgency ===
                        option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            changeUrgency(option.value)
                          }
                          className={`rounded-2xl p-3 border text-left transition active:scale-[0.97] disabled:opacity-60 ${
                            isActive
                              ? `${option.active} shadow-lg`
                              : "bg-[#F8FCFA] border-[#B4DBDC] text-[#043A4A]"
                          }`}
                        >
                          <div className="text-lg">
                            {option.icon}
                          </div>

                          <p className="text-xs font-black mt-1">
                            {option.title}
                          </p>

                          <p
                            className={`text-[9px] mt-1 font-bold ${
                              isActive
                                ? "text-white/90"
                                : "text-gray-500"
                            }`}
                          >
                            {option.subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ISSUE */}

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-[#043A4A]">
                    <FaTools />
                    Describe Your Issue
                  </label>

                  <textarea
                    name="issueDescription"
                    placeholder="Example: Fan is not working, switch board issue..."
                    value={formData.issueDescription}
                    onChange={handleChange}
                    disabled={loading}
                    rows="4"
                    className="w-full mt-2 p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#B4DBDC] text-[#043A4A] placeholder:text-gray-400 outline-none focus:border-[#08566E] font-bold resize-none disabled:opacity-60"
                    required
                  />
                </div>

                {/* SUMMARY */}

                <div className="bg-[#043A4A] rounded-3xl p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#9ECFD0] text-[10px] font-black uppercase tracking-widest">
                        BOOKING SUMMARY
                      </p>

                      <p className="text-white text-sm font-black mt-1">
                        Review your request
                      </p>
                    </div>

                    <FaClipboardCheck className="text-[#9ECFD0]" />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between gap-4">
                      <span className="text-[#D9F4F2] text-xs font-bold">
                        Worker
                      </span>

                      <span className="text-white text-xs font-black text-right">
                        {workerName}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-[#D9F4F2] text-xs font-bold">
                        Service
                      </span>

                      <span className="text-white text-xs font-black text-right">
                        {workerService}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-[#D9F4F2] text-xs font-bold">
                        Urgency
                      </span>

                      <span className="text-white text-xs font-black text-right">
                        {formData.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 bg-white/10 border border-white/20 rounded-2xl p-3">
                    <div className="flex items-start gap-2">
                      <FaClipboardCheck className="text-[#9ECFD0] mt-0.5 shrink-0" />

                      <div>
                        <p className="text-white text-xs font-black">
                          Inspection-Based Pricing
                        </p>

                        <p className="text-[#D9F4F2] text-[11px] font-semibold mt-1 leading-relaxed">
                          Final pricing will be determined
                          after inspection based on the actual
                          issue and required work.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TERMS */}

                <div
                  className={`rounded-3xl p-4 border transition ${
                    acceptedTerms
                      ? "bg-green-50 border-green-500"
                      : "bg-[#F8FCFA] border-[#B4DBDC]"
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      disabled={loading}
                      onChange={(event) =>
                        setAcceptedTerms(
                          event.target.checked
                        )
                      }
                      className="mt-1 w-5 h-5 accent-[#08566E] shrink-0"
                    />

                    <span className="text-[#043A4A] text-xs font-bold leading-relaxed">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#08566E] font-black underline"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        Terms and Conditions
                      </a>{" "}
                      of E-SERVOO before booking this
                      service.
                    </span>
                  </label>

                  {!acceptedTerms && (
                    <p className="text-red-600 text-[11px] font-black mt-3">
                      Please accept Terms and Conditions
                      to continue.
                    </p>
                  )}

                  {acceptedTerms && (
                    <p className="text-green-700 text-[11px] font-black mt-3">
                      ✅ Terms accepted. You can now confirm
                      your booking.
                    </p>
                  )}
                </div>

                {/* CONFIRM BUTTON */}

                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className={`w-full py-4 rounded-3xl text-base font-black transition flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] ${
                    loading || !acceptedTerms
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-[#043A4A] via-[#08566E] to-[#0A7F88] text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : !acceptedTerms ? (
                    "Accept Terms to Continue"
                  ) : (
                    <>
                      <FaBolt />
                      Confirm Booking
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-gray-500 font-semibold leading-relaxed px-4">
                  By confirming this booking, you request
                  service from the selected worker. Final
                  pricing will be determined after inspection.
                </p>
              </form>
            </section>

            {/* VERIFIED INFO */}

            <section className="px-4 py-6 bg-[#F1F7F6]">
              <div className="bg-white rounded-3xl border border-[#B4DBDC] p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E] shrink-0">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <p className="text-sm font-black text-[#043A4A]">
                      E-SERVOO Verified Service
                    </p>

                    <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                      Worker details, service information
                      and verification details are shown
                      before you confirm your booking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-6" />
            </section>
          </div>

          {/* LOCATION PICKER */}

          {showLocationPicker && (
            <LocationPicker
              initialLocation={
                serviceLocation.latitude !== null &&
                serviceLocation.longitude !== null
                  ? {
                      lat: serviceLocation.latitude,
                      lng: serviceLocation.longitude,
                    }
                  : null
              }
              onClose={() =>
                setShowLocationPicker(false)
              }
              onConfirm={(location) => {
                const selectedAddress =
                  location.address ||
                  "Selected map location";

                setServiceLocation({
                  address: selectedAddress,
                  latitude: location.latitude,
                  longitude: location.longitude,
                });

                setFormData((previous) => ({
                  ...previous,
                  address: selectedAddress,
                }));

                setShowLocationPicker(false);
              }}
            />
          )}

          {/* BOTTOM SAFE AREA */}

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7FAF9] to-transparent z-40" />
        </div>
      </div>
    </>
  );
}

export default BookingForm;