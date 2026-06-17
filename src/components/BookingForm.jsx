import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

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

  useEffect(() => {
    if (!selectedWorker) return;

    setFormData({
      name: "",
      phone: "",
      address: "",
      issueDescription: "",
      urgency: "Normal",
      service: selectedWorker.service || "",
      worker: selectedWorker.name || "",
    });
  }, [selectedWorker]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length < 10) {
      alert("Enter Valid Phone Number");
      return;
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Booking Failed");
    }
  };

  if (!selectedWorker) {
    return null;
  }

  return (
    <>
      {success && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] px-5">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-green-500 text-center max-w-md w-full">
            <h2 className="text-3xl font-bold text-green-500">
              ✅ Booking Successful
            </h2>

            <p className="mt-5 text-white text-lg">
              Worker: {formData.worker}
            </p>

            <p className="mt-2 text-blue-500 text-lg">
              Service: {formData.service}
            </p>

            <p className="mt-2 text-yellow-400">
              Priority: {formData.urgency}
            </p>

            <p className="mt-2 text-zinc-300">
              Issue: {formData.issueDescription}
            </p>

            <p className="mt-4 text-zinc-400">
              Our team will contact you shortly.
            </p>

            <button
              onClick={() => {
                setSuccess(false);
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
              }}
              className="bg-blue-500 px-6 py-3 rounded-xl mt-6 hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-zinc-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-blue-500 max-h-[95vh] overflow-y-auto relative">
          <button
            onClick={() => setSelectedWorker(null)}
            className="absolute top-5 right-5 text-white text-xl"
          >
            <FaTimes />
          </button>

          <img
            src={selectedWorker.image}
            alt={selectedWorker.name}
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover mx-auto border-4 border-blue-500"
          />

          <h2 className="text-3xl font-bold text-center text-white mt-5">
            {selectedWorker.name}
          </h2>

          <p className="text-center text-blue-500 mt-2">
            {selectedWorker.service}
          </p>

          <p className="text-center text-green-400 font-bold mt-2 text-xl">
            Visiting Charge: ₹{selectedWorker.fare || "Not Available"}
          </p>

          <div className="mt-4 bg-black rounded-xl p-3 text-center">
            <p className="text-zinc-400 text-sm">Booking With</p>

            <p className="text-white font-bold">
              {selectedWorker.name}
            </p>

            <p className="text-blue-400">
              {selectedWorker.service}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-8"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black text-white"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black text-white"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black text-white"
              required
            />

            <textarea
              name="issueDescription"
              placeholder="Describe your issue..."
              value={formData.issueDescription}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black text-white"
              rows="4"
              required
            />

            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black text-white"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
            </select>

            <button
              type="submit"
              className="bg-blue-500 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition duration-300"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default BookingForm;