import { useEffect, useState } from "react"

function MyBookings() {

  const [bookings, setBookings] = useState([])

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    )

    if (!user) return

    fetch(
      `https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?phone=${user.phone}`
    )
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.log(err))

  }, [])

  return (

    <section className="bg-black text-white py-20 px-5">

      <h2 className="text-4xl font-bold text-blue-500 text-center mb-10">
        My Bookings
      </h2>

      {bookings.length === 0 ? (

        <p className="text-center text-zinc-400">
          No Bookings Found
        </p>

      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {bookings.map((booking, index) => (

            <div
              key={index}
              className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800"
            >

              <h3 className="text-xl font-bold">
  {booking.Service}
</h3>

<p className="mt-2">
  Worker: {booking.Worker}
</p>

<p>
  Date: {new Date(booking.Date).toLocaleDateString()}
</p>

<div className="mt-3">

  <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
    {booking.Status}
  </span>

</div>

            </div>

          ))}

        </div>

      )}

    </section>

  )

}

export default MyBookings