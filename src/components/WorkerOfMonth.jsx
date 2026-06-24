import { useEffect, useState } from "react";

function WorkerOfMonth() {

  const [worker, setWorker] = useState(null);

  useEffect(() => {

    fetch(
      "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec"
    )
      .then(res => res.json())
      .then(data => {

        if (!Array.isArray(data)) return;

        const bestWorker = [...data]
          .sort(
            (a, b) =>
              (Number(b.rating || 0) +
                Number(b.TrustScore || 0))
              -
              (Number(a.rating || 0) +
                Number(a.TrustScore || 0))
          )[0];

        setWorker(bestWorker);

      });

  }, []);

  if (!worker) return null;

  return (

    <section className="flex justify-center py-8 overflow-hidden">

      <div
        className="
        animate-workerSlide
        bg-gradient-to-r
        from-yellow-500
        to-orange-500
        text-black
        rounded-3xl
        p-6
        w-[90%]
        max-w-2xl
        shadow-2xl
        text-center
        "
      >

        <h2 className="text-3xl font-bold mb-4">
          🏆 Worker of the Month
        </h2>

        <img
          src={worker.image}
          alt={worker.name}
          className="
          w-28
          h-28
          rounded-full
          mx-auto
          object-cover
          border-4
          border-white
          "
        />

        <h3 className="text-2xl font-bold mt-4">
          {worker.name}
        </h3>

        <p className="font-semibold">
          {worker.service}
        </p>

        <p className="mt-2">
          ⭐ {worker.rating}
        </p>

        <p>
          🛡️ {worker.TrustScore}% Trust
        </p>

      </div>

    </section>

  );
}

export default WorkerOfMonth;