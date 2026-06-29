import { useEffect, useState } from "react";

function Stats() {

  const [stats, setStats] = useState({
    workers: 0,
    services: 0,
    bookings: 0,
    completedJobs: 0,
    satisfaction: 0
  });

  useEffect(() => {

   fetch(
"https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?action=stats&nocache=" + Date.now()
)
      .then(res => res.json())
      .then(data => {

        console.log("Stats Data:", data);

        setStats({
          workers: data.workers || 0,
          services: data.services || 0,
          bookings: data.bookings || 0,
          completedJobs: data.completedJobs || 0,
          satisfaction: data.satisfaction || 0
        });

      });

  }, []);

  return (

    <section className="py-12 bg-[#9ECFD0]">

      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

          <div className="bg-[#6A9A9A] p-5 rounded-2xl text-center shadow-md">
            <h2 className="text-3xl font-bold text-blue-400">
              {stats.workers}
            </h2>
            <p>Workers</p>
          </div>

          <div className="bg-[#6A9A9A] p-5 rounded-2xl text-center shadow-md">
            <h2 className="text-3xl font-bold text-green-400">
              {stats.services}
            </h2>
            <p>Services</p>
          </div>

          <div className="bg-[#6A9A9A] p-5 rounded-2xl text-center shadow-md">
            <h2 className="text-3xl font-bold text-yellow-400">
              {stats.bookings}
            </h2>
            <p>Bookings</p>
          </div>

          <div className="bg-[#6A9A9A] p-5 rounded-2xl text-center shadow-md">
            <h2 className="text-3xl font-bold text-purple-400">
              {stats.completedJobs}
            </h2>
            <p>Completed Jobs</p>
          </div>

          <div className="bg-[#6A9A9A] p-5 rounded-2xl text-center shadow-md">
            <h2 className="text-3xl font-bold text-orange-400">
              {stats.satisfaction}
            </h2>
            <p>Satisfaction</p>
          </div>

        </div>

      </div>

    </section>

  );
}

export default Stats;