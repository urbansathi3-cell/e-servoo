import { useEffect, useState } from "react";

function WorkerDashboard() {
  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedWorker = JSON.parse(localStorage.getItem("worker"));

    setWorker(savedWorker);

    if (savedWorker) {
      fetch(
        `https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?worker=${encodeURIComponent(
          savedWorker.name
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Worker Jobs:", data);

          if (Array.isArray(data)) {
            setBookings(data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("worker");
    window.location.reload();
  };

  if (!worker) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] py-20 px-5 text-[#08566E]">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#E1E9E5]/90 backdrop-blur-xl shadow-2xl p-8 rounded-3xl border border-[#6FA8AA]">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-extrabold text-[#08566E]">
                Worker Dashboard
              </h2>

              <p className="text-[#6FA8AA] font-medium mt-2">
                Manage your assigned E-SERVOO jobs
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-[#08566E] text-[#E1E9E5] px-6 py-3 rounded-xl font-bold hover:bg-[#06485C] transition shadow-lg"
            >
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#B4DBDC] p-6 rounded-2xl border border-[#6FA8AA] shadow-md">
              <h3 className="text-lg font-bold text-[#08566E] mb-2">
                Name
              </h3>
              <p className="text-[#08566E] font-medium">
                {worker.name}
              </p>
            </div>

            <div className="bg-[#B4DBDC] p-6 rounded-2xl border border-[#6FA8AA] shadow-md">
              <h3 className="text-lg font-bold text-[#08566E] mb-2">
                Service
              </h3>
              <p className="text-[#08566E] font-medium">
                {worker.service}
              </p>
            </div>

            <div className="bg-[#B4DBDC] p-6 rounded-2xl border border-[#6FA8AA] shadow-md">
              <h3 className="text-lg font-bold text-[#08566E] mb-2">
                Phone
              </h3>
              <p className="text-[#08566E] font-medium">
                {worker.phone}
              </p>
            </div>

            <div className="bg-[#B4DBDC] p-6 rounded-2xl border border-[#6FA8AA] shadow-md">
              <h3 className="text-lg font-bold text-[#08566E] mb-2">
                Status
              </h3>

              <span className="inline-block bg-[#08566E] text-[#E1E9E5] px-4 py-2 rounded-full text-sm font-bold">
                Available
              </span>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-3xl font-extrabold text-[#08566E] mb-6">
              Assigned Jobs
            </h3>

            {bookings.length === 0 ? (
              <div className="bg-[#B4DBDC] border border-[#6FA8AA] rounded-2xl p-6 text-center shadow-md">
                <p className="text-[#08566E] font-bold">
                  No Jobs Assigned
                </p>

                <p className="text-[#6FA8AA] text-sm mt-2">
                  New bookings assigned to you will appear here.
                </p>
              </div>
            ) : (
              bookings.map((job, index) => (
                <div
                  key={index}
                  className="bg-[#B4DBDC] border border-[#6FA8AA] p-6 rounded-2xl mb-4 shadow-md"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-[#08566E]">
                        {job.Service || "Service Job"}
                      </h4>

                      <p className="text-[#6FA8AA] text-sm font-medium">
                        Job #{index + 1}
                      </p>
                    </div>

                    <span className="bg-[#08566E] text-[#E1E9E5] px-4 py-2 rounded-full text-sm font-bold">
                      {job.Status || "Pending"}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-[#08566E]">
                    <p>
                      <span className="font-bold">Customer:</span>{" "}
                      {job.Name}
                    </p>

                    <p>
                      <span className="font-bold">Phone:</span>{" "}
                      {job.Phone}
                    </p>

                    <p className="md:col-span-2">
                      <span className="font-bold">Address:</span>{" "}
                      {job.Address}
                    </p>

                    <p>
                      <span className="font-bold">Service:</span>{" "}
                      {job.Service}
                    </p>

                    <p>
                      <span className="font-bold">Status:</span>{" "}
                      {job.Status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default WorkerDashboard;