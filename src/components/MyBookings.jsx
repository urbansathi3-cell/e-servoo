import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClipboardList,
  FaStar,
  FaTimes,
  FaMapMarkerAlt,
  FaUserTie,
  FaTools,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import {
  getStoredUser,
  getStoredToken,
  safeJsonParse,
  saveJsonToStorage,
} from "../utils/storage";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function MyBookings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingIndex, setSelectedBookingIndex] = useState(null);

  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});

  const [reviewedBookings, setReviewedBookings] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem("reviewedBookings"), {});

    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      localStorage.removeItem("reviewedBookings");
      return {};
    }

    return saved;
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

  const getBookingKey = (booking, index) => {
    return String(
      getValue(
        booking,
        [
          "BookingID",
          "BookingId",
          "Booking id",
          "bookingId",
          "bookingid",
        ],
        `booking-${index}`
      )
    );
  };

  const isBookingCompleted = (status) => {
    const cleanStatus = String(status || "").trim().toLowerCase();

    return (
      cleanStatus === "completed" ||
      cleanStatus === "complete" ||
      cleanStatus === "done"
    );
  };

  const getBookingDetails = (booking, index) => {
    const bookingKey = getBookingKey(booking, index);

    return {
      bookingKey,
      bookingId: getValue(
        booking,
        [
          "BookingID",
          "BookingId",
          "Booking id",
          "bookingId",
          "bookingid",
        ],
        bookingKey
      ),
      service: getValue(
        booking,
        ["Service", "service", "services", "category"],
        "Service Not Found"
      ),
      worker: getValue(
        booking,
        [
          "Worker",
          "worker",
          "Worker Name",
          "workerName",
          "workername",
        ],
        "Worker Not Found"
      ),
      workerId: getValue(
        booking,
        [
          "WorkerID",
          "WorkerId",
          "workerId",
          "workerid",
          "id",
        ],
        ""
      ),
      address: getValue(
        booking,
        ["Address", "address"],
        "Address Not Found"
      ),
      issue: getValue(
        booking,
        [
          "Issue Description",
          "issueDescription",
          "issuedescription",
          "Issue",
          "issue",
        ],
        ""
      ),
      urgency: getValue(booking, ["Urgency", "urgency"], "Normal"),
      status: getValue(booking, ["Status", "status"], "Pending"),
      date: getValue(booking, ["Date", "date"], ""),
    };
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date Not Found";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    const cleanStatus = String(status).toLowerCase();

    if (isBookingCompleted(cleanStatus)) {
      return "bg-green-600 text-white";
    }

    if (cleanStatus === "cancelled") {
      return "bg-red-500 text-white";
    }

    if (cleanStatus === "accepted") {
      return "bg-blue-600 text-white";
    }

    return "bg-[#08566E] text-[#E1E9E5]";
  };

  useEffect(() => {
    const savedUser = getStoredUser();

    if (!savedUser || !savedUser.phone) {
      setUser(null);
      setBookings([]);
      setLoading(false);
      return;
    }

    setUser(savedUser);

    fetch(
      `${API_URL}?phone=${encodeURIComponent(
        savedUser.phone
      )}&nocache=${Date.now()}`
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
      .catch((error) => {
        console.log("My Bookings Error:", error);
        setBookings([]);
        setLoading(false);
      });
  }, []);

  const openBookingDetails = (booking, index) => {
    setSelectedBooking(booking);
    setSelectedBookingIndex(index);
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
    setSelectedBookingIndex(null);
  };

  const updateReviewInput = (bookingKey, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [bookingKey]: {
        rating: 0,
        review: "",
        ...prev[bookingKey],
        [field]: value,
      },
    }));
  };

  const submitReview = async (booking, index) => {
    const details = getBookingDetails(booking, index);

    if (!isBookingCompleted(details.status)) {
      alert("Review can be submitted only after service is completed.");
      return;
    }

    const bookingKey = details.bookingKey;

    const currentReview = reviewInputs[bookingKey] || {
      rating: 0,
      review: "",
    };

    const rating = Number(currentReview.rating);
    const reviewText = String(currentReview.review || "").trim();

    if (!rating || rating < 1) {
      alert("Please select a star rating.");
      return;
    }

    if (!reviewText) {
      alert("Please write a short review.");
      return;
    }

    const workerId = details.workerId || details.worker;

    if (!workerId || workerId === "Worker Not Found") {
      alert("Worker information not found for this booking.");
      return;
    }

    setReviewLoading((prev) => ({
      ...prev,
      [bookingKey]: true,
    }));

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "review",
          token: getStoredToken(),
          workerId: workerId,
          bookingId: details.bookingId,
          rating: rating,
          review: reviewText,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Review submit failed.");
        setReviewLoading((prev) => ({
          ...prev,
          [bookingKey]: false,
        }));
        return;
      }

      const updatedReviewedBookings = {
        ...reviewedBookings,
        [bookingKey]: true,
      };

      setReviewedBookings(updatedReviewedBookings);
      saveJsonToStorage("reviewedBookings", updatedReviewedBookings);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "review_submitted",
        page_section: "my_bookings",
        rating: rating,
      });

      alert("Thank you! Your review has been submitted.");
    } catch (error) {
      console.log("Review Error:", error);
      alert("Review submit failed. Please try again.");
    } finally {
      setReviewLoading((prev) => ({
        ...prev,
        [bookingKey]: false,
      }));
    }
  };

  if (!user && !loading) {
    return (
      <section className="min-h-screen bg-[#B4DBDC] flex items-center justify-center px-5 text-[#08566E]">
        <div className="bg-[#E1E9E5] rounded-3xl p-7 shadow-xl border border-[#6FA8AA] max-w-md text-center">
          <h2 className="text-2xl font-black">Please Login First</h2>

          <p className="mt-2 font-semibold text-[#06485C] text-sm">
            Login required to view your bookings.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="es-primary-cta mt-5 px-5 py-2.5 rounded-2xl font-black"
          >
            Go to Home
          </button>
        </div>
      </section>
    );
  }

  const modalDetails =
    selectedBooking && selectedBookingIndex !== null
      ? getBookingDetails(selectedBooking, selectedBookingIndex)
      : null;

  const modalReview =
    modalDetails && reviewInputs[modalDetails.bookingKey]
      ? reviewInputs[modalDetails.bookingKey]
      : {
          rating: 0,
          review: "",
        };

  const modalReviewed =
    modalDetails && reviewedBookings[modalDetails.bookingKey];

  const modalCompleted =
    modalDetails && isBookingCompleted(modalDetails.status);

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] px-4 py-8 pb-28 text-[#08566E]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="es-secondary-cta px-3 py-2.5 rounded-2xl font-black"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h2 className="text-3xl font-black text-[#08566E]">
              My Bookings
            </h2>

            <p className="text-[#06485C] font-semibold mt-1 text-sm">
              Tap a booking card to view details. Review unlocks after
              completion.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-36 rounded-[24px] bg-white/50 animate-pulse border border-white/80"
              ></div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#E1E9E5]/90 rounded-3xl p-8 text-center border border-white/80 shadow-xl">
            <FaClipboardList className="mx-auto text-4xl text-[#08566E]" />

            <h3 className="text-xl font-black mt-4">No Bookings Found</h3>

            <p className="text-[#06485C] font-semibold mt-2 text-sm">
              Book a service to see your booking history here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="es-primary-cta mt-5 px-5 py-2.5 rounded-2xl font-black"
            >
              Book a Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {bookings.map((booking, index) => {
              const details = getBookingDetails(booking, index);
              const completed = isBookingCompleted(details.status);
              const isReviewed = reviewedBookings[details.bookingKey];

              return (
                <button
                  type="button"
                  key={details.bookingKey}
                  onClick={() => openBookingDetails(booking, index)}
                  className="text-left bg-[#E1E9E5]/90 border border-white/80 rounded-[24px] p-3 shadow-lg hover:shadow-xl active:scale-[0.97] transition min-h-[150px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shadow-md shrink-0">
                      <FaTools />
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${getStatusClass(
                        details.status
                      )}`}
                    >
                      {details.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-black text-[#08566E] leading-tight line-clamp-2">
                    {details.service}
                  </h3>

                  <p className="mt-1 text-[11px] font-black text-[#06485C]">
                    ID: {details.bookingId}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-[#08566E]/85 line-clamp-1">
                    {details.worker}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-[#08566E]/70">
                      {details.urgency}
                    </span>

                    {isReviewed ? (
                      <span className="text-[10px] font-black text-green-700">
                        Reviewed
                      </span>
                    ) : completed ? (
                      <span className="text-[10px] font-black text-green-700">
                        Review Now
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-[#08566E]/70">
                        Review Locked
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {modalDetails && (
        <div className="fixed inset-0 z-[120] bg-black/35 backdrop-blur-sm flex items-end md:items-center justify-center px-3">
          <div
            className="absolute inset-0"
            onClick={closeBookingDetails}
          ></div>

          <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#E1E9E5] border border-white/80 rounded-t-[32px] md:rounded-[32px] shadow-[0_25px_80px_rgba(8,86,110,0.45)] p-5 md:p-6 text-[#08566E]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6FA8AA]">
                  Booking Details
                </p>

                <h3 className="text-2xl md:text-3xl font-black mt-1 leading-tight">
                  {modalDetails.service}
                </h3>

                <p className="text-sm font-black text-[#06485C] mt-1">
                  Booking ID: {modalDetails.bookingId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeBookingDetails}
                className="w-10 h-10 rounded-2xl bg-white/80 border border-[#B4DBDC] text-[#08566E] flex items-center justify-center shadow-md"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-black ${getStatusClass(
                  modalDetails.status
                )}`}
              >
                {modalDetails.status}
              </span>

              <span className="px-3 py-1.5 rounded-full text-xs font-black bg-[#B4DBDC] text-[#08566E]">
                {modalDetails.urgency}
              </span>

              {modalReviewed && (
                <span className="px-3 py-1.5 rounded-full text-xs font-black bg-green-600 text-white">
                  ✅ Reviewed
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3">
              <div className="bg-white/75 rounded-3xl p-4 border border-[#B4DBDC]">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shrink-0">
                    <FaUserTie />
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#6FA8AA]">
                      Worker
                    </p>

                    <p className="font-black text-[#08566E]">
                      {modalDetails.worker}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/75 rounded-3xl p-4 border border-[#B4DBDC]">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#6FA8AA]">
                      Address
                    </p>

                    <p className="font-semibold text-sm text-[#08566E]">
                      {modalDetails.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white/75 rounded-3xl p-4 border border-[#B4DBDC]">
                  <p className="text-xs font-black text-[#6FA8AA]">Date</p>

                  <p className="font-bold text-sm mt-1">
                    {formatDate(modalDetails.date)}
                  </p>
                </div>

                <div className="bg-white/75 rounded-3xl p-4 border border-[#B4DBDC]">
                  <p className="text-xs font-black text-[#6FA8AA]">Issue</p>

                  <p className="font-bold text-sm mt-1">
                    {modalDetails.issue || "No issue details added"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 bg-white/85 border border-[#B4DBDC] rounded-3xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xl font-black text-[#08566E]">
                    Rate & Review
                  </h4>

                  <p className="text-[#06485C] text-xs font-semibold mt-1">
                    Rating option appears only after service completion.
                  </p>
                </div>

                {modalReviewed && (
                  <span className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-black shrink-0">
                    ✅ Reviewed
                  </span>
                )}
              </div>

              {modalReviewed ? (
                <div className="mt-4 bg-green-50 border border-green-300 rounded-2xl p-4">
                  <p className="text-green-700 font-black text-sm flex items-center gap-2">
                    <FaCheckCircle />
                    Thank you for reviewing this booking.
                  </p>
                </div>
              ) : !modalCompleted ? (
                <div className="mt-4 bg-[#F8FCFA] border border-[#B4DBDC] rounded-2xl p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shrink-0">
                      <FaLock />
                    </div>

                    <div>
                      <p className="font-black text-[#08566E]">
                        Review Locked
                      </p>

                      <p className="text-sm font-semibold text-[#06485C] mt-1">
                        The rating and review option will become available only after the work or service is completed.
                      </p>

                      <p className="text-xs font-bold text-[#08566E]/70 mt-2">
                        Current Status: {modalDetails.status}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          updateReviewInput(
                            modalDetails.bookingKey,
                            "rating",
                            star
                          )
                        }
                        className="bg-transparent border-none shadow-none p-0"
                      >
                        <FaStar
                          className={`text-3xl ${
                            star <= Number(modalReview.rating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={modalReview.review}
                    onChange={(event) =>
                      updateReviewInput(
                        modalDetails.bookingKey,
                        "review",
                        event.target.value
                      )
                    }
                    placeholder="Write your review here..."
                    rows={3}
                    className="w-full mt-4 p-4 rounded-2xl border border-[#6FA8AA] bg-[#E1E9E5] text-[#08566E] text-sm font-semibold outline-none focus:border-[#08566E] resize-none"
                  />

                  <button
                    type="button"
                    disabled={reviewLoading[modalDetails.bookingKey]}
                    onClick={() =>
                      submitReview(selectedBooking, selectedBookingIndex)
                    }
                    className="es-primary-cta mt-4 w-full px-5 py-3 rounded-2xl font-black text-sm disabled:opacity-60"
                  >
                    {reviewLoading[modalDetails.bookingKey]
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyBookings;