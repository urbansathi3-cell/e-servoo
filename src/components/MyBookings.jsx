import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft, FaClipboardList } from "react-icons/fa";
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

  const [bookings, setBookings] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviewedBookings, setReviewedBookings] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem("reviewedBookings"), {});

    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      localStorage.removeItem("reviewedBookings");
      return {};
    }

    return saved;
  });

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "my_bookings",
      ...extraData,
    });
  };

  const getBookingValue = (booking, keys, fallback = "") => {
    for (const key of keys) {
      if (
        booking?.[key] !== undefined &&
        booking?.[key] !== null &&
        booking?.[key] !== ""
      ) {
        return booking[key];
      }
    }

    return fallback;
  };

  const getBookingKey = (booking, index = 0) => {
    return (
      getBookingValue(
        booking,
        ["BookingID", "BookingId", "Booking id", "bookingId", "id"],
        ""
      ) ||
      `${getBookingValue(booking, ["Worker", "worker"], "worker")}-${index}`
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not Available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const user = getStoredUser();

    if (!user || !user.phone) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(
      `${API_URL}?phone=${encodeURIComponent(user.phone)}&nocache=${Date.now()}`
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

  const submitReview = async (booking, index) => {
    const bookingKey = getBookingKey(booking, index);

    const selectedRating = ratings[bookingKey] || 5;
    const writtenReview = reviews[bookingKey] || "";

    if (!writtenReview.trim()) {
      alert("Please write a review.");
      return;
    }

    setSubmittingId(bookingKey);

    try {
      const workerId = getBookingValue(
        booking,
        ["WorkerId", "WorkerID", "Worker id", "workerId"],
        getBookingValue(booking, ["Worker", "worker"], "")
      );

      const bookingId = getBookingValue(
        booking,
        ["BookingID", "BookingId", "Booking id", "bookingId"],
        bookingKey
      );

      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "review",
          token: getStoredToken(),
          workerId,
          bookingId,
          rating: selectedRating,
          review: writtenReview.trim(),
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        alert(data.message || "Review failed.");
        setSubmittingId(null);
        return;
      }

      alert("Review Submitted Successfully");

      const updatedReviewedBookings = {
        ...reviewedBookings,
        [bookingKey]: true,
      };

      setReviewedBookings(updatedReviewedBookings);
      saveJsonToStorage("reviewedBookings", updatedReviewedBookings);

      setReviews({
        ...reviews,
        [bookingKey]: "",
      });

      setRatings({
        ...ratings,
        [bookingKey]: 5,
      });

      pushEvent("review_submitted", {
        rating: selectedRating,
      });
    } catch (error) {
      console.log(error);
      alert("Network Error");
    }

    setSubmittingId(null);
  };

  const user = getStoredUser();

  if (!user) {
    return (
      <section className="bg-[#B4DBDC] min-h-screen text-[#08566E] py-20 px-5 flex items-center justify-center">
        <div className="bg-[#E1E9E5] rounded-3xl p-8 text-center shadow-xl max-w-md w-full border border-[#6FA8AA]">
          <FaClipboardList className="text-5xl mx-auto text-[#08566E]" />

          <h2 className="text-3xl font-black text-[#08566E] mt-5">
            Please Login First
          </h2>

          <p className="text-[#06485C] font-semibold mt-3">
            Your session was not found. Login again to view your bookings.
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

  return (
    <section className="bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] min-h-screen text-[#08566E] py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="es-secondary-cta inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition"
            >
              <FaArrowLeft />
              Back
            </button>

            <h2 className="text-4xl md:text-5xl font-black text-[#08566E] mt-6">
              My Bookings
            </h2>

            <p className="text-[#06485C] font-semibold mt-2">
              Track your service bookings and submit reviews after completion.
            </p>
          </div>

          <div className="bg-[#E1E9E5]/85 border border-white/80 rounded-3xl p-5 shadow-xl">
            <p className="text-[#6FA8AA] font-black text-sm">
              Total Bookings
            </p>

            <p className="text-[#08566E] text-4xl font-black">
              {bookings.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-[#E1E9E5]/80 border border-white/80 rounded-3xl p-6 shadow-xl animate-pulse"
              >
                <div className="h-7 w-40 bg-[#08566E]/20 rounded-full"></div>
                <div className="h-4 w-64 bg-[#08566E]/20 rounded-full mt-5"></div>
                <div className="h-4 w-52 bg-[#08566E]/20 rounded-full mt-3"></div>
                <div className="h-10 w-32 bg-[#08566E]/20 rounded-full mt-6"></div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#E1E9E5]/90 border border-[#6FA8AA] rounded-3xl p-10 text-center shadow-xl">
            <FaClipboardList className="text-5xl mx-auto text-[#08566E]" />

            <p className="text-[#08566E] font-black text-2xl mt-5">
              No Bookings Found
            </p>

            <p className="text-[#06485C] font-semibold mt-2">
              Book a service first, then your bookings will appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="es-primary-cta mt-6 px-6 py-3 rounded-2xl font-black"
            >
              Book a Service
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((booking, index) => {
              const bookingKey = getBookingKey(booking, index);
              const currentRating = ratings[bookingKey] || 5;
              const currentReview = reviews[bookingKey] || "";

              const service = getBookingValue(
                booking,
                ["Service", "service"],
                "Service"
              );

              const worker = getBookingValue(
                booking,
                ["Worker", "worker"],
                "Worker"
              );

              const bookingId = getBookingValue(
                booking,
                ["BookingID", "BookingId", "Booking id", "bookingId"],
                bookingKey
              );

              const date = getBookingValue(
                booking,
                ["Date", "date"],
                ""
              );

              const status = getBookingValue(
                booking,
                ["Status", "status"],
                "Pending"
              );

              const issue = getBookingValue(
                booking,
                ["Issue Description", "issueDescription", "Issue", "issue"],
                ""
              );

              const isCompleted =
                String(status).trim().toLowerCase() === "completed";

              return (
                <div
                  key={bookingKey}
                  className="bg-[#E1E9E5]/90 shadow-xl p-6 rounded-3xl border border-white/90"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-[#08566E]">
                        {service}
                      </h3>

                      <p className="mt-2 text-[#06485C] font-semibold">
                        Worker: {worker}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-black ${
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

                  <div className="mt-5 bg-white/85 border border-[#B4DBDC] rounded-2xl p-4">
                    <p className="text-[#08566E] font-bold">
                      <strong>Booking ID:</strong> {bookingId}
                    </p>

                    <p className="mt-2 text-[#08566E] font-bold">
                      <strong>Date:</strong> {formatDate(date)}
                    </p>

                    {issue && (
                      <p className="mt-2 text-[#06485C] font-semibold">
                        <strong>Issue:</strong> {issue}
                      </p>
                    )}
                  </div>

                  {isCompleted && (
                    <div className="mt-6 border-t border-[#6FA8AA]/40 pt-4">
                      {reviewedBookings[bookingKey] ? (
                        <div className="bg-green-600 text-white p-4 rounded-2xl font-black text-center">
                          ✅ Review Submitted
                        </div>
                      ) : (
                        <>
                          <h4 className="font-black text-[#08566E] mb-3">
                            Rate This Worker
                          </h4>

                          <div className="flex gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                size={30}
                                onClick={() =>
                                  setRatings({
                                    ...ratings,
                                    [bookingKey]: star,
                                  })
                                }
                                className={`cursor-pointer transition ${
                                  star <= currentRating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          <textarea
                            value={currentReview}
                            onChange={(e) =>
                              setReviews({
                                ...reviews,
                                [bookingKey]: e.target.value,
                              })
                            }
                            placeholder="Write your review..."
                            className="w-full p-3 rounded-2xl text-[#08566E] bg-white border border-[#6FA8AA] outline-none font-semibold"
                            rows={3}
                          />

                          <button
                            type="button"
                            onClick={() => submitReview(booking, index)}
                            disabled={submittingId === bookingKey}
                            className={`es-primary-cta mt-4 px-5 py-3 rounded-2xl w-full font-black ${
                              submittingId === bookingKey
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-[#08566E] hover:bg-[#06485C]"
                            }`}
                          >
                            {submittingId === bookingKey
                              ? "Submitting..."
                              : "Submit Review"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyBookings;