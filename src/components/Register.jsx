import { useState } from "react";

function Register({
  setShowRegister,
  setShowLogin
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const [leaving, setLeaving] = useState(false);

  const goToLogin = () => {
    setLeaving(true);

    setTimeout(() => {
      setShowRegister(false);
      setShowLogin(true);
    }, 350);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
        {
          method: "POST",
          body: JSON.stringify({
            action: "register",
            name,
            phone,
            email,
            password,
            address,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Account Created Successfully");
        goToLogin();
      } else {
        alert(data.message || "Registration Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] overflow-hidden">

      <div
        className={`relative w-full max-w-6xl min-h-[620px] rounded-[32px] overflow-hidden shadow-2xl border border-[#6FA8AA]/70 bg-[#08566E] ${
          leaving ? "auth-card-exit-right" : "auth-card-enter"
        }`}
      >

        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#6FA8AA]/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-[#B4DBDC]/50 rounded-full blur-3xl"></div>

        <div className="relative grid md:grid-cols-2 min-h-[620px]">

          <div className="relative hidden md:flex flex-col justify-center items-center text-center px-12 bg-gradient-to-br from-[#9ECFD0] via-[#B4DBDC] to-[#6FA8AA]">

            <div
              className="absolute inset-0 bg-[#E1E9E5]/25"
              style={{
                clipPath: "polygon(0 0, 82% 0, 100% 100%, 0 100%)",
              }}
            ></div>

            <div className="relative z-10 max-w-sm">
              <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-[#08566E] flex items-center justify-center shadow-2xl border-4 border-[#E1E9E5]">
                <span className="text-[#E1E9E5] text-4xl font-extrabold">
                  ES
                </span>
              </div>

              <h1 className="text-4xl font-extrabold text-[#08566E] mb-4">
                Join E-SERVOO
              </h1>

              <p className="text-[#08566E] font-semibold leading-relaxed mb-8">
                Create your account and book verified local service professionals for your home needs.
              </p>

              <div className="flex flex-col gap-3">
                <div className="bg-[#08566E] text-[#E1E9E5] px-6 py-3 rounded-full shadow-lg font-bold">
                  Fast Booking
                </div>

                <div className="bg-[#E1E9E5] text-[#08566E] px-6 py-3 rounded-full shadow-lg font-bold">
                  Trusted Workers
                </div>

                <div className="bg-[#08566E] text-[#E1E9E5] px-6 py-3 rounded-full shadow-lg font-bold">
                  Smart Local Services
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 bg-[#08566E]">

            <div className="mb-7">
              <p className="text-[#9ECFD0] font-semibold tracking-widest text-sm uppercase">
                Customer Registration
              </p>

              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#E1E9E5] mt-2">
                Create Account
              </h2>

              <p className="text-[#B4DBDC] mt-3">
                Start booking trusted services with E-SERVOO
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-[#B4DBDC] text-sm font-semibold mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#E1E9E5] border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-[#6FA8AA]/60 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[#B4DBDC] text-sm font-semibold mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#E1E9E5] border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-[#6FA8AA]/60 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[#B4DBDC] text-sm font-semibold mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#E1E9E5] border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-[#6FA8AA]/60 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[#B4DBDC] text-sm font-semibold mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#E1E9E5] border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-[#6FA8AA]/60 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[#B4DBDC] text-sm font-semibold mb-2">
                  Full Address
                </label>

                <input
                  type="text"
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#E1E9E5] border border-[#9ECFD0] text-[#08566E] placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-[#6FA8AA]/60 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-[#9ECFD0] to-[#6FA8AA] text-[#08566E] font-extrabold shadow-lg hover:scale-[1.02] hover:shadow-xl transition"
              >
                Create Account
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-[#B4DBDC]">
                Already have an account?
              </p>

              <button
                type="button"
                onClick={goToLogin}
                className="mt-2 text-[#E1E9E5] font-bold hover:text-[#9ECFD0] hover:underline transition"
              >
                Login
              </button>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default Register;