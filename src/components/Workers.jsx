import { useEffect, useState } from "react"

function Workers({ setSelectedWorker }) {

  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState("All")
const [search, setSearch] = useState("")
  
  useEffect(() => {

  const fetchWorkers = () => {

    fetch(
      "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec"
    )
      .then((res) => res.json())
      .then((data) => {

  console.log("Workers Data:", data)

  if (Array.isArray(data)) {
    setWorkers(data)
  } else {
    setWorkers([])
  }

})
      .catch((error) => {
        console.log(error)
      })

  }

  fetchWorkers()

  const interval = setInterval(() => {
    fetchWorkers()
  }, 3000)

  return () => clearInterval(interval)

}, [])

  return (

    <section
  id="workers"
  className="bg-black text-white py-24 px-5"
>

      <h2 className="text-5xl font-bold text-center text-blue-500 mb-12">
        Our Workers
      </h2>

    <div className="max-w-xl mx-auto mb-8">

  <input
    type="text"
    placeholder="Search worker or service..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full p-4 rounded-xl bg-[#111111] border border-zinc-700 text-white focus:border-blue-500 outline-none"
  />

</div>
      <div className="flex justify-center gap-4 mb-12 flex-wrap">

  <button
    onClick={() => setFilter("All")}
    className={`px-5 py-2 rounded-xl ${
      filter === "All"
        ? "bg-blue-500"
        : "bg-zinc-800 hover:bg-blue-500"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setFilter("ELECTRICIAN")}
    className={`px-5 py-2 rounded-xl ${
      filter === "ELECTRICIAN"
        ? "bg-blue-500"
        : "bg-zinc-800 hover:bg-blue-500"
    }`}
  >
    Electrician
  </button>

  <button
    onClick={() => setFilter("PLUMBER")}
    className={`px-5 py-2 rounded-xl ${
      filter === "PLUMBER"
        ? "bg-blue-500"
        : "bg-zinc-800 hover:bg-blue-500"
    }`}
  >
    Plumber
  </button>

  <button
    onClick={() => setFilter("CARPENTER")}
    className={`px-5 py-2 rounded-xl ${
      filter === "CARPENTER"
        ? "bg-blue-500"
        : "bg-zinc-800 hover:bg-blue-500"
    }`}
  >
    Carpenter
  </button>

  <button
    onClick={() => setFilter("COOK")}
    className={`px-5 py-2 rounded-xl ${
      filter === "COOK"
        ? "bg-blue-500"
        : "bg-zinc-800 hover:bg-blue-500"
    }`}
  >
    Cook
  </button>

</div>


      <div className="grid md:grid-cols-3 gap-8">

        {
          workers
  .filter(worker =>
    filter === "All"
      ? true
      : worker.service?.toLowerCase() === filter.toLowerCase()
  )
  .filter(worker =>
    worker.name?.toLowerCase().includes(search.toLowerCase()) ||
    worker.service?.toLowerCase().includes(search.toLowerCase())
  )
  .map((worker, index) => (

              <div
                key={index}
                className="bg-[#111111] p-6 rounded-3xl border border-zinc-800 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition duration-300 hover:scale-105"
              >

                <img
                  src={worker.image}
                  alt={worker.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150"
                  }}
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-500"
                />

                <h3 className="text-2xl font-bold text-center mt-5 text-slate-200">
                  {worker.name}
                </h3>

                <p className="text-center text-blue-500 mt-2">
                  {worker.service}
                </p>

                <p className="text-center mt-3 text-yellow-400 font-semibold">
  ⭐ {worker.rating}/5
</p>
                <div className="text-center mt-3">

  {worker.status?.trim() === "Available" ? (

  <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
    🟢 Available
  </span>

) : (

  <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
    🔴 Busy
  </span>

)}

</div>

                <p className="text-center text-zinc-400 mt-2">
                  {worker.location}
                </p>

                <p className="text-center text-zinc-500 mt-2">
                  {worker.experience}
                </p>


                <button
  disabled={worker.status?.trim() === "Busy"}
  onClick={() => {

    if (worker.status?.trim() !== "Busy") {
      setSelectedWorker(worker)
    }

  }}
  className={`w-full mt-5 py-3 rounded-xl transition duration-300 ${
    worker.status?.trim() === "Busy"
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 font-bold"
  }`}
>
  {worker.status?.trim() === "Busy"
    ? "Worker Busy"
    : "Book Worker"}
</button>

              </div>

            ))
        }

      </div>

    </section>

  )
}

export default Workers