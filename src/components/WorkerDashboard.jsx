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
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [updatingJobId, setUpdatingJobId] = useState("");

  const [paymentForms, setPaymentForms] = useState({});

  const [income, setIncome] = useState({
    success: true,
    totalIncome: 0,
    totalJobs: 0,
    cashIncome: 0,
    upiIncome: 0,
    onlineIncome: 0,
    incomes: [],
  });

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

  const getWorkerId = (workerObj) => {
    return getValue(
      workerObj,
      ["id", "ID", "WorkerID", "workerId", "workerid"],
      ""
    );
  };

  const getWorkerName = (workerObj) => {
    return getValue(
      workerObj,
      ["name", "Name", "worker", "Worker", "workerName", "WorkerName"],
      "Worker"
    );
  };

  const getBookingId = (job, index = 0) => {
    return getValue(
      job,
      ["BookingID", "BookingId", "Booking id", "bookingId", "bookingid"],
      `JOB-${index + 1}`
    );
  };

  const getJobStatus = (job) => {
    return getValue(job, ["Status", "status"], "Pending");
  };

  const isCompleted = (status) => {
    const cleanStatus = String(status || "").trim().toLowerCase();

    return (
      cleanStatus === "completed" ||
      cleanStatus === "complete" ||
      cleanStatus === "done"
    );
  };

  const isCancelled = (status) => {
    return String(status || "").trim().toLowerCase() === "cancelled";
  };

  const formatCurrency = (amount) => {
  const value = Number(String(amount || 0).replace(/[₹,\s]/g, ""));
  const safeValue = Number.isFinite(value) ? value : 0;

  return `₹${safeValue.toLocaleString("en-IN")}`;
};

  const fetchAssignedJobs = async (workerData, showLoader = false) => {
    const workerName = getWorkerName(workerData);
    const workerId = getWorkerId(workerData);

    if (!workerName) {
      setBookings([]);
      setLoading(false);
      return;
    }

    if (showLoader) {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `${API_URL}?action=workerBookings&worker=${encodeURIComponent(
          workerName
        )}&workerId=${encodeURIComponent(workerId)}&nocache=${Date.now()}`
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setBookings(data);
      } else if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.log("Assigned jobs fetch error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncome = async (workerData) => {
    const workerName = getWorkerName(workerData);
    const workerId = getWorkerId(workerData);

    if (!workerName) {
      return;
    }

    setIncomeLoading(true);

    try {
      const response = await fetch(
        `${API_URL}?action=workerIncome&worker=${encodeURIComponent(
          workerName
        )}&workerId=${encodeURIComponent(workerId)}&nocache=${Date.now()}`
      );

      const data = await response.json();

      if (data && data.success) {
        setIncome({
          success: true,
          totalIncome: Number(data.totalIncome || 0),
          totalJobs: Number(data.totalJobs || 0),
          cashIncome: Number(data.cashIncome || 0),
          upiIncome: Number(data.upiIncome || 0),
          onlineIncome: Number(data.onlineIncome || 0),
          incomes: Array.isArray(data.incomes) ? data.incomes : [],
        });
      }
    } catch (error) {
      console.log("Income fetch error:", error);
    } finally {
      setIncomeLoading(false);
    }
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
    fetchAssignedJobs(savedWorker, true);
    fetchIncome(savedWorker);
  }, []);

  const handlePaymentChange = (bookingId, field, value) => {
    setPaymentForms({
      ...paymentForms,
      [bookingId]: {
        ...paymentForms[bookingId],
        [field]: value,
      },
    });
  };

  const completeJob = async (job, index) => {
    if (!worker) return;

    const bookingId = getBookingId(job, index);
    const status = getJobStatus(job);

    if (isCompleted(status)) {
      alert("This job is already completed.");
      return;
    }

    const amount = paymentForms[bookingId]?.amount || "";
    const paymentMode = paymentForms[bookingId]?.paymentMode || "Cash";

    if (!amount || Number(amount) <= 0) {
      alert("Please enter valid payment amount.");
      return;
    }

    const workerName = getWorkerName(worker);
    const workerId = getWorkerId(worker);

    const service = getValue(job, ["Service", "service"], "");
    const rowNumber = getValue(job, ["rowNumber", "RowNumber", "row"], "");

    setUpdatingJobId(bookingId);

    try {
      const params = new URLSearchParams({
        action: "updateBookingStatus",
        bookingId: bookingId,
        status: "Completed",
        paymentAmount: String(Number(amount)),
        paymentMode: paymentMode,
        worker: workerName,
        workerId: workerId,
        service: service,
        nocache: String(Date.now()),
      });

      if (rowNumber) {
        params.set("rowNumber", String(rowNumber));
      }

      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Could not complete this job.");
        return;
      }

      alert("Job completed and income added successfully.");

      setPaymentForms({
        ...paymentForms,
        [bookingId]: {
          amount: "",
          paymentMode: "Cash",
        },
      });

      await fetchAssignedJobs(worker, false);
      await fetchIncome(worker);
    } catch (error) {
      console.log("Complete job error:", error);
      alert("Could not complete this job. Please try again.");
    } finally {
      setUpdatingJobId("");
    }
  };

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

  const workerName = getWorkerName(worker);
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
                Manage your assigned E-SERVOO jobs and income.
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
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-3xl font-black text-[#08566E]">
                  Income Tracker
                </h3>

                <p className="text-[#06485C] font-semibold mt-1">
                  Completed jobs ke payment ka total record.
                </p>
              </div>

              {incomeLoading && (
                <span className="text-[#08566E] font-black">
                  Updating...
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-[#08566E] p-5 rounded-3xl shadow-xl min-h-[135px] flex flex-col justify-center border border-[#6FA8AA]">
  <p className="text-[#B4DBDC] text-sm font-black">
    Total Income
  </p>

  <div className="mt-3 inline-flex w-fit items-center rounded-2xl bg-[#E1E9E5] px-5 py-3 shadow-lg border border-white">
    <h4 className="text-4xl font-black text-[#08566E] leading-none">
      {formatCurrency(income?.totalIncome || 0)}
    </h4>
  </div>

  <p className="text-[#E1E9E5] text-xs font-bold mt-3">
    From completed jobs
  </p>
</div>

              <div className="bg-white/85 p-5 rounded-3xl border border-[#B4DBDC] shadow-md">
                <p className="text-[#6FA8AA] text-xs font-black">
                  Completed Jobs
                </p>

                <h4 className="text-3xl font-black mt-2 text-[#08566E]">
                  {income.totalJobs}
                </h4>
              </div>

              <div className="bg-white/85 p-5 rounded-3xl border border-[#B4DBDC] shadow-md">
                <p className="text-[#6FA8AA] text-xs font-black">
                  Cash Income
                </p>

                <h4 className="text-2xl font-black mt-2 text-[#08566E]">
                  {formatCurrency(income.cashIncome)}
                </h4>
              </div>

              <div className="bg-white/85 p-5 rounded-3xl border border-[#B4DBDC] shadow-md">
                <p className="text-[#6FA8AA] text-xs font-black">
                  UPI / Online
                </p>

                <h4 className="text-2xl font-black mt-2 text-[#08566E]">
                  {formatCurrency(income.upiIncome + income.onlineIncome)}
                </h4>
              </div>
            </div>

            {income.incomes.length > 0 && (
              <div className="mt-6 bg-white/85 border border-[#B4DBDC] rounded-3xl p-5 shadow-md">
                <h4 className="text-xl font-black text-[#08566E] mb-4">
                  Recent Income
                </h4>

                <div className="grid gap-3">
                  {income.incomes.slice(0, 5).map((item, index) => {
                    const incomeId = getValue(
                      item,
                      ["incomeId", "IncomeID", "id"],
                      `INC-${index + 1}`
                    );

                    const itemBookingId = getValue(
                      item,
                      ["bookingId", "BookingID", "bookingid"],
                      "Booking"
                    );

                    const itemService = getValue(
                      item,
                      ["service", "Service"],
                      "Service"
                    );

                    const itemAmount = getValue(
                      item,
                      ["amount", "Amount"],
                      0
                    );

                    const itemMode = getValue(
                      item,
                      ["paymentMode", "PaymentMode", "mode"],
                      "Cash"
                    );

                    return (
                      <div
                        key={`${incomeId}-${index}`}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-[#F8FCFA] border border-[#B4DBDC] rounded-2xl p-4"
                      >
                        <div>
                          <p className="text-[#08566E] font-black">
                            {itemService}
                          </p>

                          <p className="text-[#06485C] text-sm font-bold">
                            Booking ID: {itemBookingId}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-green-700 font-black text-lg">
                            {formatCurrency(itemAmount)}
                          </p>

                          <p className="text-[#06485C] text-sm font-bold">
                            {itemMode}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
                  const service = getValue(
                    job,
                    ["Service", "service"],
                    "Service Job"
                  );

                  const status = getJobStatus(job);

                  const customer = getValue(
                    job,
                    ["Name", "name"],
                    "Customer"
                  );

                  const phone = getValue(
                    job,
                    ["Phone", "phone"],
                    "Not Available"
                  );

                  const address = getValue(
                    job,
                    ["Address", "address"],
                    "Not Available"
                  );

                  const issue = getValue(
                    job,
                    ["Issue Description", "issueDescription", "Issue", "issue"],
                    ""
                  );

                  const urgency = getValue(
                    job,
                    ["Urgency", "urgency"],
                    "Normal"
                  );

                  const bookingId = getBookingId(job, index);

                  const currentAmount =
                    paymentForms[bookingId]?.amount || "";

                  const currentPaymentMode =
                    paymentForms[bookingId]?.paymentMode || "Cash";

                  const completed = isCompleted(status);
                  const cancelled = isCancelled(status);
                  const isUpdating = updatingJobId === bookingId;

                  const paidAmount = getValue(
                    job,
                    ["PaymentAmount", "paymentAmount", "amount"],
                    ""
                  );

                  const paidMode = getValue(
                    job,
                    ["PaymentMode", "paymentMode"],
                    ""
                  );

                  return (
                    <div
                      key={`${bookingId}-${index}`}
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
                            completed
                              ? "bg-green-600 text-white"
                              : cancelled
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

                        <p>
                          <span className="font-black">Urgency:</span>{" "}
                          {urgency}
                        </p>

                        <p>
                          <span className="font-black">Status:</span>{" "}
                          {status}
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

                      {completed ? (
                        <div className="mt-5 bg-green-50 border border-green-500 rounded-3xl p-4">
                          <p className="text-green-700 font-black">
                            ✅ Job Completed
                          </p>

                          <p className="text-[#08566E] font-bold mt-2">
                            Payment:{" "}
                            {paidAmount
                              ? formatCurrency(paidAmount)
                              : "Added in income tracker"}
                          </p>

                          {paidMode && (
                            <p className="text-[#08566E] font-bold mt-1">
                              Payment Mode: {paidMode}
                            </p>
                          )}
                        </div>
                      ) : cancelled ? (
                        <div className="mt-5 bg-red-50 border border-red-400 rounded-3xl p-4">
                          <p className="text-red-700 font-black">
                            This job was cancelled.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-5 bg-[#F8FCFA] border border-[#6FA8AA] rounded-3xl p-4">
                          <h5 className="text-[#08566E] font-black text-lg">
                            Complete Job & Add Payment
                          </h5>

                          <p className="text-[#06485C] text-sm font-bold mt-1">
                            Service complete hone ke baad payment amount add
                            karke complete mark karo.
                          </p>

                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-[#08566E] font-black text-sm mb-2">
                                Payment Amount
                              </label>

                              <input
                                type="number"
                                min="1"
                                placeholder="Example: 300"
                                value={currentAmount}
                                onChange={(event) =>
                                  handlePaymentChange(
                                    bookingId,
                                    "amount",
                                    event.target.value
                                  )
                                }
                                className="w-full p-3 rounded-2xl bg-white border border-[#6FA8AA] text-[#08566E] font-bold outline-none focus:border-[#08566E]"
                              />
                            </div>

                            <div>
                              <label className="block text-[#08566E] font-black text-sm mb-2">
                                Payment Mode
                              </label>

                              <select
                                value={currentPaymentMode}
                                onChange={(event) =>
                                  handlePaymentChange(
                                    bookingId,
                                    "paymentMode",
                                    event.target.value
                                  )
                                }
                                className="w-full p-3 rounded-2xl bg-white border border-[#6FA8AA] text-[#08566E] font-bold outline-none focus:border-[#08566E]"
                              >
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Online">Online</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => completeJob(job, index)}
                            disabled={isUpdating}
                            className={`w-full mt-4 py-3 rounded-2xl font-black shadow-lg transition ${
                              isUpdating
                                ? "bg-gray-500 text-white cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                          >
                            {isUpdating
                              ? "Completing..."
                              : "✅ Mark as Completed"}
                          </button>
                        </div>
                      )}
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