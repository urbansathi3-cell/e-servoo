import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredWorker } from "../utils/storage";

const API_URL = "/api/apps-script";

function WorkerDashboard() {
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [updatingJobId, setUpdatingJobId] = useState("");

  const [activeTab, setActiveTab] = useState("jobs");

  const [paymentForms, setPaymentForms] = useState({});

  const [statusUpdating, setStatusUpdating] = useState(false);

  const [income, setIncome] = useState({
    success: true,
    totalIncome: 0,
    totalJobs: 0,
    cashIncome: 0,
    upiIncome: 0,
    onlineIncome: 0,
    incomes: [],
  });

  /* =
     HELPERS
  = */

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
      [
        "name",
        "Name",
        "worker",
        "Worker",
        "workerName",
        "WorkerName",
      ],
      "Worker"
    );
  };

  const getBookingId = (job, index = 0) => {
    return getValue(
      job,
      [
        "BookingID",
        "BookingId",
        "Booking id",
        "bookingId",
        "bookingid",
      ],
      `JOB-${index + 1}`
    );
  };

  const getJobStatus = (job) => {
    return getValue(job, ["Status", "status"], "Pending");
  };

  const isCompleted = (status) => {
    const cleanStatus = String(status || "")
      .trim()
      .toLowerCase();

    return (
      cleanStatus === "completed" ||
      cleanStatus === "complete" ||
      cleanStatus === "done"
    );
  };

  const isCancelled = (status) => {
    return (
      String(status || "")
        .trim()
        .toLowerCase() === "cancelled"
    );
  };

  const formatCurrency = (amount) => {
    const value = Number(
      String(amount || 0).replace(/[₹,\s]/g, "")
    );

    const safeValue = Number.isFinite(value) ? value : 0;

    return `₹${safeValue.toLocaleString("en-IN")}`;
  };

  const getCurrentWorkerStatus = (workerObj) => {
    const rawStatus = getValue(
      workerObj,
      ["status", "Status", "workerStatus", "WorkerStatus"],
      "Available"
    );

    const status = String(rawStatus).trim().toLowerCase();

    if (status === "offline") return "Offline";
    if (status === "busy") return "Busy";

    return "Available";
  };

  const pendingJobs = bookings.filter(
    (job) =>
      !isCompleted(getJobStatus(job)) &&
      !isCancelled(getJobStatus(job))
  ).length;

  const completedJobs = bookings.filter((job) =>
    isCompleted(getJobStatus(job))
  ).length;

  /* =
     NEW JOB NOTIFICATION
  = */

  const getLastSeenKey = (workerObj) => {
    const workerId = getWorkerId(workerObj);

    return `eservoo_worker_last_seen_jobs_${
      workerId || getWorkerName(workerObj)
    }`;
  };

  const getBookingSignature = (job, index) => {
    const bookingId = getBookingId(job, index);
    const status = getJobStatus(job);

    return `${bookingId}_${status}`;
  };

  const [hasNewJobs, setHasNewJobs] = useState(false);

  const checkForNewJobs = (jobList, workerData) => {
    if (!workerData || !Array.isArray(jobList)) {
      return;
    }

    const activeJobs = jobList.filter(
      (job) =>
        !isCompleted(getJobStatus(job)) &&
        !isCancelled(getJobStatus(job))
    );

    const signatures = activeJobs.map((job, index) =>
      getBookingSignature(job, index)
    );

    const currentSignature = signatures.join("|");

    const lastSeenKey = getLastSeenKey(workerData);

    const lastSeen = localStorage.getItem(lastSeenKey);

    if (!lastSeen) {
      localStorage.setItem(lastSeenKey, currentSignature);
      setHasNewJobs(false);
      return;
    }

    if (currentSignature !== lastSeen) {
      setHasNewJobs(true);
    }
  };

  const markJobsAsSeen = () => {
    if (!worker) return;

    const activeJobs = bookings.filter(
      (job) =>
        !isCompleted(getJobStatus(job)) &&
        !isCancelled(getJobStatus(job))
    );

    const signatures = activeJobs.map((job, index) =>
      getBookingSignature(job, index)
    );

    localStorage.setItem(
      getLastSeenKey(worker),
      signatures.join("|")
    );

    setHasNewJobs(false);
  };

  /* =
     FETCH ASSIGNED JOBS
  = */

  const fetchAssignedJobs = async (
    workerData,
    showLoader = false
  ) => {
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
        )}&workerId=${encodeURIComponent(
          workerId
        )}&nocache=${Date.now()}`
      );

      const data = await response.json();

      let jobList = [];

      if (Array.isArray(data)) {
        jobList = data;
      } else if (Array.isArray(data.bookings)) {
        jobList = data.bookings;
      }

      setBookings(jobList);

      checkForNewJobs(jobList, workerData);
    } catch (error) {
      console.log("Assigned jobs fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =
     FETCH INCOME
  = */

  const fetchIncome = async (workerData) => {
    const workerName = getWorkerName(workerData);
    const workerId = getWorkerId(workerData);

    if (!workerName) return;

    setIncomeLoading(true);

    try {
      const response = await fetch(
        `${API_URL}?action=workerIncome&worker=${encodeURIComponent(
          workerName
        )}&workerId=${encodeURIComponent(
          workerId
        )}&nocache=${Date.now()}`
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
          incomes: Array.isArray(data.incomes)
            ? data.incomes
            : [],
        });
      }
    } catch (error) {
      console.log("Income fetch error:", error);
    } finally {
      setIncomeLoading(false);
    }
  };

  /* =
     INITIAL LOAD
  = */

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

  /* =
     AUTO REFRESH JOBS
     = */

  useEffect(() => {
    if (!worker) return;

    const interval = setInterval(() => {
      fetchAssignedJobs(worker, false);
    }, 20000);

    return () => clearInterval(interval);
  }, [worker]);

  /* =
     CHANGE WORKER STATUS
  = */

  const updateWorkerStatus = async (newStatus) => {
    if (!worker) return;

    const workerName = getWorkerName(worker);
    const workerId = getWorkerId(worker);

    setStatusUpdating(true);

    try {
      const params = new URLSearchParams({
        action: "workerStatusUpdate",
        worker: workerName,
        workerId: workerId,
        status: newStatus,
        nocache: String(Date.now()),
      });

      const response = await fetch(
        `${API_URL}?${params.toString()}`
      );

      const data = await response.json();

      if (!data.success) {
        alert(
          data.message ||
            "Could not update worker status."
        );
        return;
      }

      const updatedWorker = {
        ...worker,
        status: newStatus,
        Status: newStatus,
      };

      setWorker(updatedWorker);

      localStorage.setItem(
        "worker",
        JSON.stringify(updatedWorker)
      );

    } catch (error) {
      console.log("Worker status update error:", error);

      alert(
        "Could not update status. Please try again."
      );
    } finally {
      setStatusUpdating(false);
    }
  };

  /* =
     PAYMENT FORM
  = */

  const handlePaymentChange = (
    bookingId,
    field,
    value
  ) => {
    setPaymentForms((previous) => ({
      ...previous,
      [bookingId]: {
        ...previous[bookingId],
        [field]: value,
      },
    }));
  };

  /* =
     COMPLETE JOB
  = */

  const completeJob = async (job, index) => {
    if (!worker) return;

    const bookingId = getBookingId(job, index);
    const status = getJobStatus(job);

    if (isCompleted(status)) {
      alert("This job is already completed.");
      return;
    }

    const amount =
      paymentForms[bookingId]?.amount || "";

    const paymentMode =
      paymentForms[bookingId]?.paymentMode ||
      "Cash";

    if (!amount || Number(amount) <= 0) {
      alert("Please enter valid payment amount.");
      return;
    }

    const workerName = getWorkerName(worker);
    const workerId = getWorkerId(worker);

    const service = getValue(
      job,
      ["Service", "service"],
      ""
    );

    const rowNumber = getValue(
      job,
      ["rowNumber", "RowNumber", "row"],
      ""
    );

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
        params.set(
          "rowNumber",
          String(rowNumber)
        );
      }

      const response = await fetch(
        `${API_URL}?${params.toString()}`
      );

      const data = await response.json();

      if (!data.success) {
        alert(
          data.message ||
            "Could not complete this job."
        );
        return;
      }

      /*
        IMPORTANT:
        Job complete hone ke baad worker automatically
        Available ho jayega.
      */

      await updateWorkerStatus("Available");

      alert(
        "Job completed successfully.\nWorker is now Available."
      );

      setPaymentForms((previous) => ({
        ...previous,
        [bookingId]: {
          amount: "",
          paymentMode: "Cash",
        },
      }));

      await fetchAssignedJobs(worker, false);
      await fetchIncome(worker);
    } catch (error) {
      console.log("Complete job error:", error);

      alert(
        "Could not complete this job. Please try again."
      );
    } finally {
      setUpdatingJobId("");
    }
  };

  /* =
     LOGOUT
  = */

  const handleLogout = () => {
    localStorage.removeItem("worker");
    localStorage.removeItem("workerToken");

    navigate("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  /* =
     LOGIN REQUIRED
  = */

  if (!worker && !loading) {
    return (
      <section className="min-h-screen bg-[#B4DBDC] text-[#08566E] flex items-center justify-center px-5">
        <div className="bg-[#E1E9E5] border border-[#6FA8AA] rounded-3xl p-8 text-center shadow-xl max-w-md w-full">

          <h2 className="text-3xl font-black text-[#08566E]">
            Worker Login Required
          </h2>

          <p className="text-[#06485C] font-semibold mt-3">
            Your worker session was not found.
            Please login again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 bg-[#08566E] text-white px-6 py-3 rounded-2xl font-black shadow-lg"
          >
            Go to Home
          </button>

        </div>
      </section>
    );
  }

  /* =
     LOADING
  = */

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] py-20 px-5">

        <div className="max-w-5xl mx-auto bg-[#E1E9E5]/90 shadow-xl p-8 rounded-3xl border border-white/80">

          <div className="animate-pulse">

            <div className="h-10 w-72 bg-[#08566E]/20 rounded-full"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-8">

              <div className="aspect-square bg-[#08566E]/15 rounded-3xl"></div>
              <div className="aspect-square bg-[#08566E]/15 rounded-3xl"></div>
              <div className="aspect-square bg-[#08566E]/15 rounded-3xl"></div>

            </div>

          </div>

        </div>

      </section>
    );
  }

  /* =
     WORKER DATA
  = */

  const workerName = getWorkerName(worker);

  const workerService = getValue(
    worker,
    ["service", "Service"],
    "Service"
  );

  const workerPhone = getValue(
    worker,
    ["phone", "Phone"],
    "Not Available"
  );

  const workerStatus = getCurrentWorkerStatus(worker);

  const workerRating = getValue(
    worker,
    ["rating", "Rating"],
    "4.8"
  );

  const workerLocation = getValue(
    worker,
    ["location", "Location"],
    "Local"
  );

  const workerExperience = getValue(
    worker,
    ["experience", "Experience"],
    "Experienced"
  );

  const workerImage = getValue(
    worker,
    ["image", "Image", "photo", "Photo"],
    ""
  );

  /* =
     DASHBOARD CARDS
  = */

  const dashboardCards = [
    {
      id: "jobs",
      icon: "🛠️",
      title: "My Jobs",
      subtitle: "Assigned bookings",
      value: bookings.length,
      valueLabel: "Jobs",
      gradient:
        "from-[#043A4A] via-[#08566E] to-[#0A7F88]",
    },

    {
      id: "income",
      icon: "💰",
      title: "Income",
      subtitle: "Your earnings",
      value: formatCurrency(
        income.totalIncome
      ),
      valueLabel: "Earned",
      gradient:
        "from-[#07566E] via-[#087C86] to-[#0A9A8C]",
    },

    {
      id: "profile",
      icon: "👤",
      title: "Profile",
      subtitle: "Worker information",
      value: workerRating,
      valueLabel: "Rating",
      gradient:
        "from-[#0B5268] via-[#176D7B] to-[#318C91]",
    },
  ];

  /* =
     STATUS UI
  = */

  const statusOptions = [
    {
      id: "Available",
      icon: "🟢",
      label: "Available",
      className:
        "bg-green-100 text-green-700 border-green-300",
    },

    {
      id: "Busy",
      icon: "🟠",
      label: "Busy",
      className:
        "bg-orange-100 text-orange-700 border-orange-300",
    },

    {
      id: "Offline",
      icon: "⚫",
      label: "Offline",
      className:
        "bg-gray-100 text-gray-700 border-gray-300",
    },
  ];

  /* =
     RENDER
  = */

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] py-6 md:py-10 px-4 text-[#08566E] pb-20">

      <div className="max-w-6xl mx-auto">

        {/* ====
            HEADER
        ==== */}

        <div className="bg-[#F8FCFA]/90 backdrop-blur-xl rounded-[28px] border border-white shadow-2xl p-5 md:p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A7F88]">
                E-SERVOO Partner
              </p>

              <h1 className="text-2xl md:text-3xl font-black text-[#043A4A] mt-1">
                Worker Dashboard
              </h1>

              <p className="text-[#06485C] text-sm font-semibold mt-1">
                Welcome back, {workerName}
              </p>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-[#B84545] hover:bg-[#963838] text-white px-5 py-2.5 rounded-xl font-black transition shadow-lg text-sm"
            >
              🚪 Logout
            </button>

          </div>

          {/* 
              STATUS CONTROL
           */}

          <div className="mt-5 bg-white border border-[#B4DBDC] rounded-2xl p-3 md:p-4">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

              <div>

                <p className="text-[10px] uppercase tracking-wider text-[#6FA8AA] font-black">
                  Work Status
                </p>

                <p className="text-sm text-[#043A4A] font-black mt-1">
                  Control when customers can get you
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                {statusOptions.map((option) => {

                  const active =
                    workerStatus === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={statusUpdating}
                      onClick={() =>
                        updateWorkerStatus(
                          option.id
                        )
                      }
                      className={`px-3 py-2 rounded-xl border text-xs font-black transition ${
                        active
                          ? `${option.className} scale-[1.03] shadow`
                          : "bg-white border-[#B4DBDC] text-[#6FA8AA] hover:border-[#08566E]"
                      } ${
                        statusUpdating
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {option.icon}{" "}
                      {option.label}
                    </button>
                  );
                })}

              </div>

            </div>

            <p className="text-[11px] text-[#06485C] font-semibold mt-2">
              {workerStatus === "Available"
                ? "You can receive new bookings."
                : workerStatus === "Busy"
                ? "You are temporarily busy. New bookings should not be assigned."
                : "You are offline/outside. New bookings should not be assigned."}
            </p>

          </div>

          {/* 
              QUICK INFO
           */}

          <div className="mt-4 flex flex-wrap gap-2">

            <span className="bg-[#E1E9E5] border border-[#B4DBDC] px-3 py-1.5 rounded-full text-xs font-black text-[#043A4A]">
              👷 {workerService}
            </span>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-black ${
                workerStatus === "Available"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : workerStatus === "Busy"
                  ? "bg-orange-100 text-orange-700 border border-orange-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              ● {workerStatus}
            </span>

            <span className="bg-white border border-[#B4DBDC] px-3 py-1.5 rounded-full text-xs font-black">
              ⭐ {workerRating}
            </span>

          </div>

          {/* 
              SMALLER 1:1 CARDS
           */}

          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-5 max-w-3xl">

            {dashboardCards.map((card) => {

              const active =
                activeTab === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {

                    setActiveTab(card.id);

                    if (card.id === "jobs") {
                      markJobsAsSeen();
                    }

                  }}
                  className={`relative aspect-square max-h-[170px] md:max-h-[190px] rounded-[22px] overflow-hidden text-left transition-all duration-300 shadow-lg border ${
                    active
                      ? "border-white scale-[1.02] shadow-xl"
                      : "border-[#B4DBDC] hover:scale-[1.01]"
                  }`}
                >

                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
                  ></div>

                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/10 blur-2xl"></div>

                  {/* NEW JOB DOT */}

                  {card.id === "jobs" &&
                    hasNewJobs && (
                      <span className="absolute top-3 right-3 z-30 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></span>
                    )}

                  <div className="relative z-10 h-full p-3 md:p-4 flex flex-col justify-between">

                    <div className="flex items-start justify-between">

                      <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center text-xl md:text-2xl">
                        {card.icon}
                      </div>

                      {active && (
                        <span className="bg-white text-[#08566E] px-2 py-1 rounded-full text-[8px] font-black shadow">
                          ACTIVE
                        </span>
                      )}

                    </div>

                    <div>

                      <p className="text-white text-sm md:text-lg font-black">
                        {card.title}
                      </p>

                      <p className="hidden md:block text-[#E1E9E5] text-[10px] font-semibold mt-0.5">
                        {card.subtitle}
                      </p>

                      <div className="mt-2">

                        <p className="text-white text-base md:text-xl font-black">
                          {card.value}
                        </p>

                        <p className="text-[#D9F4F2] text-[8px] md:text-[10px] font-bold">
                          {card.valueLabel}
                        </p>

                      </div>

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

        </div>

        {/* ====
            ACTIVE CONTENT
        ==== */}

        <div className="mt-5">

          {/* ==
              JOBS TAB
          == */}

          {activeTab === "jobs" && (

            <div className="bg-[#F8FCFA]/90 backdrop-blur-xl border border-white rounded-[28px] shadow-2xl p-5 md:p-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0A7F88]">
                    Work Management
                  </p>

                  <h2 className="text-2xl font-black text-[#043A4A]">
                    My Jobs
                  </h2>

                  <p className="text-[#06485C] text-sm font-semibold mt-1">
                    Manage your assigned bookings.
                  </p>

                </div>

                <div className="flex gap-2">

                  <span className="bg-[#E1E9E5] border border-[#B4DBDC] px-3 py-1.5 rounded-xl text-xs font-black">
                    Pending: {pendingJobs}
                  </span>

                  <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1.5 rounded-xl text-xs font-black">
                    Done: {completedJobs}
                  </span>

                </div>

              </div>

              {bookings.length === 0 ? (

                <div className="bg-white border border-[#B4DBDC] rounded-[24px] p-8 text-center shadow-md">

                  <div className="text-4xl">
                    📭
                  </div>

                  <h3 className="text-xl font-black text-[#043A4A] mt-3">
                    No Jobs Assigned
                  </h3>

                  <p className="text-[#06485C] text-sm font-semibold mt-1">
                    New bookings assigned to you will appear here.
                  </p>

                </div>

              ) : (

                <div className="grid gap-4">

                  {bookings.map((job, index) => {

                    const service = getValue(
                      job,
                      ["Service", "service"],
                      "Service Job"
                    );

                    const status =
                      getJobStatus(job);

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
                      [
                        "Issue Description",
                        "issueDescription",
                        "Issue",
                        "issue",
                      ],
                      ""
                    );

                    const urgency = getValue(
                      job,
                      ["Urgency", "urgency"],
                      "Normal"
                    );

                    const bookingId =
                      getBookingId(
                        job,
                        index
                      );

                    const currentAmount =
                      paymentForms[bookingId]
                        ?.amount || "";

                    const currentPaymentMode =
                      paymentForms[bookingId]
                        ?.paymentMode ||
                      "Cash";

                    const completed =
                      isCompleted(status);

                    const cancelled =
                      isCancelled(status);

                    const isUpdating =
                      updatingJobId ===
                      bookingId;

                    const paidAmount =
                      getValue(
                        job,
                        [
                          "PaymentAmount",
                          "paymentAmount",
                          "amount",
                        ],
                        ""
                      );

                    const paidMode =
                      getValue(
                        job,
                        [
                          "PaymentMode",
                          "paymentMode",
                        ],
                        ""
                      );

                    return (

                      <div
                        key={`${bookingId}-${index}`}
                        className="bg-white border border-[#B4DBDC] p-4 md:p-5 rounded-[24px] shadow-md"
                      >

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">

                          <div>

                            <p className="text-[10px] font-black uppercase tracking-wider text-[#6FA8AA]">
                              Booking
                            </p>

                            <h3 className="text-xl font-black text-[#043A4A] mt-1">
                              {service}
                            </h3>

                            <p className="text-[#06485C] text-xs font-bold mt-1">
                              Booking ID: {bookingId}
                            </p>

                          </div>

                          <span
                            className={`self-start px-3 py-1.5 rounded-full text-xs font-black ${
                              completed
                                ? "bg-green-600 text-white"
                                : cancelled
                                ? "bg-red-500 text-white"
                                : "bg-[#08566E] text-white"
                            }`}
                          >
                            {status}
                          </span>

                        </div>

                        <div className="grid md:grid-cols-2 gap-2 bg-[#F8FCFA] border border-[#B4DBDC] rounded-2xl p-3 text-sm text-[#08566E] font-semibold">

                          <p>
                            <span className="font-black">
                              Customer:
                            </span>{" "}
                            {customer}
                          </p>

                          <p>
                            <span className="font-black">
                              Phone:
                            </span>{" "}
                            {phone}
                          </p>

                          <p>
                            <span className="font-black">
                              Urgency:
                            </span>{" "}
                            {urgency}
                          </p>

                          <p>
                            <span className="font-black">
                              Status:
                            </span>{" "}
                            {status}
                          </p>

                          <p className="md:col-span-2">
                            <span className="font-black">
                              Address:
                            </span>{" "}
                            {address}
                          </p>

                          {issue && (
                            <p className="md:col-span-2">
                              <span className="font-black">
                                Issue:
                              </span>{" "}
                              {issue}
                            </p>
                          )}

                        </div>

                        {completed ? (

                          <div className="mt-4 bg-green-50 border border-green-400 rounded-2xl p-3">

                            <p className="text-green-700 text-sm font-black">
                              ✅ Job Completed
                            </p>

                            <p className="text-[#08566E] text-sm font-bold mt-1">
                              Payment:{" "}
                              {paidAmount
                                ? formatCurrency(
                                    paidAmount
                                  )
                                : "Added in income tracker"}
                            </p>

                            {paidMode && (
                              <p className="text-[#08566E] text-sm font-bold mt-1">
                                Payment Mode:{" "}
                                {paidMode}
                              </p>
                            )}

                          </div>

                        ) : cancelled ? (

                          <div className="mt-4 bg-red-50 border border-red-400 rounded-2xl p-3">

                            <p className="text-red-700 text-sm font-black">
                              This job was cancelled.
                            </p>

                          </div>

                        ) : (

                          <div className="mt-4 bg-[#F8FCFA] border border-[#6FA8AA] rounded-2xl p-3">

                            <h4 className="text-base font-black text-[#043A4A]">
                              Complete Job & Add Payment
                            </h4>

                            <p className="text-[#06485C] text-xs font-bold mt-1">
                              Payment amount add karke job complete mark karo.
                            </p>

                            <div className="grid md:grid-cols-2 gap-3 mt-3">

                              <div>

                                <label className="block text-[#08566E] font-black text-xs mb-1.5">
                                  Payment Amount
                                </label>

                                <input
                                  type="number"
                                  min="1"
                                  placeholder="Example: 300"
                                  value={
                                    currentAmount
                                  }
                                  onChange={(event) =>
                                    handlePaymentChange(
                                      bookingId,
                                      "amount",
                                      event.target
                                        .value
                                    )
                                  }
                                  className="w-full p-2.5 rounded-xl bg-white border border-[#6FA8AA] text-[#08566E] text-sm font-bold outline-none focus:border-[#08566E]"
                                />

                              </div>

                              <div>

                                <label className="block text-[#08566E] font-black text-xs mb-1.5">
                                  Payment Mode
                                </label>

                                <select
                                  value={
                                    currentPaymentMode
                                  }
                                  onChange={(event) =>
                                    handlePaymentChange(
                                      bookingId,
                                      "paymentMode",
                                      event.target
                                        .value
                                    )
                                  }
                                  className="w-full p-2.5 rounded-xl bg-white border border-[#6FA8AA] text-[#08566E] text-sm font-bold outline-none"
                                >

                                  <option value="Cash">
                                    Cash
                                  </option>

                                  <option value="UPI">
                                    UPI
                                  </option>

                                  <option value="Online">
                                    Online
                                  </option>

                                </select>

                              </div>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                completeJob(
                                  job,
                                  index
                                )
                              }
                              disabled={
                                isUpdating
                              }
                              className={`w-full mt-3 py-2.5 rounded-xl text-sm font-black shadow-lg transition ${
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
          )}

          {/* ==
              INCOME TAB
          == */}

          {activeTab === "income" && (

            <div className="bg-[#F8FCFA]/90 backdrop-blur-xl border border-white rounded-[28px] shadow-2xl p-5 md:p-6">

              <div className="flex items-center justify-between gap-4 mb-5">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0A7F88]">
                    Earnings
                  </p>

                  <h2 className="text-2xl font-black text-[#043A4A]">
                    My Income
                  </h2>

                  <p className="text-[#06485C] text-sm font-semibold mt-1">
                    Completed jobs se earned income.
                  </p>

                </div>

                {incomeLoading && (
                  <span className="text-[#08566E] text-xs font-black">
                    Updating...
                  </span>
                )}

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-[#043A4A] to-[#087C86] text-white rounded-[24px] p-4 min-h-[130px] shadow-xl">

                  <p className="text-[#B4DBDC] text-[10px] font-black">
                    Total Income
                  </p>

                  <h3 className="text-2xl font-black mt-3">
                    {formatCurrency(
                      income.totalIncome
                    )}
                  </h3>

                  <p className="text-[#E1E9E5] text-[10px] font-bold mt-1">
                    From completed jobs
                  </p>

                </div>

                <div className="bg-white border border-[#B4DBDC] rounded-[24px] p-4 min-h-[130px] shadow-md">

                  <p className="text-[#6FA8AA] text-[10px] font-black">
                    Completed
                  </p>

                  <h3 className="text-2xl font-black text-[#08566E] mt-3">
                    {income.totalJobs}
                  </h3>

                  <p className="text-[#06485C] text-[10px] font-bold mt-1">
                    Jobs
                  </p>

                </div>

                <div className="bg-white border border-[#B4DBDC] rounded-[24px] p-4 min-h-[130px] shadow-md">

                  <p className="text-[#6FA8AA] text-[10px] font-black">
                    Cash
                  </p>

                  <h3 className="text-xl font-black text-[#08566E] mt-3">
                    {formatCurrency(
                      income.cashIncome
                    )}
                  </h3>

                </div>

                <div className="bg-white border border-[#B4DBDC] rounded-[24px] p-4 min-h-[130px] shadow-md">

                  <p className="text-[#6FA8AA] text-[10px] font-black">
                    UPI / Online
                  </p>

                  <h3 className="text-xl font-black text-[#08566E] mt-3">
                    {formatCurrency(
                      income.upiIncome +
                        income.onlineIncome
                    )}
                  </h3>

                </div>

              </div>

              <div className="mt-5">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="text-lg font-black text-[#043A4A]">
                    Recent Income
                  </h3>

                  <span className="text-[10px] font-black text-[#6FA8AA]">
                    Latest 5
                  </span>

                </div>

                {income.incomes.length === 0 ? (

                  <div className="bg-white border border-[#B4DBDC] rounded-2xl p-7 text-center">

                    <div className="text-3xl">
                      💰
                    </div>

                    <p className="text-[#08566E] font-black mt-2">
                      No income records yet
                    </p>

                  </div>

                ) : (

                  <div className="grid gap-2">

                    {income.incomes
                      .slice(0, 5)
                      .map((item, index) => {

                        const incomeId =
                          getValue(
                            item,
                            [
                              "incomeId",
                              "IncomeID",
                              "id",
                            ],
                            `INC-${index + 1}`
                          );

                        const itemBookingId =
                          getValue(
                            item,
                            [
                              "bookingId",
                              "BookingID",
                              "bookingid",
                            ],
                            "Booking"
                          );

                        const itemService =
                          getValue(
                            item,
                            [
                              "service",
                              "Service",
                            ],
                            "Service"
                          );

                        const itemAmount =
                          getValue(
                            item,
                            ["amount", "Amount"],
                            0
                          );

                        const itemMode =
                          getValue(
                            item,
                            [
                              "paymentMode",
                              "PaymentMode",
                              "mode",
                            ],
                            "Cash"
                          );

                        return (

                          <div
                            key={`${incomeId}-${index}`}
                            className="bg-white border border-[#B4DBDC] rounded-2xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-sm"
                          >

                            <div>

                              <p className="text-[#08566E] text-sm font-black">
                                {itemService}
                              </p>

                              <p className="text-[#06485C] text-[10px] font-bold mt-1">
                                Booking ID:{" "}
                                {itemBookingId}
                              </p>

                            </div>

                            <div className="md:text-right">

                              <p className="text-green-700 font-black text-base">
                                {formatCurrency(
                                  itemAmount
                                )}
                              </p>

                              <p className="text-[#06485C] text-[10px] font-bold">
                                {itemMode}
                              </p>

                            </div>

                          </div>
                        );
                      })}

                  </div>
                )}

              </div>

            </div>
          )}

          {/* ==
              PROFILE TAB
          == */}

          {activeTab === "profile" && (

            <div className="bg-[#F8FCFA]/90 backdrop-blur-xl border border-white rounded-[28px] shadow-2xl p-5 md:p-6">

              <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">

                <img
                  src={
                    workerImage ||
                    "/logo.png"
                  }
                  alt={workerName}
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.src =
                      "/logo.png";
                  }}
                  className="w-24 h-24 rounded-[24px] object-cover border-4 border-white shadow-xl bg-[#E1E9E5]"
                />

                <div className="text-center md:text-left">

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0A7F88]">
                    Worker Profile
                  </p>

                  <h2 className="text-2xl font-black text-[#043A4A] mt-1">
                    {workerName}
                  </h2>

                  <p className="text-[#06485C] text-sm font-bold mt-1">
                    {workerService}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">

                    <span className="bg-white border border-[#B4DBDC] px-3 py-1.5 rounded-full text-xs font-black">
                      ⭐ {workerRating}
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-black ${
                        workerStatus === "Available"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : workerStatus === "Busy"
                          ? "bg-orange-100 text-orange-700 border border-orange-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300"
                      }`}
                    >
                      ● {workerStatus}
                    </span>

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">

                {[
                  ["👤", "NAME", workerName],
                  ["🛠️", "SERVICE", workerService],
                  ["📞", "PHONE", workerPhone],
                  ["📍", "LOCATION", workerLocation],
                  ["⭐", "RATING", workerRating],
                  ["🎓", "EXPERIENCE", workerExperience],
                ].map(
                  ([icon, label, value]) => (

                    <div
                      key={label}
                      className="aspect-square max-h-[170px] bg-white border border-[#B4DBDC] rounded-[24px] p-4 shadow-md flex flex-col justify-between"
                    >

                      <span className="text-2xl">
                        {icon}
                      </span>

                      <div>

                        <p className="text-[9px] text-[#6FA8AA] font-black">
                          {label}
                        </p>

                        <p className="text-sm md:text-base font-black text-[#08566E] mt-1 break-words">
                          {value}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default WorkerDashboard;