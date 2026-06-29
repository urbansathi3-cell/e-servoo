function TopRatedWorkers({ workers, setSelectedWorker }) {

  const topWorkers = [...workers]
  .filter(worker =>
    (Number(worker.rating || 0) * 0.7 +
     Number(worker.TrustScore || 0) * 0.3) >= 4.5
  )
  .sort((a, b) =>
    (Number(b.rating || 0) * 0.7 +
     Number(b.TrustScore || 0) * 0.3)
    -
    (Number(a.rating || 0) * 0.7 +
     Number(a.TrustScore || 0) * 0.3)
  )
  .slice(0, 10);

  return (
    <div className="px-4 mt-8">

      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        ⭐ Top Rated Workers
      </h2>

      <div className="grid gap-4">

  {topWorkers.length === 0 && (
    <p className="text-gray-400">
      No top rated workers available yet
    </p>
  )}
  

        {topWorkers.map((worker) => (

          <div
            key={worker.id}
            className="bg-white shadow-xl border border-yellow-500 rounded-2xl p-4"
          >

            <div className="flex items-center gap-3">

              <img
                src={worker.image}
                alt={worker.name}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div>

                <h3 className="text-slate-900 font-bold">
                  {worker.name}
                </h3>

                <p className="text-blue-400">
                  {worker.service}
                </p>

                <p className="text-yellow-400">
                  ⭐ {worker.rating}
                </p>

                <p className="text-green-400">
                  Trust Score: {worker.TrustScore}
                </p>

              </div>

            </div>

            <button
              onClick={() => setSelectedWorker(worker)}
              className="w-full mt-4 bg-blue-500 py-2 rounded-xl"
            >
              Book Now
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default TopRatedWorkers;