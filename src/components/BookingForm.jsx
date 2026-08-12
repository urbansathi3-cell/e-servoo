import { useState, useEffect } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaBolt,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaHome,
  FaTools,
  FaRupeeSign,
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle,
  FaClipboardCheck,
} from "react-icons/fa";

import { getStoredUser, getStoredToken } from "../utils/storage";

// IMPORTANT:
// Do NOT put the Google Apps Script URL here.
//
// BookingForm -> Vercel /api/booking -> Google Apps Script
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

  const inputCardClass =
    "bg-[#F8FCFA] border border-[#6FA8AA]/60 rounded-3xl p-4 shadow-sm";

  const labelClass =
    "flex items-center gap-2 text-[#043A4A] font-black text-sm";

  const inputClass =
    "w-full mt-3 bg-white text-[#043A4A] placeholder:text-[#3F7F8B] outline-none font-bold px-4 py-3 rounded-2xl border border-[#B4DBDC] focus:border-[#08566E]";

  const textareaClass =
    "w-full mt-3 bg-white text-[#043A4A] placeholder:text-[#3F7F8B] outline-none font-bold px-4 py-3 rounded-2xl border border-[#B4DBDC] focus:border-[#08566E] resize-none";

  // =========================================================
  // WORKER DATA HELPERS
  // =========================================================

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

  const getWorkerId = () => {
    return getWorkerValue(
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
  };

  const getWorkerName = () => {
    return getWorkerValue(
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
  };

  const getWorkerService = () => {
    return getWorkerValue(
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
  };

  // =========================================================
  // LOAD USER + SELECTED WORKER
  // =========================================================

  useEffect(() => {
    if (!selectedWorker) return;

    const user = getStoredUser();

    const service = getWorkerService();
    const worker = getWorkerName();

    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      issueDescription: "",
      urgency: "Normal",
      service,
      worker,
    });

    setAcceptedTerms(false);
  }, [selectedWorker]);

  // =========================================================
  // ANALYTICS EVENT
  // =========================================================

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "booking_form",
      ...extraData,
    });
  };

  // =========================================================
  // FORM HANDLERS
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const changeUrgency = (urgency) => {
    setFormData((previous) => ({
      ...previous,
      urgency,
    }));
  };

  // =========================================================
  // RESET AFTER SUCCESS
  // =========================================================

  const resetBookingForm = () => {
    setSuccess(false);
    setBookingId("");
    setAcceptedTerms(false);
    setSelectedWorker(null);

    setFormData({
      name: "",
      phone: "",
      address: "",
      issueDescription: "",
      urgency: "Normal",
      service: "",
      worker: "",
    });
  };

  // =========================================================
  // SUBMIT BOOKING
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent double submission
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
      alert("Enter valid phone number.");
      return;
    }

    if (!formData.address.trim()) {
      alert("Address is required.");
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
      // WORKER DETAILS
      // -----------------------------------------------------

      const workerId = getWorkerId();

      const finalService =
        formData.service || getWorkerService();

      const finalWorker =
        formData.worker || getWorkerName();

      // -----------------------------------------------------
      // GET CURRENT USER
      // -----------------------------------------------------

      const storedUser = getStoredUser();
      const storedToken = getStoredToken();

      // -----------------------------------------------------
      // BOOKING PAYLOAD
      // -----------------------------------------------------

      const payload = {
        action: "booking",

        // Authentication
        token: storedToken || "",

        // Worker ID
        workerId: workerId,
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

        // Booking details
        address: formData.address.trim(),
        issueDescription: formData.issueDescription.trim(),
        urgency: formData.urgency,

        // Terms
        acceptedTerms: true,
      };

      console.log(
        "========================================"
      );
      console.log("E-SERVOO BOOKING");
      console.log("========================================");
      console.log("Selected worker:", selectedWorker);
      console.log("Worker ID:", workerId);
      console.log("Worker:", finalWorker);
      console.log("Service:", finalService);
      console.log("Payload:", payload);
      console.log("API:", API_URL);

      // -----------------------------------------------------
      // CALL VERCEL API
      //
      // IMPORTANT:
      // This does NOT call Google Apps Script directly.
      //
      // Browser
      //    ↓
      // /api/booking
      //    ↓
      // Vercel Serverless Function
      //    ↓
      // APPS_SCRIPT_URL
      //    ↓
      // Google Apps Script
      //    ↓
      // Google Sheets
      // -----------------------------------------------------

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      console.log(
        "Vercel response status:",
        response.status
      );

      // -----------------------------------------------------
      // READ RESPONSE SAFELY
      // -----------------------------------------------------

      const responseText = await response.text();

      console.log(
        "Raw booking response:",
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "Could not parse booking response as JSON:",
          parseError
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
      // WORKER STATUS WARNING
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

  // =========================================================
  // NO WORKER SELECTED
  // =========================================================

  if (!selectedWorker) {
    return null;
  }

  // =========================================================
  // WORKER DISPLAY DATA
  // =========================================================

  const workerName =
    getWorkerName() || "Worker";

  const workerService =
    getWorkerService() || "Service";

  const workerImage = getWorkerValue(
    ["image", "Image", "photo", "Photo"],
    ""
  );

  const workerFare = getWorkerValue(
    ["fare", "Fare", "price", "Price"],
    "Not Available"
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

  // =========================================================
  // URGENCY OPTIONS
  // =========================================================

  const urgencyOptions = [
    {
      value: "Normal",
      title: "Normal",
      subtitle: "Regular time",
      icon: <FaClock />,
      activeClass:
        "bg-[#08566E] text-[#E1E9E5]",
    },
    {
      value: "Urgent",
      title: "Urgent",
      subtitle: "Faster help",
      icon: <FaBolt />,
      activeClass:
        "bg-orange-500 text-white",
    },
    {
      value: "Emergency",
      title: "Emergency",
      subtitle: "Immediate",
      icon: <FaExclamationTriangle />,
      activeClass:
        "bg-red-600 text-white",
    },
  ];

  // =========================================================
  // RETURN UI
  // =========================================================

  return (
    <>
      {/* =====================================================
          SUCCESS POPUP
      ===================================================== */}

      {success && (
        <div className="fixed inset-0 bg-[#053D4F]/65 backdrop-blur-md flex justify-center items-center z-[140] px-5">
          <div className="relative bg-[#F8FCFA] shadow-[0_30px_90px_rgba(8,86,110,0.45)] p-7 rounded-[32px] border border-white/80 text-center max-w-md w-full overflow-hidden">
            <div className="absolute -top-20 -left-20 w-44 h-44 bg-[#9ECFD0] rounded-full blur-3xl opacity-70"></div>

            <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-[#6FA8AA] rounded-full blur-3xl opacity-60"></div>

            <div className="relative">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl">
                <FaCheckCircle />
              </div>

              <h2 className="text-3xl font-black text-[#043A4A] mt-5">
                Booking Successful
              </h2>

              <p className="mt-2 text-sm font-bold text-[#08566E]">
                Your service request has been placed.
              </p>

              <p className="mt-4 text-lg font-black text-[#043A4A] bg-white rounded-2xl px-4 py-3 border border-[#B4DBDC]">
                Booking ID: {bookingId}
              </p>

              <div className="mt-5 bg-white rounded-3xl p-4 text-left border border-[#B4DBDC]">
                <p className="text-[#043A4A] font-bold">
                  Worker: {formData.worker}
                </p>

                <p className="text-[#043A4A] font-bold mt-2">
                  Service: {formData.service}
                </p>

                <p className="text-[#043A4A] font-bold mt-2">
                  Priority: {formData.urgency}
                </p>

                <p className="text-[#08566E] font-semibold mt-2">
                  Issue: {formData.issueDescription}
                </p>

                <p className="text-green-700 font-black mt-3">
                  ✅ Terms & Conditions accepted
                </p>
              </div>

              <p className="mt-4 text-[#08566E] font-semibold">
                Our team will contact you shortly.
              </p>

              <button
                type="button"
                onClick={resetBookingForm}
                className="mt-6 w-full bg-[#08566E] text-[#E1E9E5] px-6 py-3.5 rounded-2xl font-black shadow-xl hover:bg-[#06485C] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          BOOKING MODAL
      ===================================================== */}

      <div className="fixed inset-0 bg-[#053D4F]/60 backdrop-blur-md z-[100] flex items-end lg:items-center justify-center px-2 lg:px-4">
        <div className="relative w-[calc(100vw-16px)] lg:w-[min(980px,calc(100vw-32px))] max-h-[94vh] overflow-y-auto overflow-x-hidden bg-[#F2FAF8] border border-white/80 shadow-[0_25px_90px_rgba(8,86,110,0.45)] rounded-t-[34px] lg:rounded-[34px]">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#9ECFD0] rounded-full blur-3xl opacity-45"></div>

          <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#6FA8AA] rounded-full blur-3xl opacity-45"></div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={() => setSelectedWorker(null)}
            className="absolute top-4 right-4 z-30 w-11 h-11 bg-white text-[#043A4A] border border-[#B4DBDC] rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition"
            aria-label="Close booking form"
          >
            <FaTimes />
          </button>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
            {/* =================================================
                LEFT WORKER PANEL
            ================================================= */}

            <div className="relative bg-gradient-to-br from-[#032F3D] via-[#07566E] to-[#087C86] p-6 lg:p-8 text-white overflow-hidden rounded-t-[34px] lg:rounded-l-[34px] lg:rounded-tr-none">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/20 rounded-full blur-3xl"></div>

              <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#9ECFD0]/25 rounded-full blur-3xl"></div>

              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E1E9E5]">
                  E-SERVOO Booking
                </p>

                <h2
                  className="text-3xl lg:text-4xl font-black mt-4 leading-tight drop-shadow-xl"
                  style={{
                    color: "#FFFFFF",
                    textShadow:
                      "0 4px 18px rgba(0,0,0,0.35)",
                  }}
                >
                  Confirm Your Service
                </h2>

                <p
                  className="font-bold mt-4 text-sm lg:text-base leading-relaxed drop-shadow-md"
                  style={{
                    color: "#FFFFFF",
                    textShadow:
                      "0 2px 10px rgba(0,0,0,0.28)",
                  }}
                >
                  Verified local worker, transparent visiting
                  charge and quick booking.
                </p>

                {/* WORKER CARD */}

                <div className="mt-7 bg-white/15 border border-white/30 backdrop-blur-xl rounded-[28px] p-5 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <img
                      src={workerImage || "/logo.png"}
                      alt={workerName}
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.src =
                          "/logo.png";
                      }}
                      className="w-24 h-24 rounded-[28px] object-cover bg-[#F8FCFA] border-4 border-white shadow-xl"
                    />

                    <div className="min-w-0">
                      <p className="text-[#E1E9E5] text-xs font-black">
                        Booking With
                      </p>

                      <h3
                        className="text-2xl font-black mt-1 truncate drop-shadow-md"
                        style={{
                          color: "#FFFFFF",
                          textShadow:
                            "0 3px 12px rgba(0,0,0,0.35)",
                        }}
                      >
                        {workerName}
                      </h3>

                      <p className="text-[#E1E9E5] font-bold mt-1">
                        {workerService}
                      </p>

                      <span
                        className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-black ${
                          String(workerStatus).toLowerCase() ===
                          "available"
                            ? "bg-green-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {workerStatus}
                      </span>
                    </div>
                  </div>

                  {/* WORKER STATS */}

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-[#F8FCFA] text-[#043A4A] rounded-3xl p-4 border border-white shadow-md">
                      <div className="flex items-center gap-2 text-[#08566E] text-xs font-black">
                        <FaRupeeSign />
                        Charge
                      </div>

                      <p className="text-xl font-black mt-1 text-[#043A4A]">
                        {String(workerFare)
                          .toLowerCase()
                          .includes("not")
                          ? workerFare
                          : `₹${workerFare}`}
                      </p>
                    </div>

                    <div className="bg-[#F8FCFA] text-[#043A4A] rounded-3xl p-4 border border-white shadow-md">
                      <div className="flex items-center gap-2 text-[#08566E] text-xs font-black">
                        <FaShieldAlt />
                        Trust
                      </div>

                      <p className="text-xl font-black mt-1 text-[#043A4A]">
                        {workerTrustScore}
                      </p>
                    </div>

                    <div className="bg-[#F8FCFA] text-[#043A4A] rounded-3xl p-4 border border-white shadow-md">
                      <div className="flex items-center gap-2 text-[#08566E] text-xs font-black">
                        ⭐ Rating
                      </div>

                      <p className="text-xl font-black mt-1 text-[#043A4A]">
                        {workerRating}
                      </p>
                    </div>

                    <div className="bg-[#F8FCFA] text-[#043A4A] rounded-3xl p-4 border border-white shadow-md">
                      <div className="flex items-center gap-2 text-[#08566E] text-xs font-black">
                        <FaMapMarkerAlt />
                        Area
                      </div>

                      <p className="text-sm font-black mt-1 truncate text-[#043A4A]">
                        {workerLocation}
                      </p>
                    </div>
                  </div>

                  {/* EXPERIENCE */}

                  <div className="mt-4 bg-[#F8FCFA] text-[#043A4A] rounded-3xl p-4 border border-white shadow-md">
                    <p className="text-xs font-black text-[#08566E]">
                      Experience
                    </p>

                    <p className="font-black mt-1 text-[#043A4A]">
                      {workerExperience}
                    </p>
                  </div>
                </div>

                {/* INFO */}

                <div className="mt-5 flex items-center gap-3 bg-white/15 border border-white/25 rounded-3xl p-4">
                  <FaClipboardCheck className="text-2xl text-white shrink-0" />

                  <p className="text-sm font-bold text-[#E1E9E5]">
                    Submit booking details. Worker status will
                    change to Busy after confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT BOOKING FORM
            ================================================= */}

            <div className="relative p-5 lg:p-8 bg-[#F2FAF8]">
              <div className="mb-6 pr-12">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0A7F88]">
                  Service Form
                </p>

                <h2 className="text-3xl lg:text-4xl font-black text-[#043A4A] mt-1">
                  Book Now
                </h2>

                <p className="text-[#08566E] text-sm font-bold mt-2">
                  Your saved details are pre-filled. Update only
                  if needed.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid gap-4"
              >
                {/* NAME + PHONE */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={inputCardClass}>
                    <label className={labelClass}>
                      <FaUser />
                      Your Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className={inputCardClass}>
                    <label className={labelClass}>
                      <FaPhoneAlt />
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* ADDRESS */}

                <div className={inputCardClass}>
                  <label className={labelClass}>
                    <FaHome />
                    Service Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Your service address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                {/* URGENCY */}

                <div>
                  <label className="text-[#043A4A] font-black text-sm">
                    Select Urgency
                  </label>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {urgencyOptions.map((option) => {
                      const isActive =
                        formData.urgency ===
                        option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            changeUrgency(
                              option.value
                            )
                          }
                          className={`rounded-3xl p-3 border font-black text-left transition ${
                            isActive
                              ? `${option.activeClass} border-transparent shadow-xl scale-[1.02]`
                              : "bg-[#F8FCFA] border-[#6FA8AA]/50 text-[#043A4A] hover:bg-white"
                          }`}
                        >
                          <div className="text-lg">
                            {option.icon}
                          </div>

                          <p className="text-sm mt-2">
                            {option.title}
                          </p>

                          <p
                            className={`text-[10px] mt-1 font-bold ${
                              isActive
                                ? "text-white/90"
                                : "text-[#08566E]"
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

                <div className={inputCardClass}>
                  <label className={labelClass}>
                    <FaTools />
                    Describe Your Issue
                  </label>

                  <textarea
                    name="issueDescription"
                    placeholder="Example: Fan is not working, switch board issue..."
                    value={formData.issueDescription}
                    onChange={handleChange}
                    className={textareaClass}
                    rows="4"
                    required
                  />
                </div>

                {/* BOOKING SUMMARY */}

                <div className="bg-[#043A4A] text-white rounded-3xl p-4 shadow-xl">
                  <p className="text-[#D9F4F2] text-xs font-black">
                    Booking Summary
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
                    <p>
                      <span className="text-[#D9F4F2] font-bold">
                        Worker:
                      </span>{" "}
                      <span className="font-black text-white">
                        {workerName}
                      </span>
                    </p>

                    <p>
                      <span className="text-[#D9F4F2] font-bold">
                        Service:
                      </span>{" "}
                      <span className="font-black text-white">
                        {workerService}
                      </span>
                    </p>

                    <p>
                      <span className="text-[#D9F4F2] font-bold">
                        Urgency:
                      </span>{" "}
                      <span className="font-black text-white">
                        {formData.urgency}
                      </span>
                    </p>

                    <p>
                      <span className="text-[#D9F4F2] font-bold">
                        Charge:
                      </span>{" "}
                      <span className="font-black text-white">
                        {String(workerFare)
                          .toLowerCase()
                          .includes("not")
                          ? workerFare
                          : `₹${workerFare}`}
                      </span>
                    </p>
                  </div>
                </div>

                {/* TERMS */}

                <div
                  className={`rounded-3xl p-4 border shadow-sm transition ${
                    acceptedTerms
                      ? "bg-green-50 border-green-500"
                      : "bg-[#F8FCFA] border-[#6FA8AA]/60"
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(event) =>
                        setAcceptedTerms(
                          event.target.checked
                        )
                      }
                      className="mt-1 w-5 h-5 accent-[#08566E] shrink-0"
                    />

                    <span className="text-[#043A4A] text-sm font-bold leading-relaxed">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#08566E] font-black underline hover:text-[#043A4A]"
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
                    <p className="text-red-600 text-xs font-black mt-3">
                      Please accept Terms and Conditions to
                      continue booking.
                    </p>
                  )}

                  {acceptedTerms && (
                    <p className="text-green-700 text-xs font-black mt-3">
                      ✅ Terms accepted. You can now confirm
                      booking.
                    </p>
                  )}
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    loading || !acceptedTerms
                  }
                  className={`w-full py-4 rounded-3xl text-lg font-black transition duration-300 flex items-center justify-center gap-3 shadow-xl ${
                    loading || !acceptedTerms
                      ? "bg-gray-500 text-white cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-[#043A4A] via-[#08566E] to-[#0A7F88] text-white hover:scale-[1.01]"
                  }`}
                >
                  {loading ? (
                    "Booking..."
                  ) : !acceptedTerms ? (
                    "Accept Terms to Continue"
                  ) : (
                    <>
                      <FaBolt />
                      Confirm Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingForm;