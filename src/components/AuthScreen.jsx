import { useState } from "react";
import WorkerLogin from "./WorkerLogin";
import { saveJsonToStorage } from "../utils/storage";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function AuthScreen({
  setIsLoggedIn,
  setWorkerLoggedIn,
}) {
  const [registerMode, setRegisterMode] = useState(false);
  const [workerMode, setWorkerMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
  });

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = loginData.email.trim().toLowerCase();
    const password = loginData.password.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "login",
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      const user = data.user || data.customer;

      if (!user || typeof user !== "object") {
        alert("User information was not received.");
        return;
      }

      saveJsonToStorage("user", user);

      if (data.token) {
        localStorage.setItem("token", data.token);
      } else {
        localStorage.removeItem("token");
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "customer_login_success",
        page_section: "auth_screen",
        user_type: "customer",
      });

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const cleanedData = {
      name: registerData.name.trim(),
      phone: registerData.phone.replace(/\D/g, ""),
      email: registerData.email.trim().toLowerCase(),
      password: registerData.password.trim(),
      address: registerData.address.trim(),
    };

    if (
      !cleanedData.name ||
      !cleanedData.phone ||
      !cleanedData.email ||
      !cleanedData.password ||
      !cleanedData.address
    ) {
      alert("Please fill all the details.");
      return;
    }

    if (cleanedData.phone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (cleanedData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "register",
          ...cleanedData,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Registration failed.");
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "customer_register_success",
        page_section: "auth_screen",
        user_type: "customer",
      });

      alert("Account created successfully.");

      setLoginData({
        email: cleanedData.email,
        password: "",
      });

      setRegisterData({
        name: "",
        phone: "",
        email: "",
        password: "",
        address: "",
      });

      setRegisterMode(false);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (workerMode) {
    return (
      <div className="relative min-h-screen">
        <button
          type="button"
          onClick={() => setWorkerMode(false)}
          className="fixed top-5 left-5 z-[100] bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] px-5 py-3 rounded-2xl font-black shadow-xl"
        >
          ← Customer Login
        </button>

        <WorkerLogin setWorkerLoggedIn={setWorkerLoggedIn} />
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#6FA8AA]">
      <div className="relative w-full max-w-[980px] min-h-[690px] overflow-hidden rounded-[34px] bg-[#063F52] border border-white/50 shadow-[0_35px_90px_rgba(8,86,110,0.40)]">
        <div className="absolute -top-28 -left-28 w-72 h-72 rounded-full bg-[#9ECFD0]/20 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 w-80 h-80 rounded-full bg-[#6FA8AA]/25 blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

        {/* LOGIN FORM */}
        <div
          className={`absolute top-0 left-0 w-full md:w-1/2 h-full flex items-center justify-center px-7 sm:px-12 transition-all duration-700 ${
            registerMode
              ? "-translate-x-full opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100"
          }`}
        >
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm relative z-20"
          >
            <div className="md:hidden text-center mb-7">
              <img
                src="/logo.png"
                alt="E-SERVOO"
                className="w-20 h-20 object-contain mx-auto"
              />
            </div>

            <p className="text-[#9ECFD0] font-black uppercase tracking-[0.25em] text-xs">
              Welcome Back
            </p>

            <h1 className="text-[#E1E9E5] text-4xl font-black mt-2">
              Customer Login
            </h1>

            <p className="text-[#B4DBDC] font-semibold mt-2 mb-7">
              Login to book trusted services near you.
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={loginData.email}
                onChange={(event) =>
                  setLoginData({
                    ...loginData,
                    email: event.target.value,
                  })
                }
                className="w-full h-14 px-5 rounded-2xl bg-[#F8FCFA] text-[#043A4A] placeholder:text-[#3F7F8B] font-bold outline-none border border-[#B4DBDC] focus:border-[#9ECFD0]"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(event) =>
                  setLoginData({
                    ...loginData,
                    password: event.target.value,
                  })
                }
                className="w-full h-14 px-5 rounded-2xl bg-[#F8FCFA] text-[#043A4A] placeholder:text-[#3F7F8B] font-bold outline-none border border-[#B4DBDC] focus:border-[#9ECFD0]"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="es-primary-cta w-full h-14 rounded-2xl font-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="mt-6 text-center md:hidden">
              <button
                type="button"
                onClick={() => setRegisterMode(true)}
                className="text-[#E1E9E5] font-black underline"
              >
                Create a new account
              </button>
            </div>

            <button
              type="button"
              onClick={() => setWorkerMode(true)}
              className="w-full mt-5 text-[#9ECFD0] font-black text-sm hover:text-[#E1E9E5]"
            >
              👷 Login as Worker
            </button>
          </form>
        </div>

        {/* REGISTER FORM */}
        <div
          className={`absolute top-0 right-0 w-full md:w-1/2 h-full flex items-center justify-center px-7 sm:px-12 transition-all duration-700 ${
            registerMode
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <form
            onSubmit={handleRegister}
            className="w-full max-w-sm relative z-20 py-8"
          >
            <div className="md:hidden text-center mb-5">
              <img
                src="/logo.png"
                alt="E-SERVOO"
                className="w-16 h-16 object-contain mx-auto"
              />
            </div>

            <p className="text-[#9ECFD0] font-black uppercase tracking-[0.25em] text-xs">
              Join E-SERVOO
            </p>

            <h1 className="text-[#E1E9E5] text-4xl font-black mt-2">
              Create Account
            </h1>

            <p className="text-[#B4DBDC] font-semibold mt-2 mb-5">
              Book trusted local services in a few steps.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full name"
                value={registerData.name}
                onChange={(event) =>
                  setRegisterData({
                    ...registerData,
                    name: event.target.value,
                  })
                }
                className="w-full h-12 px-5 rounded-2xl bg-[#F8FCFA] text-[#043A4A] placeholder:text-[#3F7F8B] font-bold outline-none border border-[#B4DBDC] focus:border-[#9ECFD0]"
                required
              />

              <input
                type="tel"
                placeholder="Phone number"
                value={registerData.phone}
                onChange={(event) =>
                  setRegisterData({
                    ...registerData,
                    phone: event.target.value,
                  })
                }
                className="w-full h-12 px-5 rounded-2xl bg-[#F8FCFA] text-[#043A4A] placeholder:text-[#3F7F8B] font-bold outline-none border border-[#B4DBDC] focus:border-[#9ECFD0]"
                required
              />

              <input
                type="email"
                placeholder="Email address"
                value={registerData.email}
                onChange={(event) =>
                  setRegisterData({
                    ...registerData,
                    email: event.target.value,
                  })
                }
                className="w-full h-12 px-5 rounded-2xl bg-[#F8FCFA] text-[#043A4A] placeholder:text-[#3F7F8B] font-bold outline-none border border-[#B4DBDC] focus:border-[#9ECFD0]"
                required
              />

              <input
                type="password"
                placeholder="Create password"
                value={registerData.password}
                onChange={(event) =>
                  setRegisterData({
                    ...registerData,
                    password: event.target.value,
                  })
                }
                className="w-full h-12 px-5 rounded-2xl bg-[#F8FCFA] text-[#043A4A] placeholder:text-[#3F7F8B] font-bold outline-none border border-[#B4DBDC] focus:border-[#9ECFD0]"
                required
              />

              <textarea
                placeholder="Full address"
                value={registerData.address}
                onChange={(event) =>
                  setRegisterData({
                    ...registerData,
                    address: event.target.value,
                  })
                }
                rows={2}
                className="w-full px-5 py-3 rounded-2xl resize-none bg-[#F8FCFA] text-[#043A4A] placeholder:text-[#3F7F8B] font-bold outline-none border border-[#B4DBDC] focus:border-[#9ECFD0]"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="es-primary-cta w-full py-3.5 rounded-2xl font-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className="mt-4 text-center md:hidden">
              <button
                type="button"
                onClick={() => setRegisterMode(false)}
                className="text-[#E1E9E5] font-black underline"
              >
                Already have an account?
              </button>
            </div>
          </form>
        </div>

        {/* DIAGONAL SLIDING PANEL */}
        <div
          className="hidden md:block absolute top-0 h-full w-[56%] z-30 transition-all duration-700 ease-in-out"
          style={{
            left: registerMode ? "0%" : "44%",
            clipPath: registerMode
              ? "polygon(0 0, 100% 0, 76% 100%, 0 100%)"
              : "polygon(24% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#9ECFD0] via-[#6FA8AA] to-[#08566E]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_34%)]" />

          <div className="relative h-full flex flex-col items-center justify-center text-center px-16">
            <img
              src="/logo.png"
              alt="E-SERVOO logo"
              className="w-28 h-28 object-contain drop-shadow-2xl mb-5"
            />

            <h2 className="text-[#E1E9E5] text-4xl font-black">
              {registerMode ? "Welcome Back!" : "Welcome to E-SERVOO"}
            </h2>

            <p className="text-[#E1E9E5] font-semibold mt-4 max-w-sm">
              {registerMode
                ? "Already registered? Login to continue booking trusted local services."
                : "Find verified electricians, plumbers, cleaners, cooks and more near you."}
            </p>

            <button
              type="button"
              onClick={() => setRegisterMode(!registerMode)}
              className="mt-8 bg-[#E1E9E5] text-[#08566E] border border-white px-8 py-3 rounded-full font-black shadow-xl hover:scale-105 transition"
            >
              {registerMode ? "Login" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthScreen;