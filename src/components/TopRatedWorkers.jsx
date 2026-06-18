function TopRatedWorkers({ workers, setSelectedWorker }) {

  const topWorkers = [...workers]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 5);

  return (
    <div className="px-4 mt-8">

      <h2 className="text-2xl font-bold text-white mb-4">
        ⭐ Top Rated Workers
      </h2>

      <div className="grid gap-4">

        {topWorkers.map((worker) => (

          <div
            key={worker.id}
            className="bg-zinc-900 border border-yellow-500 rounded-2xl p-4"
          >

            <div className="flex items-center gap-3">

              <img
                src={worker.image}
                alt={worker.name}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div>

                <h3 className="text-white font-bold">
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