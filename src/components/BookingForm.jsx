import { useState, useEffect } from "react";
import { FaTimes, FaCheckCircle, FaBolt } from "react-icons/fa";
import { getStoredUser, getStoredToken } from "../utils/storage";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

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

  useEffect(() => {
    if (!selectedWorker) return;

    const user = getStoredUser();

    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      issueDescription: "",
      urgency: "Normal",
      service: getWorkerValue(["service", "Service"], ""),
      worker: getWorkerValue(["name", "Name"], ""),
    });
  }, [selectedWorker]);

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "booking_form",
      ...extraData,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetBookingForm = () => {
    setSuccess(false);
    setBookingId("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setLoading(true);

    try {
      const workerId = getWorkerValue(
        ["WorkerId", "WorkerID", "Worker id", "id"],
        ""
      );

      const payload = {
        action: "booking",
        token: getStoredToken(),
        workerId,
        name: formData.name.trim(),
        phone: cleanPhone,
        address: formData.address.trim(),
        issueDescription: formData.issueDescription.trim(),
        urgency: formData.urgency,
        service: formData.service,
        worker: formData.worker,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        alert(data.message || "Booking failed. Please try again.");
        return;
      }

      const finalBookingId =
        data.bookingId ||
        data.BookingID ||
        data.id ||
        `BK-${Date.now()}`;

      setBookingId(finalBookingId);

      pushEvent("booking_success", {
        service_name: formData.service,
        urgency: formData.urgency,
      });

      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Booking failed. Please try again.");
    }
  };

  if (!selectedWorker) {
    return null;
  }

  const workerName = getWorkerValue(["name", "Name"], "Worker");
  const workerService = getWorkerValue(["service", "Service"], "Service");
  const workerImage = getWorkerValue(["image", "Image"], "");
  const workerFare = getWorkerValue(["fare", "Fare"], "Not Available");
  const workerStatus = getWorkerValue(["status", "Status"], "Available");

  return (
    <>
      {success && (
        <div className="fixed inset-0 bg-[#08566E]/45 backdrop-blur-sm flex justify-center items-center z-[100] px-5">
          <div className="bg-[#E1E9E5] shadow-2xl p-8 rounded-3xl border border-[#6FA8AA] text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl">
              <FaCheckCircle />
            </div>

            <h2 className="text-3xl font-black text-[#08566E] mt-5">
              Booking Successful
            </h2>

            <p className="mt-3 text-lg font-black text-[#08566E]">
              Booking ID: {bookingId}
            </p>

            <div className="mt-5 bg-white/80 rounded-2xl p-4 text-left border border-[#B4DBDC]">
              <p className="text-[#08566E] font-bold">
                Worker: {formData.worker}
              </p>

              <p className="text-[#08566E] font-bold mt-2">
                Service: {formData.service}
              </p>

              <p className="text-[#08566E] font-bold mt-2">
                Priority: {formData.urgency}
              </p>

              <p className="text-[#06485C] font-semibold mt-2">
                Issue: {formData.issueDescription}
              </p>
            </div>

            <p className="mt-4 text-[#06485C] font-semibold">
              Our team will contact you shortly.
            </p>

            <button
              type="button"
              onClick={resetBookingForm}
              className="es-primary-cta px-6 py-3 rounded-2xl mt-6 font-black transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-[#08566E]/45 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-0 sm:px-5">
        <div className="bg-[#E1E9E5] shadow-2xl w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-[#6FA8AA] max-h-[95vh] overflow-y-auto relative">
          <button
            type="button"
            onClick={() => setSelectedWorker(null)}
            className="es-text-btn absolute top-5 right-5 text-[#08566E] text-xl"
            aria-label="Close booking form"
          >
            <FaTimes />
          </button>

          <div className="text-center">
            <img
              src={workerImage || "https://via.placeholder.com/150"}
              alt={workerName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#08566E] shadow-xl"
            />

            <h2 className="text-3xl font-black text-[#08566E] mt-5">
              Book Your Service
            </h2>

            <p className="text-[#06485C] font-semibold mt-2">
              Confirm your details and describe your issue.
            </p>
          </div>

          <div className="mt-5 bg-[#08566E] rounded-3xl p-4 text-center shadow-xl">
            <p className="text-[#B4DBDC] text-sm font-bold">
              Booking With
            </p>

            <p className="text-[#E1E9E5] font-black text-xl mt-1">
              {workerName}
            </p>

            <p className="text-[#B4DBDC] font-bold mt-1">
              {workerService}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#E1E9E5] rounded-2xl p-3">
                <p className="text-[#6FA8AA] text-xs font-black">
                  Visiting Charge
                </p>

                <p className="text-[#08566E] font-black">
                  ₹{workerFare}
                </p>
              </div>

              <div className="bg-[#E1E9E5] rounded-2xl p-3">
                <p className="text-[#6FA8AA] text-xs font-black">
                  Status
                </p>

                <p className="text-[#08566E] font-black">
                  {workerStatus}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-7">
            <div>
              <label className="text-[#08566E] font-black text-sm">
                Your Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] focus:outline-none focus:border-[#08566E] font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-[#08566E] font-black text-sm">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] focus:outline-none focus:border-[#08566E] font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-[#08566E] font-black text-sm">
                Address
              </label>

              <input
                type="text"
                name="address"
                placeholder="Your service address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] focus:outline-none focus:border-[#08566E] font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-[#08566E] font-black text-sm">
                Describe Your Issue
              </label>

              <textarea
                name="issueDescription"
                placeholder="Example: Fan is not working, switch board issue..."
                value={formData.issueDescription}
                onChange={handleChange}
                className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] focus:outline-none focus:border-[#08566E] font-semibold"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="text-[#08566E] font-black text-sm">
                Urgency
              </label>

              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] focus:outline-none focus:border-[#08566E] font-bold"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`es-booking-cta py-4 rounded-2xl text-lg font-black transition duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-[#08566E] text-[#E1E9E5] hover:bg-[#06485C]"
              }`}
            >
              {loading ? (
                "Booking..."
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
    </>
  );
}

export default BookingForm;