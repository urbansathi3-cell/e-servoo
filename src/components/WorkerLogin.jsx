import { useState } from "react";
import AnimatedAuthButton from "./AnimatedAuthButton";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function WorkerLogin({
  setWorkerLoggedIn,
  language = "en",
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const getWorkerLoginText = () => {
    if (language === "hi") return "Worker Login";
    if (language === "od") return "Worker Login";
    return "Login as Worker";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      alert("Please enter worker email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${SCRIPT_URL}?workerEmail=${encodeURIComponent(
          cleanEmail
        )}&workerPassword=${encodeURIComponent(cleanPassword)}`
      );

      const data = await res.json();

      console.log("Worker Login Response:", data);

      if (data.success) {
        localStorage.setItem("worker", JSON.stringify(data.worker));
        setWorkerLoggedIn(true);
      } else {
        alert(data.message || "Invalid Worker Login");
      }
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen flex justify-center items-center px-5 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0]">
      <div className="w-full max-w-md bg-[#E1E9E5]/90 backdrop-blur-xl shadow-2xl p-8 rounded-3xl border border-[#6FA8AA]">

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#08566E] flex items-center justify-center text-[#E1E9E5] text-3xl shadow-lg">
            👷
          </div>

          <h2 className="text-4xl font-extrabold text-[#08566E]">
            Worker Login
          </h2>

          <p className="text-[#6FA8AA] mt-2 font-medium">
            Login to manage your E-SERVOO jobs
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-[#08566E] font-bold mb-2">
              Worker Email
            </label>

            <input
              type="email"
              placeholder="Enter worker email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-white border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-400 outline-none focus:border-[#08566E] focus:ring-2 focus:ring-[#9ECFD0] transition"
              required
            />
          </div>

          <div>
            <label className="block text-[#08566E] font-bold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-white border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-400 outline-none focus:border-[#08566E] focus:ring-2 focus:ring-[#9ECFD0] transition"
              required
            />
          </div>

          <AnimatedAuthButton
            text={getWorkerLoginText()}
            loading={loading}
            type="submit"
          />
        </form>

        <p className="text-center text-[#08566E] text-sm mt-6">
          Verified workers can access dashboard, bookings and job status.
        </p>
      </div>
    </section>
  );
}

export default WorkerLogin;