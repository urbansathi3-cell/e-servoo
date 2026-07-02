import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MyBookings() {

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [rating, setRating] = useState(5);
const [review, setReview] = useState("");
const [submitting, setSubmitting] = useState(false);

 useEffect(() => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) return;

  fetch(
    `https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?phone=${user.phone}`
  )
    .then(res => res.json())
    .then(data => setBookings(data))
    .catch(err => console.log(err));

}, []);



const submitReview = async (worker) => {

  const user = JSON.parse(localStorage.getItem("user"));

  setSubmitting(true);

  await fetch(
    "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
    {
      method: "POST",
      body: JSON.stringify({
        action: "review",
        worker,
        customer: user.name,
        rating,
        review
      })
    }
  );

  setSubmitting(false);

  alert("Review Submitted Successfully");

  setRating(5);
  setReview("");

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

          {bookings.map((booking, index) => (

            <div
              key={index}
              className="bg-[#6FA8AA] shadow-lg p-6 rounded-2xl border border-[#5F9FA2]"
            >

              <h3 className="text-xl font-bold text-[#E1E9E5]">
                {booking.Service}
              </h3>

              <p className="mt-3 text-[#E1E9E5]">
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

              {booking.Status === "Completed" && (

<div className="mt-6 border-t border-white/30 pt-4">

  <h4 className="font-bold text-white mb-3">
    ⭐ Rate This Worker
  </h4>

  <div className="flex gap-2 mb-4">

    {[1,2,3,4,5].map((star)=>(

      <FaStar
        key={star}
        size={28}
        onClick={()=>setRating(star)}
        className={`cursor-pointer ${
          star<=rating
            ? "text-yellow-400"
            : "text-gray-300"
        }`}
      />

    ))}

  </div>

  <textarea
    value={review}
    onChange={(e)=>setReview(e.target.value)}
    placeholder="Write your review..."
    className="w-full p-3 rounded-xl text-black"
    rows={3}
  />

  <button
    onClick={()=>submitReview(booking.Worker)}
    disabled={submitting}
    className="mt-4 bg-[#08566E] text-white px-5 py-3 rounded-xl w-full"
  >
    {submitting ? "Submitting..." : "Submit Review"}
  </button>

</div>

)}

            </div>

          ))}

        </div>

      )}

    </section>

  );

}

export default MyBookings;