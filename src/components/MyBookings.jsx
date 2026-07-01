import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyBookings() {

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

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

            </div>

          ))}

        </div>

      )}

    </section>

  );

}

export default MyBookings;