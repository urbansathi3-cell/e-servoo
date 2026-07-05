import { useState } from "react";

function Login({
  setIsLoggedIn,
  setShowLogin,
  setShowRegister
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [leaving, setLeaving] = useState(false);

  const goToRegister = () => {
    setLeaving(true);

    setTimeout(() => {
      setShowLogin(false);
      setShowRegister(true);
    }, 350);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?email=${email}&password=${password}`
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setIsLoggedIn(true);
      } else {
        alert("Invalid Email or Password");
      }
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] overflow-hidden">

      <div
        className={`relative w-full max-w-5xl min-h-[560px] rounded-[32px] overflow-hidden shadow-2xl border border-[#6FA8AA]/70 bg-[#08566E] ${
          leaving ? "auth-card-exit-left" : "auth-card-enter"
        }`}
      >

        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#6FA8AA]/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-[#B4DBDC]/50 rounded-full blur-3xl"></div>

        <div className="relative grid md:grid-cols-2 min-h-[560px]">

          <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 bg-[#08566E]">

            <div className="mb-8">
              <p className="text-[#9ECFD0] font-semibold tracking-widest text-sm uppercase">
                Customer Portal
              </p>

              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#E1E9E5] mt-2">
                Login
              </h2>

              <p className="text-[#B4DBDC] mt-3">
                Welcome back to E-SERVOO
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-5"
            >
              <div>
                <label className="block text-[#B4DBDC] text-sm font-semibold mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#E1E9E5] border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-[#6FA8AA]/60 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[#B4DBDC] text-sm font-semibold mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#E1E9E5] border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-[#6FA8AA]/60 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-[#9ECFD0] to-[#6FA8AA] text-[#08566E] font-extrabold shadow-lg hover:scale-[1.02] hover:shadow-xl transition"
              >
                Login
              </button>
            </form>

            <div className="text-center mt-7">
              <p className="text-[#B4DBDC]">
                Don't have an account?
              </p>

              <button
                type="button"
                onClick={goToRegister}
                className="mt-2 text-[#E1E9E5] font-bold hover:text-[#9ECFD0] hover:underline transition"
              >
                Create Account
              </button>
            </div>

          </div>

          <div className="relative hidden md:flex flex-col justify-center items-center text-center px-12 bg-gradient-to-br from-[#9ECFD0] via-[#B4DBDC] to-[#6FA8AA]">

            <div
              className="absolute inset-0 bg-[#E1E9E5]/25"
              style={{
                clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)"
              }}
            ></div>

            <div className="relative z-10 max-w-sm">
              <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-[#08566E] flex items-center justify-center shadow-2xl border-4 border-[#E1E9E5]">
                <span className="text-[#E1E9E5] text-4xl font-extrabold">
                  ES
                </span>
              </div>

              <h1 className="text-4xl font-extrabold text-[#08566E] mb-4">
                Welcome Back!
              </h1>

              <p className="text-[#08566E] font-semibold leading-relaxed mb-8">
                Book trusted electricians, plumbers, cleaners, cooks and local service experts through E-SERVOO.
              </p>

              <div className="flex flex-col gap-3">
                <div className="bg-[#08566E] text-[#E1E9E5] px-6 py-3 rounded-full shadow-lg font-bold">
                  Verified Professionals
                </div>

                <div className="bg-[#E1E9E5] text-[#08566E] px-6 py-3 rounded-full shadow-lg font-bold">
                  Smart Local Services
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default Login;