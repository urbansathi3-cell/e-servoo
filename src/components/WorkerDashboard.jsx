import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredWorker } from "../utils/storage";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function WorkerDashboard() {
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getValue = (obj, keys, fallback = "") => {
    for (const key of keys) {
      if (
        obj?.[key] !== undefined &&
        obj?.[key] !== null &&
        obj?.[key] !== ""
      ) {
        return obj[key];
      }
    }

    return fallback;
  };

  useEffect(() => {
    const savedWorker = getStoredWorker();

    if (!savedWorker) {
      setWorker(null);
      setBookings([]);
      setLoading(false);
      return;
    }

    setWorker(savedWorker);

    const workerName = getValue(savedWorker, ["name", "Name"], "");

    if (!workerName) {
      setBookings([]);
      setLoading(false);
      return;
    }

    fetch(
      `${API_URL}?worker=${encodeURIComponent(workerName)}&nocache=${Date.now()}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        } else if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setBookings([]);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("worker");
    localStorage.removeItem("workerToken");

    navigate("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (!worker && !loading) {
    return (
      <section className="min-h-screen bg-[#B4DBDC] text-[#08566E] flex items-center justify-center px-5">
        <div className="bg-[#E1E9E5] border border-[#6FA8AA] rounded-3xl p-8 text-center shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-black text-[#08566E]">
            Worker Login Required
          </h2>

          <p className="text-[#06485C] font-semibold mt-3">
            Your worker session was not found. Please login again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="es-primary-cta mt-6 px-6 py-3 rounded-2xl font-black"
          >
            Go to Home
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] py-20 px-5 text-[#08566E]">
        <div className="max-w-5xl mx-auto bg-[#E1E9E5]/90 shadow-xl p-8 rounded-3xl border border-white/80">
          <div className="animate-pulse">
            <div className="h-10 w-72 bg-[#08566E]/20 rounded-full"></div>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="h-28 bg-[#08566E]/15 rounded-3xl"></div>
              <div className="h-28 bg-[#08566E]/15 rounded-3xl"></div>
              <div className="h-28 bg-[#08566E]/15 rounded-3xl"></div>
              <div className="h-28 bg-[#08566E]/15 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const workerName = getValue(worker, ["name", "Name"], "Worker");
  const workerService = getValue(worker, ["service", "Service"], "Service");
  const workerPhone = getValue(worker, ["phone", "Phone"], "Not Available");
  const workerStatus = getValue(worker, ["status", "Status"], "Available");
  const workerRating = getValue(worker, ["rating", "Rating"], "4.8");
  const workerLocation = getValue(worker, ["location", "Location"], "Local");

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] py-20 px-5 text-[#08566E] pb-28">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#E1E9E5]/90 backdrop-blur-xl shadow-2xl p-6 md:p-8 rounded-3xl border border-white/80">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-black text-[#08566E]">
                Worker Dashboard
              </h2>

              <p className="text-[#06485C] font-semibold mt-2">
                Manage your assigned E-SERVOO jobs.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-[#B84545] hover:bg-[#963838] text-[#E1E9E5] px-6 py-3 rounded-2xl font-black transition shadow-lg"
            >
              🚪 Logout
            </button>
          </div>

          <div className="bg-[#08566E] rounded-3xl p-6 shadow-xl mb-8">
            <h3 className="text-2xl font-black text-[#E1E9E5]">
              👷 Welcome, {workerName}
            </h3>

            <p className="text-[#B4DBDC] font-semibold mt-2">
              Service: {workerService}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/85 p-6 rounded-3xl border border-[#B4DBDC] shadow-md">
              <h3 className="text-sm font-black text-[#6FA8AA] mb-2">
                Name
              </h3>

              <p className="text-[#08566E] text-xl font-black">
                {workerName}
              </p>
            </div>

            <div className="bg-white/85 p-6 rounded-3xl border border-[#B4DBDC] shadow-md">
              <h3 className="text-sm font-black text-[#6FA8AA] mb-2">
                Service
              </h3>

              <p className="text-[#08566E] text-xl font-black">
                {workerService}
              </p>
            </div>

            <div className="bg-white/85 p-6 rounded-3xl border border-[#B4DBDC] shadow-md">
              <h3 className="text-sm font-black text-[#6FA8AA] mb-2">
                Phone
              </h3>

              <p className="text-[#08566E] text-xl font-black">
                {workerPhone}
              </p>
            </div>

            <div className="bg-white/85 p-6 rounded-3xl border border-[#B4DBDC] shadow-md">
              <h3 className="text-sm font-black text-[#6FA8AA] mb-2">
                Status
              </h3>

              <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-black">
                {workerStatus}
              </span>
            </div>

            <div className="bg-white/85 p-6 rounded-3xl border border-[#B4DBDC] shadow-md">
              <h3 className="text-sm font-black text-[#6FA8AA] mb-2">
                Rating
              </h3>

              <p className="text-[#08566E] text-xl font-black">
                ⭐ {workerRating}
              </p>
            </div>

            <div className="bg-white/85 p-6 rounded-3xl border border-[#B4DBDC] shadow-md">
              <h3 className="text-sm font-black text-[#6FA8AA] mb-2">
                Location
              </h3>

              <p className="text-[#08566E] text-xl font-black">
                {workerLocation}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-3xl font-black text-[#08566E] mb-6">
              Assigned Jobs
            </h3>

            {bookings.length === 0 ? (
              <div className="bg-white/85 border border-[#B4DBDC] rounded-3xl p-8 text-center shadow-md">
                <p className="text-[#08566E] font-black text-xl">
                  No Jobs Assigned
                </p>

                <p className="text-[#06485C] font-semibold mt-2">
                  New bookings assigned to you will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {bookings.map((job, index) => {
                  const service = getValue(job, ["Service", "service"], "Service Job");
                  const status = getValue(job, ["Status", "status"], "Pending");
                  const customer = getValue(job, ["Name", "name"], "Customer");
                  const phone = getValue(job, ["Phone", "phone"], "Not Available");
                  const address = getValue(job, ["Address", "address"], "Not Available");
                  const issue = getValue(
                    job,
                    ["Issue Description", "issueDescription", "Issue", "issue"],
                    ""
                  );
                  const bookingId = getValue(
                    job,
                    ["BookingID", "BookingId", "Booking id", "bookingId"],
                    `JOB-${index + 1}`
                  );

                  return (
                    <div
                      key={bookingId}
                      className="bg-white/85 border border-[#B4DBDC] p-6 rounded-3xl shadow-md"
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <h4 className="text-2xl font-black text-[#08566E]">
                            {service}
                          </h4>

                          <p className="text-[#06485C] text-sm font-bold mt-1">
                            Booking ID: {bookingId}
                          </p>
                        </div>

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-black ${
                            String(status).trim().toLowerCase() === "completed"
                              ? "bg-green-600 text-white"
                              : String(status).trim().toLowerCase() === "cancelled"
                                ? "bg-red-500 text-white"
                                : "bg-[#08566E] text-[#E1E9E5]"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-[#08566E] font-semibold">
                        <p>
                          <span className="font-black">Customer:</span>{" "}
                          {customer}
                        </p>

                        <p>
                          <span className="font-black">Phone:</span>{" "}
                          {phone}
                        </p>

                        <p className="md:col-span-2">
                          <span className="font-black">Address:</span>{" "}
                          {address}
                        </p>

                        {issue && (
                          <p className="md:col-span-2">
                            <span className="font-black">Issue:</span>{" "}
                            {issue}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkerDashboard;