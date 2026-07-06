import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";
import {
  FaStar,
  FaArrowLeft,
  FaClipboardList,
  FaUserCheck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPen,
} from "react-icons/fa";

function MyBookings({ language = "en" }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const [bookings, setBookings] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviewedBookings, setReviewedBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("reviewedBookings")) || {};
    } catch {
      return {};
    }
  });

  const text = {
    back:
      language === "hi"
        ? "वापस"
        : language === "od"
          ? "ପଛକୁ"
          : "Back",

    title:
      t.myBookingsTitle ||
      (language === "hi"
        ? "मेरी बुकिंग्स"
        : language === "od"
          ? "ମୋ ବୁକିଂ"
          : "My Bookings"),

    subtitle:
      language === "hi"
        ? "आपकी सभी सर्विस बुकिंग्स और उनके स्टेटस यहाँ दिखेंगे।"
        : language === "od"
          ? "ଆପଣଙ୍କ ସମସ୍ତ service booking ଏବଂ status ଏଠାରେ ଦେଖାଯିବ।"
          : "Track all your service bookings and review completed jobs.",

    noBookings:
      t.noBookingsFound ||
      (language === "hi"
        ? "कोई बुकिंग नहीं मिली"
        : language === "od"
          ? "କୌଣସି ବୁକିଂ ମିଳିଲା ନାହିଁ"
          : "No Bookings Found"),

    loading:
      language === "hi"
        ? "बुकिंग्स लोड हो रही हैं..."
        : language === "od"
          ? "ବୁକିଂ load ହେଉଛି..."
          : "Loading bookings...",

    bookingId:
      t.bookingId || "Booking ID",

    service:
      t.service || "Service",

    worker:
      t.worker || "Worker",

    date:
      t.date || "Date",

    status:
      t.bookingStatus || "Status",

    address:
      t.address || "Address",

    issue:
      t.issueDescription || "Issue Description",

    priority:
      t.priority || "Priority",

    rateWorker:
      language === "hi"
        ? "इस वर्कर को रेट करें"
        : language === "od"
          ? "ଏହି worker କୁ rating ଦିଅନ୍ତୁ"
          : "Rate This Worker",

    writeReview:
      language === "hi"
        ? "अपना review लिखें..."
        : language === "od"
          ? "ଆପଣଙ୍କ review ଲେଖନ୍ତୁ..."
          : "Write your review...",

    submitReview:
      language === "hi"
        ? "Review Submit करें"
        : language === "od"
          ? "Review Submit କରନ୍ତୁ"
          : "Submit Review",

    submitting:
      language === "hi"
        ? "Submit हो रहा है..."
        : language === "od"
          ? "Submit ହେଉଛି..."
          : "Submitting...",

    reviewSubmitted:
      language === "hi"
        ? "Review Submit हो गया"
        : language === "od"
          ? "Review Submit ହୋଇଗଲା"
          : "Review Submitted",

    reviewRequired:
      language === "hi"
        ? "कृपया review लिखें"
        : language === "od"
          ? "ଦୟାକରି review ଲେଖନ୍ତୁ"
          : "Please write a review",

    success:
      language === "hi"
        ? "Review सफलतापूर्वक submit हो गया"
        : language === "od"
          ? "Review ସଫଳତାର ସହିତ submit ହେଲା"
          : "Review Submitted Successfully",

    failed:
      language === "hi"
        ? "Review Failed"
        : language === "od"
          ? "Review Failed"
          : "Review Failed",

    networkError:
      language === "hi"
        ? "Network Error"
        : language === "od"
          ? "Network Error"
          : "Network Error",
  };

  const API_URL =
    "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}?phone=${user.phone}&nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
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

  const getValue = (booking, keys, fallback = "") => {
    for (const key of keys) {
      if (booking?.[key] !== undefined && booking?.[key] !== null) {
        return booking[key];
      }
    }

    return fallback;
  };

  const getBookingKey = (booking, index) => {
    return (
      getValue(booking, ["BookingID", "BookingId", "Booking id", "bookingId"]) ||
      `${getValue(booking, ["Worker"], "worker")}-${index}`
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

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

  const getStatusClass = (status) => {
    const statusText = String(status || "").trim().toLowerCase();

    if (statusText === "completed") {
      return "bg-green-600 text-white";
    }

    if (statusText === "pending") {
      return "bg-yellow-500 text-[#08566E]";
    }

    if (statusText === "cancelled" || statusText === "canceled") {
      return "bg-red-500 text-white";
    }

    if (statusText === "accepted" || statusText === "confirmed") {
      return "bg-[#08566E] text-[#E1E9E5]";
    }

    return "bg-[#6FA8AA] text-[#E1E9E5]";
  };

  const submitReview = async (booking, index) => {
    const bookingKey = getBookingKey(booking, index);

    const selectedRating = ratings[bookingKey] || 5;
    const writtenReview = reviews[bookingKey] || "";

    if (!writtenReview.trim()) {
      alert(text.reviewRequired);
      return;
    }

    setSubmittingId(bookingKey);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "review",

          workerId:
            getValue(booking, ["WorkerId", "WorkerID", "Worker id"]) ||
            getValue(booking, ["Worker"]),

          bookingId: getValue(booking, [
            "BookingID",
            "BookingId",
            "Booking id",
            "bookingId",
          ]),

          rating: selectedRating,

          review: writtenReview,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(text.success);

        const updatedReviewedBookings = {
          ...reviewedBookings,
          [bookingKey]: true,
        };

        setReviewedBookings(updatedReviewedBookings);

        localStorage.setItem(
          "reviewedBookings",
          JSON.stringify(updatedReviewedBookings)
        );

        setReviews({
          ...reviews,
          [bookingKey]: "",
        });

        setRatings({
          ...ratings,
          [bookingKey]: 5,
        });
      } else {
        alert(data.message || text.failed);
      }
    } catch (error) {
      console.log(error);
      alert(text.networkError);
    }

    setSubmittingId(null);
  };

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-slate-900 py-20 px-5">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#08566E]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#6FA8AA]/35 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-5 py-3 rounded-full font-bold shadow-lg transition"
            >
              <FaArrowLeft />
              {text.back}
            </button>

            <div className="mt-6">
              <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2 rounded-full shadow-lg text-[#08566E] font-extrabold mb-4">
                <FaClipboardList />
                {text.title}
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-[#08566E]">
                {text.title}
              </h2>

              <p className="text-[#08566E]/75 mt-3 font-semibold max-w-2xl">
                {text.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white/35 backdrop-blur-xl border border-white/60 rounded-[30px] p-6 shadow-xl animate-pulse"
              >
                <div className="h-7 w-40 bg-[#08566E]/20 rounded-full"></div>
                <div className="h-4 w-64 bg-[#08566E]/20 rounded-full mt-5"></div>
                <div className="h-4 w-52 bg-[#08566E]/20 rounded-full mt-3"></div>
                <div className="h-10 w-full bg-[#08566E]/20 rounded-2xl mt-6"></div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && bookings.length === 0 && (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center text-3xl shadow-xl">
              <FaClipboardList />
            </div>

            <h3 className="text-3xl font-black text-[#08566E] mt-6">
              {text.noBookings}
            </h3>

            <p className="text-[#08566E]/70 font-semibold mt-2">
              Book a service from E-SERVOO and your request will appear here.
            </p>
          </div>
        )}

        {/* BOOKINGS GRID */}
        {!loading && bookings.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((booking, index) => {
              const bookingKey = getBookingKey(booking, index);

              const currentRating = ratings[bookingKey] || 5;
              const currentReview = reviews[bookingKey] || "";

              const service = getValue(booking, ["Service", "service"], "N/A");
              const worker = getValue(booking, ["Worker", "worker"], "N/A");
              const status = getValue(booking, ["Status", "status"], "Pending");
              const date = getValue(booking, ["Date", "date"], "");
              const address = getValue(booking, ["Address", "address"], "");
              const issue = getValue(
                booking,
                ["Issue Description", "IssueDescription", "issueDescription"],
                ""
              );
              const urgency = getValue(booking, ["Urgency", "urgency"], "");

              const isCompleted =
                String(status).trim().toLowerCase() === "completed";

              return (
                <div
                  key={bookingKey}
                  className="group relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-[30px] p-6 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition duration-300"
                >
                  <div className="absolute inset-x-0 top-0 h-2 bg-[#08566E]"></div>

                  {/* CARD TOP */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-[#08566E]">
                        {service}
                      </h3>

                      <p className="text-[#08566E]/70 font-bold mt-1">
                        {text.bookingId}: {bookingKey}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 px-4 py-2 rounded-full text-xs font-extrabold shadow-md ${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#E1E9E5]/90 rounded-2xl p-4">
                      <p className="text-xs text-[#6FA8AA] font-bold flex items-center gap-2">
                        <FaUserCheck />
                        {text.worker}
                      </p>

                      <p className="text-[#08566E] font-extrabold mt-1">
                        {worker}
                      </p>
                    </div>

                    <div className="bg-[#E1E9E5]/90 rounded-2xl p-4">
                      <p className="text-xs text-[#6FA8AA] font-bold flex items-center gap-2">
                        <FaCalendarAlt />
                        {text.date}
                      </p>

                      <p className="text-[#08566E] font-extrabold mt-1">
                        {formatDate(date)}
                      </p>
                    </div>

                    {urgency && (
                      <div className="bg-[#E1E9E5]/90 rounded-2xl p-4">
                        <p className="text-xs text-[#6FA8AA] font-bold">
                          {text.priority}
                        </p>

                        <p className="text-[#08566E] font-extrabold mt-1">
                          {urgency}
                        </p>
                      </div>
                    )}

                    {address && (
                      <div className="bg-[#E1E9E5]/90 rounded-2xl p-4">
                        <p className="text-xs text-[#6FA8AA] font-bold flex items-center gap-2">
                          <FaMapMarkerAlt />
                          {text.address}
                        </p>

                        <p className="text-[#08566E] font-extrabold mt-1 line-clamp-2">
                          {address}
                        </p>
                      </div>
                    )}
                  </div>

                  {issue && (
                    <div className="mt-4 bg-[#08566E]/10 border border-[#08566E]/15 rounded-2xl p-4">
                      <p className="text-[#08566E] font-extrabold">
                        {text.issue}
                      </p>

                      <p className="text-[#08566E]/75 font-semibold mt-1">
                        {issue}
                      </p>
                    </div>
                  )}

                  {/* REVIEW SECTION */}
                  {isCompleted && (
                    <div className="mt-6 border-t border-[#08566E]/20 pt-5">
                      {reviewedBookings[bookingKey] ? (
                        <div className="bg-green-600 text-white p-4 rounded-2xl font-bold text-center flex items-center justify-center gap-2">
                          <FaCheckCircle />
                          {text.reviewSubmitted}
                        </div>
                      ) : (
                        <>
                          <h4 className="font-black text-[#08566E] mb-3 flex items-center gap-2">
                            <FaPen />
                            {text.rateWorker}
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
                                className={`cursor-pointer transition hover:scale-110 ${
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
                            placeholder={text.writeReview}
                            className="w-full p-4 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] outline-none focus:border-[#08566E] resize-none"
                            rows={3}
                          />

                          <button
                            onClick={() => submitReview(booking, index)}
                            disabled={submittingId === bookingKey}
                            className={`mt-4 text-white px-5 py-3 rounded-2xl w-full font-extrabold transition ${
                              submittingId === bookingKey
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-[#08566E] hover:bg-[#06485C]"
                            }`}
                          >
                            {submittingId === bookingKey
                              ? text.submitting
                              : text.submitReview}
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