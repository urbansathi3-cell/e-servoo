import { useEffect, useState } from "react"

function Workers({ setSelectedWorker }) {

  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState("All")

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
  className="bg-zinc-900 text-white py-20 px-5"
>

      <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
        Our Workers
      </h2>


      <div className="flex justify-center gap-4 mb-12 flex-wrap">

  <button
    onClick={() => setFilter("All")}
    className={`px-5 py-2 rounded-xl ${
      filter === "All"
        ? "bg-orange-500"
        : "bg-zinc-800 hover:bg-orange-500"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setFilter("ELECTRICIAN")}
    className={`px-5 py-2 rounded-xl ${
      filter === "ELECTRICIAN"
        ? "bg-orange-500"
        : "bg-zinc-800 hover:bg-orange-500"
    }`}
  >
    Electrician
  </button>

  <button
    onClick={() => setFilter("PLUMBER")}
    className={`px-5 py-2 rounded-xl ${
      filter === "PLUMBER"
        ? "bg-orange-500"
        : "bg-zinc-800 hover:bg-orange-500"
    }`}
  >
    Plumber
  </button>

  <button
    onClick={() => setFilter("CARPENTER")}
    className={`px-5 py-2 rounded-xl ${
      filter === "CARPENTER"
        ? "bg-orange-500"
        : "bg-zinc-800 hover:bg-orange-500"
    }`}
  >
    Carpenter
  </button>

  <button
    onClick={() => setFilter("COOK")}
    className={`px-5 py-2 rounded-xl ${
      filter === "COOK"
        ? "bg-orange-500"
        : "bg-zinc-800 hover:bg-orange-500"
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
                : worker.service.toLowerCase() === filter.toLowerCase()
            )
            .map((worker, index) => (

              <div
                key={index}
                className="bg-black p-6 rounded-3xl border border-zinc-800 hover:border-orange-500 transition duration-300 hover:scale-105"
              >

                <img
                  src={worker.image}
                  alt={worker.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150"
                  }}
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-orange-500"
                />

                <h3 className="text-2xl font-bold text-center mt-5">
                  {worker.name}
                </h3>

                <p className="text-center text-orange-500 mt-2">
                  {worker.service}
                </p>

                <p className="text-center mt-3">
                  ⭐ {worker.rating}
                </p>
                <div className="text-center mt-3">

  {worker.status?.trim() === "Available" ? (

    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
      🟢 Available
    </span>

  ) : (

    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
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
      : "bg-orange-500 hover:bg-orange-600"
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