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
  FaRupeeSign,
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
      const workerId = getWorkerId();

      const finalService =
        formData.service || getWorkerService();

      const finalWorker =
        formData.worker || getWorkerName();

      const storedUser = getStoredUser();
      const storedToken = getStoredToken();

      const payload = {
        action: "booking",

        token: storedToken || "",

        workerId,
        WorkerID: workerId,
        selectedWorkerId: workerId,

        worker: finalWorker,
        Worker: finalWorker,
        workerName: finalWorker,
        WorkerName: finalWorker,
        selectedWorkerName: finalWorker,

        service: finalService,
        Service: finalService,
        selectedService: finalService,
        category: finalService,

        name: formData.name.trim(),
        phone: cleanPhone,
        email: storedUser?.email || "",

        address: formData.address.trim(),
        issueDescription: formData.issueDescription.trim(),
        urgency: formData.urgency,

        acceptedTerms: true,
      };

      console.log("E-SERVOO Booking Payload:", payload);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          success: false,
          message:
            responseText ||
            "Invalid response from booking server.",
        };
      }

      console.log("Booking Response:", data);

      if (!response.ok) {
        setLoading(false);

        alert(
          data?.message ||
            `Booking server returned error ${response.status}.`
        );

        return;
      }

      if (data?.success === false) {
        setLoading(false);

        alert(
          data?.message ||
            "Booking failed. Please try again."
        );

        return;
      }

      if (data?.statusUpdated === false) {
        console.warn(
          "Worker status was not updated:",
          data
        );
      }

      const finalBookingId =
        data?.bookingId ||
        data?.BookingID ||
        data?.bookingID ||
        data?.id ||
        `BK-${Date.now()}`;

      setBookingId(finalBookingId);

      pushEvent("booking_success", {
        booking_id: finalBookingId,
        service_name: finalService,
        urgency: formData.urgency,
        accepted_terms: true,
        worker_status_updated:
          Boolean(data?.statusUpdated),
      });

      setLoading(false);
      setSuccess(true);

      console.log(
        "Booking completed:",
        finalBookingId
      );
    } catch (error) {
      console.error("Booking request failed:", error);

      setLoading(false);

      alert(
        "Booking failed. Please check your internet connection and try again."
      );
    }
  };

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

                <p className="text-xl font-black text-[#043A4A] mt-1">
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
              </div>

              <p className="text-sm font-semibold text-[#08566E] mt-4">
                Our team will contact you shortly.
              </p>

              <button
                type="button"
                onClick={resetBookingForm}
                className="w-full mt-5 py-3.5 rounded-2xl bg-[#08566E] text-white font-black shadow-xl"
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
              className="w-10 h-10 rounded-full bg-[#F1F5F4] flex items-center justify-center text-[#043A4A]"
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

          <div className="h-full overflow-y-auto pb-28 pt-[62px]">

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
                    event.currentTarget.src = "/logo.png";
                  }}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent"></div>

                <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between">

                  <div className="text-white">

                    <div className="flex items-center gap-2">

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

                    <h1 className="text-2xl font-black mt-2 drop-shadow-lg">
                      {workerName}
                    </h1>

                    <p className="text-sm font-bold text-white/90">
                      {workerService}
                    </p>

                  </div>

                </div>
              </div>

              {/* RATING BAR */}

              <div className="px-4 py-4 border-b border-gray-200">

                <div className="flex items-center gap-3">

                  <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-xl font-black">
                    {workerRating}
                    <FaStar className="text-xs" />
                  </div>

                  <div className="h-5 w-px bg-gray-300"></div>

                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      Trust Score
                    </p>

                    <p className="text-sm font-black text-[#043A4A]">
                      {workerTrustScore}%
                    </p>
                  </div>

                  <div className="h-5 w-px bg-gray-300"></div>

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
                PRICE SECTION
            ================================================= */}

            <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

              <p className="text-xs font-black text-gray-500">
                ESTIMATED VISITING CHARGE
              </p>

              <div className="flex items-end gap-2 mt-1">

                <FaRupeeSign className="text-2xl text-[#08566E] mb-1" />

                <span className="text-3xl font-black text-[#043A4A]">
                  {String(workerFare)
                    .toLowerCase()
                    .includes("not")
                    ? workerFare
                    : workerFare}
                </span>

              </div>

              <p className="text-xs text-gray-500 font-semibold mt-1">
                Final amount may depend on inspection and actual work.
              </p>

            </div>

            {/* =================================================
                LOCATION / SERVICE INFO
            ================================================= */}

            <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

              <h3 className="text-lg font-black text-[#043A4A]">
                Service Information
              </h3>

              <div className="mt-4 space-y-3">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E]">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-500 font-bold">
                      SERVICE AREA
                    </p>

                    <p className="text-sm font-black text-[#043A4A]">
                      {workerLocation}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#08566E]">
                    <FaTools />
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-500 font-bold">
                      SERVICE
                    </p>

                    <p className="text-sm font-black text-[#043A4A]">
                      {workerService}
                    </p>
                  </div>

                </div>

                {certificateLink && (
                  <a
                    href={certificateLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between bg-[#F5FAF9] border border-[#B4DBDC] rounded-2xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FaCertificate className="text-[#08566E]" />

                      <span className="text-sm font-black text-[#043A4A]">
                        Verified Skill Certificate
                      </span>
                    </div>

                    <FaChevronRight className="text-[#6FA8AA]" />
                  </a>
                )}

              </div>

            </div>

            {/* =================================================
                BOOKING FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-2"
            >

              {/* CUSTOMER DETAILS */}

              <div className="bg-white px-4 py-5 border-y border-gray-200">

                <div className="flex items-center justify-between">

                  <h3 className="text-lg font-black text-[#043A4A]">
                    Your Details
                  </h3>

                  <FaUser className="text-[#6FA8AA]" />

                </div>

                <div className="space-y-3 mt-4">

                  <div className="relative">

                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6FA8AA]" />

                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F5FAF9] border border-[#D3E5E2] text-[#043A4A] font-bold outline-none focus:border-[#08566E]"
                      required
                    />

                  </div>

                  <div className="relative">

                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6FA8AA]" />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F5FAF9] border border-[#D3E5E2] text-[#043A4A] font-bold outline-none focus:border-[#08566E]"
                      required
                    />

                  </div>

                  <div className="relative">

                    <FaHome className="absolute left-4 top-4 text-[#6FA8AA]" />

                    <textarea
                      name="address"
                      placeholder="Service Address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-11 pr-4 pt-3 rounded-2xl bg-[#F5FAF9] border border-[#D3E5E2] text-[#043A4A] font-bold outline-none focus:border-[#08566E] resize-none"
                      required
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  URGENCY
              ================================================= */}

              <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

                <h3 className="text-lg font-black text-[#043A4A]">
                  How quickly do you need help?
                </h3>

                <div className="grid grid-cols-3 gap-2 mt-4">

                  {urgencyOptions.map((option) => {

                    const active =
                      formData.urgency === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          changeUrgency(option.value)
                        }
                        className={`rounded-2xl p-3 border transition ${
                          active
                            ? option.active
                            : "bg-[#F5FAF9] border-[#D3E5E2] text-[#043A4A]"
                        }`}
                      >
                        <div className="text-lg">
                          {option.icon}
                        </div>

                        <p className="text-xs font-black mt-2">
                          {option.title}
                        </p>

                        <p
                          className={`text-[9px] font-bold mt-1 ${
                            active
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

              {/* =================================================
                  ISSUE
              ================================================= */}

              <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

                <h3 className="text-lg font-black text-[#043A4A]">
                  What do you need help with?
                </h3>

                <textarea
                  name="issueDescription"
                  placeholder="Describe your issue..."
                  value={formData.issueDescription}
                  onChange={handleChange}
                  rows="4"
                  className="w-full mt-4 rounded-2xl bg-[#F5FAF9] border border-[#D3E5E2] p-4 text-[#043A4A] font-bold outline-none focus:border-[#08566E] resize-none"
                  required
                />

              </div>

              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

                <h3 className="text-lg font-black text-[#043A4A]">
                  Booking Summary
                </h3>

                <div className="mt-4 rounded-2xl bg-[#F3F9F8] border border-[#D3E5E2] overflow-hidden">

                  <div className="flex justify-between px-4 py-3 border-b border-[#D3E5E2]">
                    <span className="text-sm text-gray-500 font-semibold">
                      Worker
                    </span>

                    <span className="text-sm font-black text-[#043A4A]">
                      {workerName}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-3 border-b border-[#D3E5E2]">
                    <span className="text-sm text-gray-500 font-semibold">
                      Service
                    </span>

                    <span className="text-sm font-black text-[#043A4A]">
                      {workerService}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-3 border-b border-[#D3E5E2]">
                    <span className="text-sm text-gray-500 font-semibold">
                      Priority
                    </span>

                    <span className="text-sm font-black text-[#043A4A]">
                      {formData.urgency}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-3">
                    <span className="text-sm text-gray-500 font-semibold">
                      Visiting Charge
                    </span>

                    <span className="text-base font-black text-[#08566E]">
                      {String(workerFare)
                        .toLowerCase()
                        .includes("not")
                        ? workerFare
                        : `₹${workerFare}`}
                    </span>
                  </div>

                </div>

              </div>

              {/* =================================================
                  TERMS
              ================================================= */}

              <div className="bg-white mt-2 px-4 py-5 border-y border-gray-200">

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

                  <span className="text-xs font-bold text-[#043A4A] leading-relaxed">

                    I agree to the{" "}

                    <a
                      href="/terms"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#08566E] font-black underline"
                    >
                      Terms and Conditions
                    </a>{" "}

                    of E-SERVOO before booking.

                  </span>

                </label>

                {acceptedTerms ? (
                  <p className="text-green-700 text-xs font-black mt-3">
                    ✓ Terms accepted
                  </p>
                ) : (
                  <p className="text-red-600 text-xs font-black mt-3">
                    Accept Terms to continue.
                  </p>
                )}

              </div>

              {/* EXTRA SPACE FOR STICKY BUTTON */}

              <div className="h-6"></div>

            </form>
          </div>

          {/* =================================================
              FIXED SHOPPING APP BOTTOM BAR
          ================================================= */}

          <div className="absolute bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-xl border-t border-gray-200 px-3 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">

            <div className="flex gap-2 items-center">

              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="w-12 h-12 shrink-0 rounded-2xl border border-[#B4DBDC] bg-[#F5FAF9] flex items-center justify-center text-[#08566E]"
              >
                <FaTimes />
              </button>

              <div className="flex-1 min-w-0 px-2">

                <p className="text-[10px] text-gray-500 font-black uppercase">
                  Visiting Charge
                </p>

                <p className="text-lg font-black text-[#043A4A] truncate">
                  {String(workerFare)
                    .toLowerCase()
                    .includes("not")
                    ? workerFare
                    : `₹${workerFare}`}
                </p>

              </div>

              <button
                type="button"
                disabled={
                  loading ||
                  !acceptedTerms ||
                  !isAvailable
                }
                onClick={() => {
                  document
                    .querySelector(
                      'form button[type="submit"]'
                    )
                    ?.click();
                }}
                className={`h-12 px-5 rounded-2xl font-black text-sm shadow-lg transition ${
                  loading ||
                  !acceptedTerms ||
                  !isAvailable
                    ? "bg-gray-400 text-white"
                    : "bg-[#FFD814] text-[#043A4A] hover:bg-[#F7C900]"
                }`}
              >
                {loading
                  ? "Booking..."
                  : !isAvailable
                    ? "Worker Busy"
                    : !acceptedTerms
                      ? "Accept Terms"
                      : "Confirm Booking"}
              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default BookingForm;