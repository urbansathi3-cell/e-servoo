import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { getStoredUser, getStoredWorker } from "./utils/storage";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import AIAssistant from "./components/AIAssistant";
import WorkerOfMonth from "./components/WorkerOfMonth";
import Services from "./components/Services";
import Workers from "./components/Workers";
import BookingForm from "./components/BookingForm";
import CustomerDashboard from "./components/CustomerDashboard";
import MyBookings from "./components/MyBookings";
import WhatsappButton from "./components/WhatsappButton";

import Profile from "./components/Profile";
import Contact from "./components/Contact";
import Terms from "./components/Terms";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import WorkerLogin from "./components/WorkerLogin";
import WorkerDashboard from "./components/WorkerDashboard";

function HomePage({
  seniorMode,
  setSeniorMode,

  selectedService,
  setSelectedService,
  selectedWorker,
  setSelectedWorker,

  language,
  changeLanguage,

  showWelcome,
  setShowWelcome,

  isLoggedIn,
  setIsLoggedIn,

  workerLoggedIn,
  setWorkerLoggedIn,

  showLogin,
  setShowLogin,

  showRegister,
  setShowRegister,
}) {
  if (showWelcome) {
    return <Welcome setShowWelcome={setShowWelcome} />;
  }

  if (!isLoggedIn) {
    return (
      <>
        {showLogin && (
          <Login
            language={language}
            setIsLoggedIn={setIsLoggedIn}
            setShowLogin={setShowLogin}
            setShowRegister={setShowRegister}
          />
        )}

        {showRegister && (
          <Register
            language={language}
            setShowRegister={setShowRegister}
            setShowLogin={setShowLogin}
          />
        )}

        {!workerLoggedIn ? (
          <WorkerLogin
            language={language}
            setWorkerLoggedIn={setWorkerLoggedIn}
          />
        ) : (
          <WorkerDashboard language={language} />
        )}
      </>
    );
  }

  return (
    <>
      <Navbar />

      {selectedWorker ? (
        <BookingForm
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}
        />
      ) : (
        <>
          {/* LANGUAGE SELECTOR */}
          <div className="py-4 text-center">
            <p className="text-[#08566E] text-sm mb-3 font-bold">
              🌐 Choose Language
            </p>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`px-4 py-2 rounded-2xl font-black ${
                  language === "en"
                    ? "bg-[#08566E] text-white"
                    : "bg-[#E1E9E5] text-[#08566E]"
                }`}
              >
                EN
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("hi")}
                className={`px-4 py-2 rounded-2xl font-black ${
                  language === "hi"
                    ? "bg-[#08566E] text-white"
                    : "bg-[#E1E9E5] text-[#08566E]"
                }`}
              >
                HI
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("od")}
                className={`px-4 py-2 rounded-2xl font-black ${
                  language === "od"
                    ? "bg-[#08566E] text-white"
                    : "bg-[#E1E9E5] text-[#08566E]"
                }`}
              >
                OD
              </button>
            </div>
          </div>

          <Hero language={language} />

          <Stats />

          <WorkerOfMonth language={language} />

          <Services
            language={language}
            setSelectedService={setSelectedService}
          />

          <div className="flex justify-end p-3">
            <button
              type="button"
              onClick={() => setSeniorMode(!seniorMode)}
              className="es-secondary-cta px-4 py-2 rounded-2xl font-black"
            >
              👴 {seniorMode ? "Normal Mode" : "Senior Mode"}
            </button>
          </div>

          <WhatsappButton />

          {/* SIMPLE BOTTOM NAV */}
          <div className="fixed bottom-0 left-0 right-0 w-full bg-[#08566E] border-t border-[#06485C] flex justify-around py-3 z-50 text-white font-black">
            <Link to="/">🏠 Home</Link>

            <Link to="/services">🛠 Services</Link>

            <Link to="/profile">👤 Profile</Link>
          </div>
        </>
      )}
    </>
  );
}

function App() {
  const savedUser = getStoredUser();
  const savedWorker = getStoredWorker();

  const [selectedService, setSelectedService] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState(null);

  const [showWelcome, setShowWelcome] = useState(() => {
    return !savedUser && !savedWorker;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(savedUser);
  });

  const [workerLoggedIn, setWorkerLoggedIn] = useState(() => {
    return Boolean(savedWorker);
  });

  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [seniorMode, setSeniorMode] = useState(false);

  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("lang");

    if (savedLang === "en" || savedLang === "hi" || savedLang === "od") {
      return savedLang;
    }

    localStorage.setItem("lang", "en");
    return "en";
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <>
      {/* GLOBAL FLOATING AI */}
      <AIAssistant language={language} />

      {/* MAIN APP WRAPPER */}
      <div
        data-theme="light"
        className={`es-light-lock bg-[#B4DBDC] text-[#08566E] min-h-screen pb-24 overflow-x-hidden ${
          seniorMode ? "senior-mode" : ""
        }`}
        style={{
          colorScheme: "only light",
          backgroundColor: "#B4DBDC",
          color: "#08566E",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                seniorMode={seniorMode}
                setSeniorMode={setSeniorMode}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                selectedWorker={selectedWorker}
                setSelectedWorker={setSelectedWorker}
                language={language}
                changeLanguage={changeLanguage}
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                workerLoggedIn={workerLoggedIn}
                setWorkerLoggedIn={setWorkerLoggedIn}
                showLogin={showLogin}
                setShowLogin={setShowLogin}
                showRegister={showRegister}
                setShowRegister={setShowRegister}
              />
            }
          />

          <Route path="/profile" element={<Profile language={language} />} />

          <Route path="/contact" element={<Contact language={language} />} />

          <Route path="/terms" element={<Terms language={language} />} />

          <Route
            path="/dashboard"
            element={<CustomerDashboard language={language} />}
          />

          <Route path="/bookings" element={<MyBookings language={language} />} />

          <Route
            path="/services"
            element={
              selectedWorker ? (
                <BookingForm
                  selectedWorker={selectedWorker}
                  setSelectedWorker={setSelectedWorker}
                />
              ) : (
                <Workers
                  language={language}
                  setSelectedWorker={setSelectedWorker}
                  selectedService={selectedService}
                />
              )
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;