import { useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function Register({
  setShowRegister,
  setShowLogin,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const pushEvent = (eventName, extraData = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      page_section: "customer_register",
      ...extraData,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanAddress = address.trim();

    if (!cleanName) {
      alert("Please enter your full name.");
      return;
    }

    if (cleanPhone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (!cleanEmail) {
      alert("Please enter your email.");
      return;
    }

    if (cleanPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (!cleanAddress) {
      alert("Please enter your full address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "register",
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          password: cleanPassword,
          address: cleanAddress,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        alert(data.message || "Registration Failed");
        return;
      }

      pushEvent("customer_register_success", {
        user_type: "customer",
      });

      alert("Account Created Successfully");

      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setAddress("");

      setLoading(false);
      setShowRegister(false);
      setShowLogin(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Registration Failed. Please try again.");
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#E1E9E5] via-[#B4DBDC] to-[#A4D1D2] min-h-screen flex justify-center items-center px-5 py-10">
      <div className="bg-[#E1E9E5]/90 shadow-2xl p-8 rounded-3xl w-full max-w-md border border-white/80">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#08566E] text-[#E1E9E5] rounded-3xl flex items-center justify-center mx-auto text-4xl font-black shadow-xl">
            E
          </div>

          <h2 className="text-4xl font-black text-[#08566E] mt-5">
            Create Account
          </h2>

          <p className="text-[#06485C] font-semibold mt-2">
            Register to book trusted local services.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-[#08566E] font-black text-sm">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] border border-[#6FA8AA] text-[#08566E] placeholder:text-[#6FA8AA] outline-none focus:border-[#08566E] font-semibold"
              required
            />
          </div>

          <div>
            <label className="text-[#08566E] font-black text-sm">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] border border-[#6FA8AA] text-[#08566E] placeholder:text-[#6FA8AA] outline-none focus:border-[#08566E] font-semibold"
              required
            />
          </div>

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
              Create Password
            </label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] border border-[#6FA8AA] text-[#08566E] placeholder:text-[#6FA8AA] outline-none focus:border-[#08566E] font-semibold"
              required
            />
          </div>

          <div>
            <label className="text-[#08566E] font-black text-sm">
              Full Address
            </label>

            <textarea
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 mt-2 rounded-2xl bg-[#E1E9E5] border border-[#6FA8AA] text-[#08566E] placeholder:text-[#6FA8AA] outline-none focus:border-[#08566E] font-semibold"
              rows={3}
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[#06485C] font-semibold">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
            className="es-text-btn text-[#08566E] mt-2 font-black hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
}

export default Register;