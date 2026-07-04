import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
const [reviewedBookings, setReviewedBookings] = useState(
  JSON.parse(localStorage.getItem("reviewedBookings")) || {}
);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    fetch(
      `https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?phone=${user.phone}`
    )
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.log(err));
  }, []);

const submitReview = async (booking) => {

  const bookingKey =
    booking.BookingID || booking["Booking id"] || booking.Worker;

  const selectedRating =
    ratings[bookingKey] || 5;

  const writtenReview =
    reviews[bookingKey] || "";

  if (!writtenReview.trim()) {
    alert("Please write a review");
    return;
  }

  setSubmittingId(bookingKey);

  try {

    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
      {
        method: "POST",
        body: JSON.stringify({
          action: "review",

          workerId:
            booking.WorkerId ||
            booking["Worker id"] ||
            booking.Worker,

          bookingId:
            booking.BookingID ||
            booking["Booking id"],

          rating: selectedRating,

          review: writtenReview
        })
      }
    );

    const data = await res.json();

    if (data.success) {

      alert("Review Submitted Successfully");

      const updatedReviewedBookings = {
        ...reviewedBookings,
        [bookingKey]: true
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

      alert(data.message || "Review Failed");

    }

  } catch (error) {

    console.log(error);
    alert("Network Error");

  }

  setSubmittingId(null);

};
  return (
    <section className="bg-[#B4DBDC] min-h-screen text-slate-900 py-20 px-5">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>

        <h2 className="text-4xl font-bold text-[#08566E]">
          My Bookings
        </h2>
      </div>

      {bookings.length === 0 ? (
        <p className="text-center text-[#5F6F72] text-lg">
          No Bookings Found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking, index) => {
            const bookingKey =
  booking.BookingID || booking["Booking id"] || index;
            const currentRating = ratings[bookingKey] || 5;
            const currentReview = reviews[bookingKey] || "";

            return (
              <div
                key={index}
                className="bg-[#6FA8AA] shadow-lg p-6 rounded-2xl border border-[#5F9FA2]"
              >
                <h3 className="text-xl font-bold text-[#E1E9E5]">
                  {booking.Service}
                </h3>

                <p className="mt-3 text-[#E1E9E5]">
                  <strong>Booking ID:</strong> {booking.BookingID}
                </p>

                <p className="mt-2 text-[#E1E9E5]">
                  <strong>Worker:</strong> {booking.Worker}
                </p>

                <p className="mt-2 text-[#E1E9E5]">
                  <strong>Date:</strong>{" "}
                  {new Date(booking.Date).toLocaleDateString()}
                </p>

                <div className="mt-4">
                  <span className="bg-[#08566E] text-[#E1E9E5] px-3 py-1 rounded-full text-sm font-semibold">
                    {booking.Status}
                  </span>
                </div>

                {booking.Status?.trim().toLowerCase() === "completed" && (
  <div className="mt-6 border-t border-white/30 pt-4">

    {reviewedBookings[bookingKey] ? (

      <div className="bg-green-700 text-white p-4 rounded-xl font-bold text-center">
        ✅ Review Submitted
      </div>

    ) : (

      <>

        <h4 className="font-bold text-white mb-3">
          ⭐ Rate This Worker
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
          className="w-full p-3 rounded-xl text-black outline-none"
          rows={3}
        />

        <button
          onClick={() => submitReview(booking)}
          disabled={submittingId === bookingKey}
          className={`mt-4 text-white px-5 py-3 rounded-xl w-full font-bold ${
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
    </section>
  );
}

export default MyBookings;