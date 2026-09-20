import { useEffect, useState } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaBolt,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaHome,
  FaTools,
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaStar,
  FaChevronRight,
  FaCertificate,
} from "react-icons/fa";

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

  // =========================================================
  // WORKER HELPERS
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

  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {
    if (!selectedWorker) return;

    const user = getStoredUser();

    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      issueDescription: "",
      urgency: "Normal",
      service: getWorkerService(),
      worker: getWorkerName(),
    });

    setAcceptedTerms(false);
  }, [selectedWorker]);

  // =========================================================
  // ANALYTICS
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
  // FORM
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
  // RESET
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
      // USER
      // -----------------------------------------------------

      const storedUser = getStoredUser();
      const storedToken = getStoredToken();

      // -----------------------------------------------------
      // BOOKING PAYLOAD
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
      // VERCEL API
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
      // READ RESPONSE
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

  // =========================================================
  // URGENCY
  // =========================================================

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

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {/* =====================================================
          SUCCESS POPUP
      ===================================================== */}

      {success && (
        <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex items-center justify-center px-4">

          <div className="relative w-full max-w-[390px] bg-[#F8FCFA] rounded-[30px] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] text-center overflow-hidden">

            <div className="absolute -top-20 -left-20 w-44 h-44 bg-[#9ECFD0] rounded-full blur-3xl"></div>

            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#6FA8AA] rounded-full blur-3xl"></div>

            <div className="relative">

              <div className="w-20 h-20 mx-auto rounded-full bg-green-600 text-white flex items-center justify-center text-4xl shadow-xl">
                <FaCheckCircle />
              </div>

              <h2 className="text-2xl font-black text-[#043A4A] mt-5">
                Booking Successful
              </h2>

              <p className="text-sm font-semibold text-[#08566E] mt-2">
                Your service request has been placed.
              </p>

              <div className="mt-5 bg-white rounded-2xl border border-[#B4DBDC] p-4">

                <p className="text-xs text-[#6FA8AA] font-black">
                  BOOKING ID
                </p>

                <p className="text-xl font-black text-[#043A4A] mt-1 break-all">
                  {bookingId}
                </p>

              </div>

              <div className="mt-4 bg-white rounded-2xl border border-[#B4DBDC] p-4 text-left">

                <p className="font-black text-[#043A4A]">
                  {formData.worker}
                </p>

                <p className="text-sm font-bold text-[#08566E] mt-1">
                  {formData.service}
                </p>

                <p className="text-sm font-semibold text-[#08566E] mt-2">
                  Priority: {formData.urgency}
                </p>

                <div className="mt-3 bg-[#EAF6F5] rounded-xl p-3">
                  <p className="text-xs font-black text-[#08566E]">
                    PRICING
                  </p>

                  <p className="text-xs font-semibold text-[#043A4A] mt-1 leading-relaxed">
                    Service charge is inspection-based.
                    The final amount will be determined
                    after inspection.
                  </p>
                </div>

              </div>

              <p className="text-sm font-semibold text-[#08566E] mt-4">
                Our team will contact you shortly.
              </p>

              <button
                type="button"
                onClick={resetBookingForm}
                className="w-full mt-5 py-3.5 rounded-2xl bg-[#08566E] text-white font-black shadow-xl active:scale-[0.98] transition"
              >
                Done
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE SHOPPING STYLE MODAL
      ===================================================== */}

      <div className="fixed inset-0 z-[200] bg-[#EEF4F3]">

        {/* MOBILE APP CONTAINER */}

        <div className="relative mx-auto w-full max-w-[430px] h-[100dvh] bg-[#F7FAF9] overflow-hidden shadow-2xl">

          {/* =================================================
              TOP BAR
          ================================================= */}

          <div className="absolute top-0 left-0 right-0 z-[50] h-[62px] bg-white/95 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4">

            <button
              type="button"
              onClick={() => setSelectedWorker(null)}
              className="w-10 h-10 rounded-full bg-[#F1F5F4] flex items-center justify-center text-[#043A4A] active:scale-95 transition"
              aria-label="Close booking"
            >
              <FaTimes />
            </button>

            <div className="text-center">

              <p className="text-[10px] font-black uppercase tracking-widest text-[#6FA8AA]">
                E-SERVOO
              </p>

              <p className="text-sm font-black text-[#043A4A]">
                Worker Details
              </p>

            </div>

            <div className="w-10 h-10 rounded-full bg-[#EAF6F5] flex items-center justify-center text-[#08566E]">
              <FaShieldAlt />
            </div>

          </div>

          {/* =================================================
              SCROLLABLE CONTENT
          ================================================= */}

          <div className="h-full overflow-y-auto pb-32 pt-[62px]">

            {/* =================================================
                WORKER HERO
            ================================================= */}

            <div className="bg-white">

              <div className="relative w-full h-[260px] bg-[#DDEBE9]">

                <img
                  src={workerImage || "/logo.png"}
                  alt={workerName}
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.src =
                      "/logo.png";
                  }}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 to-transparent"></div>

                <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between">

                  <div className="text-white min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          isAvailable
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {isAvailable
                          ? "AVAILABLE"
                          : "BUSY"}
                      </span>

                      <span className="bg-white/90 text-[#043A4A] px-2.5 py-1 rounded-full text-[10px] font-black">
                        VERIFIED
                      </span>

                    </div>

                    <h1 className="text-2xl font-black mt-2 drop-shadow-lg truncate">
                      {workerName}
                    </h1>

                    <p className="text-sm font-bold text-white/90 truncate">
                      {workerService}
                    </p>

                  </div>

                </div>
              </div>

              {/* =================================================
                  RATING BAR
              ================================================= */}

              <div className="px-4 py-4 border-b border-gray-200">

                <div className="flex items-center gap-3">

                  <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-xl font-black shrink-0">
                    {workerRating}
                    <FaStar className="text-xs" />
                  </div>

                  <div className="h-5 w-px bg-gray-300 shrink-0"></div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-semibold">
                      Trust Score
                    </p>

                    <p className="text-sm font-black text-[#043A4A]">
                      {workerTrustScore}%
                    </p>
                  </div>

                  <div className="h-5 w-px bg-gray-300 shrink-0"></div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-semibold">
                      Experience
                    </p>

                    <p className="text-sm font-black text-[#043A4A] truncate">
                      {workerExperience}
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* =================================================
                INSPECTION BASED PRICING
            ================================================= */}

            <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E] text-xl shrink-0">
                  <FaClipboardCheck />
                </div>

                <div className="min-w-0">

                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide">
                    PRICING INFORMATION
                  </p>

                  <h3 className="text-lg font-black text-[#043A4A] mt-1">
                    Inspection-Based Pricing
                  </h3>

                  <p className="text-sm text-gray-600 font-semibold mt-1 leading-relaxed">
                    Service charge is inspection-based.
                    The final amount will be determined
                    after inspection.
                  </p>

                </div>

              </div>

              <div className="mt-4 bg-[#F1F9F8] border border-[#B4DBDC] rounded-2xl p-3">

                <div className="flex items-start gap-2">

                  <FaShieldAlt className="text-[#08566E] mt-0.5 shrink-0" />

                  <p className="text-xs text-[#043A4A] font-bold leading-relaxed">
                    No fixed service charge is shown here.
                    The final amount depends on the actual
                    issue, inspection and required work.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                LOCATION / SERVICE INFO
            ================================================= */}

            <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

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

                    <p className="text-[11px] text-gray-500 font-bold">
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

                    <p className="text-[11px] text-gray-500 font-bold">
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

                      <div className="min-w-0">

                        <p className="text-[11px] text-gray-500 font-bold">
                          VERIFICATION
                        </p>

                        <p className="text-sm font-black text-[#043A4A]">
                          View Certificate
                        </p>

                      </div>

                    </div>

                    <FaChevronRight className="text-[#08566E] shrink-0" />

                  </a>
                )}

              </div>

            </div>

            {/* =================================================
                BOOKING FORM
            ================================================= */}

            <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

              <div className="mb-5">

                <p className="text-[11px] font-black uppercase tracking-widest text-[#6FA8AA]">
                  SERVICE REQUEST
                </p>

                <h2 className="text-2xl font-black text-[#043A4A] mt-1">
                  Book This Worker
                </h2>

                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Your saved details are pre-filled.
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
                    className="w-full mt-2 p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#B4DBDC] text-[#043A4A] placeholder:text-gray-400 outline-none focus:border-[#08566E] font-bold"
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
                    className="w-full mt-2 p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#B4DBDC] text-[#043A4A] placeholder:text-gray-400 outline-none focus:border-[#08566E] font-bold"
                    required
                  />

                </div>

                {/* ADDRESS */}

                <div>

                  <label className="flex items-center gap-2 text-xs font-black text-[#043A4A]">
                    <FaHome />
                    Service Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Enter service address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full mt-2 p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#B4DBDC] text-[#043A4A] placeholder:text-gray-400 outline-none focus:border-[#08566E] font-bold"
                    required
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
                          onClick={() =>
                            changeUrgency(
                              option.value
                            )
                          }
                          className={`rounded-2xl p-3 border text-left transition active:scale-[0.97] ${
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
                    className="w-full mt-2 p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#B4DBDC] text-[#043A4A] placeholder:text-gray-400 outline-none focus:border-[#08566E] font-bold resize-none"
                    rows="4"
                    required
                  />

                </div>

                {/* =================================================
                    BOOKING SUMMARY
                ================================================= */}

                <div className="bg-[#043A4A] rounded-3xl p-4 shadow-xl">

                  <div className="flex items-center justify-between">

                    <p className="text-[#D9F4F2] text-xs font-black uppercase tracking-wide">
                      Booking Summary
                    </p>

                    <FaClipboardCheck className="text-[#9ECFD0]" />

                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-4 text-sm">

                    <div className="flex justify-between gap-3">

                      <span className="text-[#D9F4F2] font-bold">
                        Worker
                      </span>

                      <span className="font-black text-white text-right">
                        {workerName}
                      </span>

                    </div>

                    <div className="flex justify-between gap-3">

                      <span className="text-[#D9F4F2] font-bold">
                        Service
                      </span>

                      <span className="font-black text-white text-right">
                        {workerService}
                      </span>

                    </div>

                    <div className="flex justify-between gap-3">

                      <span className="text-[#D9F4F2] font-bold">
                        Urgency
                      </span>

                      <span className="font-black text-white text-right">
                        {formData.urgency}
                      </span>

                    </div>

                  </div>

                  {/* INSPECTION PRICING MESSAGE */}

                  <div className="mt-4 bg-white/10 border border-white/20 rounded-2xl p-3">

                    <div className="flex items-start gap-2">

                      <FaClipboardCheck className="text-[#9ECFD0] mt-0.5 shrink-0" />

                      <div>

                        <p className="text-white text-xs font-black">
                          Inspection-Based Pricing
                        </p>

                        <p className="text-[#D9F4F2] text-[11px] font-semibold mt-1 leading-relaxed">
                          Service charge is inspection-based.
                          The final amount will be determined
                          after inspection.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    TERMS
                ================================================= */}

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

                      of E-SERVOO before booking
                      this service.

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
                      ✅ Terms accepted. You can now
                      confirm booking.
                    </p>
                  )}

                </div>

                {/* =================================================
                    CONFIRM BUTTON
                ================================================= */}

                <button
                  type="submit"
                  disabled={
                    loading || !acceptedTerms
                  }
                  className={`w-full py-4 rounded-3xl text-base font-black transition flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] ${
                    loading || !acceptedTerms
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-[#043A4A] via-[#08566E] to-[#0A7F88] text-white"
                  }`}
                >

                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
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

            </div>

            {/* =================================================
                BOTTOM INFO
            ================================================= */}

            <div className="px-4 py-6 bg-[#F1F7F6]">

              <div className="bg-white rounded-3xl border border-[#B4DBDC] p-4">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E] shrink-0">
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

              <div className="h-6"></div>

            </div>

          </div>

          {/* =================================================
              MOBILE BOTTOM SAFE AREA
          ================================================= */}

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7FAF9] to-transparent z-40"></div>

        </div>
      </div>
    </>
  );
}

export default BookingForm;