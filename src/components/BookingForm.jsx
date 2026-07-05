import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

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

  useEffect(() => {
    if (!selectedWorker) return;

    const user = JSON.parse(localStorage.getItem("user"));

    setFormData({
      name: user?.name || "",
      phone: String(user?.phone || ""),
      address: user?.address || "",
      issueDescription: "",
      urgency: "Normal",
      service: selectedWorker.service || "",
      worker: selectedWorker.name || "",
    });

    setAcceptedTerms(false);
  }, [selectedWorker]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetBooking = () => {
    setSuccess(false);
    setSelectedWorker(null);
    setAcceptedTerms(false);

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

    if (String(formData.phone).length < 10) {
      alert("Enter Valid Phone Number");
      return;
    }

    if (!acceptedTerms) {
      alert("Please accept Terms & Conditions before booking.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      setBookingId(data.bookingId || "Generated");
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Booking Failed");
    }
  };

  if (!selectedWorker) {
    return null;
  }

  if (success) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] px-5 py-24 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-[#08566E] rounded-[32px] shadow-2xl border border-[#6FA8AA]/70 p-8 md:p-10 text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-[#E1E9E5] flex items-center justify-center shadow-xl mb-6">
            <FaCheckCircle className="text-[#08566E] text-5xl" />
          </div>

          <h2 className="text-4xl font-extrabold text-[#E1E9E5]">
            Booking Successful
          </h2>

          <p className="mt-3 text-[#B4DBDC]">
            Your service request has been received successfully.
          </p>

          <div className="mt-8 bg-[#E1E9E5]/95 rounded-3xl p-6 text-left space-y-4">
            <div>
              <p className="text-sm text-[#6FA8AA] font-bold">
                Booking ID
              </p>

              <p className="text-2xl font-extrabold text-[#08566E]">
                {bookingId}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Worker
                </p>

                <p className="text-[#08566E] font-bold">
                  {formData.worker}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Service
                </p>

                <p className="text-[#08566E] font-bold">
                  {formData.service}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Priority
                </p>

                <p className="text-[#08566E] font-bold">
                  {formData.urgency}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Pricing
                </p>

                <p className="text-[#08566E] font-bold">
                  Inspection Based
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#6FA8AA] font-bold">
                Issue Description
              </p>

              <p className="text-[#08566E]">
                {formData.issueDescription || "No issue description added"}
              </p>
            </div>
          </div>

          <p className="mt-6 text-[#B4DBDC]">
            Our team will contact you shortly.
          </p>

          <button
            onClick={resetBooking}
            className="mt-8 px-8 py-4 rounded-full bg-[#E1E9E5] text-[#08566E] font-extrabold hover:bg-[#B4DBDC] transition"
          >
            Back to Services
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] px-5 py-24">

      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => setSelectedWorker(null)}
          className="mb-8 inline-flex items-center gap-2 bg-[#08566E] text-[#E1E9E5] px-5 py-3 rounded-full font-bold shadow-lg hover:bg-[#06485C] transition"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-8 items-start">

          {/* WORKER SUMMARY CARD */}
          <div className="bg-[#08566E] rounded-[32px] shadow-2xl border border-[#6FA8AA]/70 p-7 lg:sticky lg:top-24">

            <div className="text-center">
              <img
                src={selectedWorker.image || "https://via.placeholder.com/150"}
                alt={selectedWorker.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
                className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-[#E1E9E5] shadow-xl"
              />

              <h2 className="text-3xl font-extrabold text-[#E1E9E5] mt-5">
                {selectedWorker.name}
              </h2>

              <p className="text-[#B4DBDC] font-semibold mt-1">
                {selectedWorker.service}
              </p>
            </div>

            <div className="mt-7 space-y-4">
              <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Professional Status
                </p>

                <p className="text-[#08566E] text-xl font-extrabold">
                  ✔ Verified Professional
                </p>
              </div>

              <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Pricing Model
                </p>

                <p className="text-[#08566E] text-xl font-extrabold">
                  Inspection Based Pricing
                </p>

                <p className="text-[#08566E]/80 text-sm mt-1">
                  Final price depends on on-site inspection and actual work.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#6FA8AA] rounded-2xl p-4 text-center">
                  <p className="text-[#E1E9E5] text-sm">
                    Rating
                  </p>

                  <p className="text-[#08566E] text-xl font-extrabold">
                    ⭐ {selectedWorker.rating || "4.8"}
                  </p>
                </div>

                <div className="bg-[#6FA8AA] rounded-2xl p-4 text-center">
                  <p className="text-[#E1E9E5] text-sm">
                    Trust
                  </p>

                  <p className="text-[#08566E] text-xl font-extrabold">
                    {selectedWorker.TrustScore || "90"}%
                  </p>
                </div>
              </div>

              <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Location
                </p>

                <p className="text-[#08566E] font-bold">
                  📍 {selectedWorker.location || "Local Area"}
                </p>
              </div>
            </div>
          </div>

          {/* BOOKING FORM CARD */}
          <div className="bg-[#9ECFD0] rounded-[32px] shadow-2xl border border-[#6FA8AA]/70 p-6 md:p-8">

            <div className="mb-8">
              <p className="text-[#08566E] font-bold tracking-widest text-sm uppercase">
                E-SERVOO Booking
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold text-[#08566E] mt-2">
                Book Service
              </h1>

              <p className="text-[#08566E]/80 mt-3">
                Confirm your details and describe the issue clearly for faster service assignment.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-5"
            >
              <div>
                <label className="block text-[#08566E] font-bold mb-2">
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  readOnly
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] outline-none focus:border-[#08566E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#08566E] font-bold mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  readOnly
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] outline-none focus:border-[#08566E]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#08566E] font-bold mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  readOnly
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] outline-none focus:border-[#08566E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#08566E] font-bold mb-2">
                  Service
                </label>

                <input
                  type="text"
                  name="service"
                  readOnly
                  value={formData.service}
                  className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#08566E] font-bold mb-2">
                  Worker
                </label>

                <input
                  type="text"
                  name="worker"
                  readOnly
                  value={formData.worker}
                  className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#08566E] font-bold mb-2">
                  Urgency
                </label>

                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] outline-none focus:border-[#08566E]"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-[#08566E] font-bold mb-2">
                  Booking Type
                </label>

                <div className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] font-bold">
                  ⚡ One Click Booking
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#08566E] font-bold mb-2">
                  Issue Description
                </label>

                <textarea
                  name="issueDescription"
                  placeholder="Describe your issue clearly..."
                  value={formData.issueDescription}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] outline-none focus:border-[#08566E] resize-none"
                  rows="5"
                  required
                />
              </div>

              <div className="md:col-span-2 bg-[#08566E]/10 border border-[#08566E]/20 rounded-2xl p-4">
                <p className="text-[#08566E] font-bold">
                  📌 Note
                </p>

                <p className="text-[#08566E]/80 text-sm mt-1">
                  Final price depends on worker inspection, issue complexity, spare parts and actual service work.
                </p>
              </div>

              {/* TERMS AND CONDITIONS CHECKBOX */}
              <div className="md:col-span-2 bg-[#E1E9E5]/85 border border-[#6FA8AA] rounded-2xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#08566E] cursor-pointer"
                  />

                  <span className="text-[#08566E] text-sm leading-relaxed font-semibold">
                    I agree to E-SERVOO&apos;s{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-extrabold underline hover:text-[#06485C]"
                    >
                      Terms & Conditions
                    </a>
                    . I understand that final pricing depends on inspection,
                    issue complexity, spare parts, and actual service work.
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className={`w-full py-4 rounded-2xl text-lg font-extrabold transition duration-300 ${
                    loading || !acceptedTerms
                      ? "bg-gray-500 text-white cursor-not-allowed opacity-70"
                      : "bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5]"
                  }`}
                >
                  {loading
                    ? "Booking..."
                    : acceptedTerms
                      ? "⚡ Confirm Booking"
                      : "Accept Terms to Continue"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default BookingForm;