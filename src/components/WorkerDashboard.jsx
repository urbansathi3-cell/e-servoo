import { useEffect, useState } from "react"

function WorkerDashboard() {

const [worker, setWorker] = useState(null)
const [bookings, setBookings] = useState([])

useEffect(() => {

const savedWorker = JSON.parse(
  localStorage.getItem("worker")
)

setWorker(savedWorker)

if (savedWorker) {

  fetch(
    `https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?worker=${savedWorker.name}`
  )
    .then(res => res.json())
    .then(data => {

      console.log("Worker Jobs:", data)

      if (Array.isArray(data)) {
        setBookings(data)
      }

    })
    .catch(err => console.log(err))

}

}, [])

const handleLogout = () => {

localStorage.removeItem("worker")
window.location.reload()

}

if (!worker) return null

return (

<section className="bg-black text-white py-20 px-5">

  <div className="max-w-5xl mx-auto">

    <div className="bg-zinc-900 p-8 rounded-3xl border border-blue-500">

      <h2 className="text-4xl font-bold text-blue-500 mb-8">
        Worker Dashboard
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-zinc-800 p-6 rounded-2xl">
          <h3 className="text-xl font-bold">Name</h3>
          <p>{worker.name}</p>
        </div>

        <div className="bg-zinc-800 p-6 rounded-2xl">
          <h3 className="text-xl font-bold">Service</h3>
          <p>{worker.service}</p>
        </div>

        <div className="bg-zinc-800 p-6 rounded-2xl">
          <h3 className="text-xl font-bold">Phone</h3>
          <p>{worker.phone}</p>
        </div>

        <div className="bg-zinc-800 p-6 rounded-2xl">
          <h3 className="text-xl font-bold">Status</h3>
          <span className="text-green-500">
            Available
          </span>
        </div>

      </div>

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 px-6 py-3 rounded-xl"
      >
        Logout
      </button>

      <div className="mt-12">

        <h3 className="text-3xl font-bold text-blue-500 mb-6">
          Assigned Jobs
        </h3>

        {bookings.length === 0 ? (

          <p className="text-zinc-400">
            No Jobs Assigned
          </p>

        ) : (

          bookings.map((job, index) => (

            <div
              key={index}
              className="bg-zinc-800 p-6 rounded-2xl mb-4"
            >

              <p>
                Customer: {job.Name}
              </p>

              <p>
                Phone: {job.Phone}
              </p>

              <p>
                Address: {job.Address}
              </p>

              <p>
                Service: {job.Service}
              </p>

              <p>
                Status: {job.Status}
              </p>

            </div>

          ))

        )}

      </div>

    </div>

  </div>

</section>

)

}

export default WorkerDashboard
