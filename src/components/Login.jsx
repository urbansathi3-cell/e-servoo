import { useState } from "react";
import { saveJsonToStorage } from "../utils/storage";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function Login({
  setIsLoggedIn,
  setShowLogin,
  setShowRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "customer_login",
      ...extraData,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}?email=${encodeURIComponent(cleanEmail)}&password=${encodeURIComponent(cleanPassword)}&nocache=${Date.now()}`
      );

      const data = await res.json();

      if (!data.success) {
        setLoading(false);
        alert(data.message || "Invalid Email or Password");
        return;
      }

      const userData = data.user || data.customer || null;

      if (!userData || typeof userData !== "object") {
        setLoading(false);
        alert("Login response is invalid. User data not found.");
        return;
      }

      saveJsonToStorage("user", userData);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      pushEvent("customer_login_success", {
        user_type: "customer",
      });

      setLoading(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Login Failed. Please try again.");
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#E1E9E5] via-[#B4DBDC] to-[#A4D1D2] min-h-screen flex justify-center items-center px-5">
      <div className="bg-[#E1E9E5]/90 shadow-2xl p-8 rounded-3xl w-full max-w-md border border-white/80">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#08566E] text-[#E1E9E5] rounded-3xl flex items-center justify-center mx-auto text-4xl font-black shadow-xl">
            E
          </div>

          <h2 className="text-4xl font-black text-[#08566E] mt-5">
            Customer Login
          </h2>

          <p className="text-[#06485C] font-semibold mt-2">
            Login to book trusted local workers.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-[#08566E] font-black text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] border border-[#6FA8AA] text-[#08566E] placeholder:text-[#6FA8AA] outline-none focus:border-[#08566E] font-semibold"
              required
            />
          </div>

          <div>
            <label className="text-[#08566E] font-black text-sm">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] border border-[#6FA8AA] text-[#08566E] placeholder:text-[#6FA8AA] outline-none focus:border-[#08566E] font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`es-primary-cta py-4 rounded-2xl font-black transition ${
              loading
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-[#08566E] text-[#E1E9E5] hover:bg-[#06485C]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[#06485C] font-semibold">
            Don&apos;t have an account?
          </p>

          <button
            type="button"
            onClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
            className="es-text-btn text-[#08566E] mt-2 font-black hover:underline"
          >
            Create Account
          </button>
        </div>
      </div>
    </section>
  );
}

export default Login;