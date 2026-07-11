import { useEffect, useState } from "react";
import AnimatedAuthButton from "./AnimatedAuthButton";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function Login({
  setIsLoggedIn,
  initialMode = "login",
  language = "en",
}) {
  const [active, setActive] = useState(initialMode === "register");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [address, setAddress] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    setActive(initialMode === "register");
  }, [initialMode]);

  const getLoginText = () => {
    if (language === "hi") return "Login करें";
    if (language === "od") return "Login କରନ୍ତୁ";
    return "Sign in";
  };

  const getRegisterText = () => {
    if (language === "hi") return "Register करें";
    if (language === "od") return "Register କରନ୍ତୁ";
    return "Register";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanEmail || !cleanPassword) {
      alert("Please enter email and password");
      return;
    }

    setLoginLoading(true);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "login",
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoggedIn(true);
      } else {
        alert(data.message || "Invalid Email or Password");
      }
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }

    setLoginLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "register",
          name: name.trim(),
          phone: phone.trim(),
          email: registerEmail.trim().toLowerCase(),
          password: registerPassword,
          address: address.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Account Created Successfully");

        setName("");
        setPhone("");
        setRegisterEmail("");
        setRegisterPassword("");
        setAddress("");

        setActive(false);
      } else {
        alert(data.message || "Registration Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }

    setRegisterLoading(false);
  };

  return (
    <section className="es-auth-page">
      <div className={`es-auth-container ${active ? "active" : ""}`}>

        {/* REGISTER FORM */}
        <div className="es-form-box es-register">
          <form onSubmit={handleRegister} className="es-auth-form">
            <h1>Create Account</h1>

            <p className="es-auth-subtitle">
              Join E-SERVOO and book trusted local services.
            </p>

            <div className="es-input-box">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="es-input-box">
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="es-input-box">
              <input
                type="email"
                placeholder="Email Address"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>

            <div className="es-input-box">
              <input
                type="password"
                placeholder="Create Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>

            <div className="es-input-box">
              <input
                type="text"
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <AnimatedAuthButton
              text={getRegisterText()}
              loading={registerLoading}
              type="submit"
            />

            <p className="es-auth-link-text">
              Already have an account?
              <button
                type="button"
                onClick={() => setActive(false)}
                className="es-no-liquid"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* LOGIN FORM */}
        <div className="es-form-box es-login">
          <form onSubmit={handleLogin} className="es-auth-form">
            <h1>Login</h1>

            <p className="es-auth-subtitle">
              Welcome back to E-SERVOO.
            </p>

            <div className="es-input-box">
              <input
                type="email"
                placeholder="Email Address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="es-input-box">
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <AnimatedAuthButton
              text={getLoginText()}
              loading={loginLoading}
              type="submit"
            />

            <p className="es-auth-link-text">
              Don't have an account?
              <button
                type="button"
                onClick={() => setActive(true)}
                className="es-no-liquid"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>

        {/* SLIDING TOGGLE PANEL */}
        <div className="es-toggle-container">
          <div className="es-toggle">

            <div className="es-toggle-panel es-toggle-left">
              <h1>Welcome!</h1>

              <p>
                Create your E-SERVOO account and access smart local services
                with verified professionals near you.
              </p>

              <div className="es-toggle-badge">
                Smart Local Services
              </div>
            </div>

            <div className="es-toggle-panel es-toggle-right">
              <h1>Welcome Back!</h1>

              <p>
                Login again and continue booking verified electricians,
                plumbers, cleaners, cooks and trusted local workers.
              </p>

              <div className="es-toggle-badge">
                Trusted Home Services
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Login;