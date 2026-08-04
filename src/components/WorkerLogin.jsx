import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveJsonToStorage } from "../utils/storage";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function WorkerLogin({ setWorkerLoggedIn }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "worker_login",
      ...extraData,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      alert("Please enter worker email and password.");
      return;
    }

    setLoading(true);

    try {
      const loginUrl = `${API_URL}?workerEmail=${encodeURIComponent(
        cleanEmail
      )}&workerPassword=${encodeURIComponent(
        cleanPassword
      )}&nocache=${Date.now()}`;

      const response = await fetch(loginUrl);
      const data = await response.json();

      console.log("Worker login response:", data);

      if (!data.success) {
        alert(data.message || "Invalid Worker Login");
        setLoading(false);
        return;
      }

      const workerData = data.worker;

      if (!workerData || typeof workerData !== "object") {
        alert("Worker login response is invalid. Worker data not found.");
        setLoading(false);
        return;
      }

      saveJsonToStorage("worker", workerData);

      if (data.token) {
        localStorage.setItem("workerToken", data.token);
      } else {
        localStorage.setItem(
          "workerToken",
          `worker-${Date.now()}-${Math.random().toString(36).slice(2)}`
        );
      }

      pushEvent("worker_login_success", {
        user_type: "worker",
        worker_email: workerData.email || cleanEmail,
        worker_id: workerData.id || "",
      });

      if (typeof setWorkerLoggedIn === "function") {
        setWorkerLoggedIn(true);
      }

      setLoading(false);

      navigate("/worker-dashboard", {
        replace: true,
      });

      setTimeout(() => {
        if (window.location.pathname !== "/worker-dashboard") {
          window.location.href = "/worker-dashboard";
        }
      }, 300);
    } catch (error) {
      console.error("Worker login error:", error);
      alert("Worker login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center px-5 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0]">
      <div className="w-full max-w-md bg-[#E1E9E5]/90 backdrop-blur-xl shadow-2xl p-8 rounded-3xl border border-white/80">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-[#08566E] flex items-center justify-center text-[#E1E9E5] text-4xl shadow-xl">
            👷
          </div>

          <h2 className="text-4xl font-black text-[#08566E]">
            Worker Login
          </h2>

          <p className="text-[#06485C] mt-2 font-semibold">
            Login to manage your E-SERVOO jobs.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-[#08566E] font-black mb-2">
              Worker Email
            </label>

            <input
              type="email"
              placeholder="Enter worker email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full p-4 rounded-2xl bg-[#E1E9E5] border border-[#6FA8AA] text-[#08566E] placeholder:text-[#6FA8AA] outline-none focus:border-[#08566E] font-semibold transition"
              required
            />
          </div>

          <div>
            <label className="block text-[#08566E] font-black mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full p-4 rounded-2xl bg-[#E1E9E5] border border-[#6FA8AA] text-[#08566E] placeholder:text-[#6FA8AA] outline-none focus:border-[#08566E] font-semibold transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`es-primary-cta py-4 rounded-2xl font-black text-lg transition shadow-lg ${
              loading
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-[#08566E] text-[#E1E9E5] hover:bg-[#06485C]"
            }`}
          >
            {loading ? "Logging in..." : "Login as Worker"}
          </button>
        </form>

        <p className="text-center text-[#06485C] font-semibold text-sm mt-6">
          Verified workers can access dashboard, bookings and job status.
        </p>
      </div>
    </section>
  );
}

export default WorkerLogin;