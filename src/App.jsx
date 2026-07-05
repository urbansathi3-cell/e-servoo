import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { translations } from "./translations";

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
import FooterNav from "./components/FooterNav";

import Profile from "./components/Profile";
import Contact from "./components/Contact";
import Terms from "./components/Terms";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
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
}) {
  const t = translations[language] || translations.en;

  if (showWelcome) {
    return (
      <Welcome
        setShowWelcome={setShowWelcome}
      />
    );
  }

  console.log("showWelcome =", showWelcome);
  console.log("user =", localStorage.getItem("user"));

  if (!isLoggedIn) {
    if (workerLoggedIn) {
      return <WorkerDashboard />;
    }

    return (
      <>
        <Login
          setIsLoggedIn={setIsLoggedIn}
        />

        <WorkerLogin
          setWorkerLoggedIn={setWorkerLoggedIn}
        />
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
          language={language}
        />
      ) : (
        <>
          <div className="py-4 text-center">
            <p className="text-[#08566E] text-sm mb-3 font-bold">
              🌐 {t.chooseLanguage}
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => changeLanguage("en")}
                className={`px-4 py-2 rounded-lg font-bold ${
                  language === "en"
                    ? "bg-[#08566E] text-white"
                    : "bg-[#E1E9E5] text-[#08566E]"
                }`}
              >
                EN
              </button>

              <button
                onClick={() => changeLanguage("hi")}
                className={`px-4 py-2 rounded-lg font-bold ${
                  language === "hi"
                    ? "bg-[#08566E] text-white"
                    : "bg-[#E1E9E5] text-[#08566E]"
                }`}
              >
                HI
              </button>

              <button
                onClick={() => changeLanguage("od")}
                className={`px-4 py-2 rounded-lg font-bold ${
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

          <WorkerOfMonth />

          <Services
            setSelectedService={setSelectedService}
            language={language}
          />

          <div className="flex justify-end p-3">
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className="bg-[#08566E] text-white px-4 py-2 rounded font-bold"
            >
              👴 Senior Mode
            </button>
          </div>

          <WhatsappButton />
        </>
      )}
    </>
  );
}

function App() {
  const [selectedService, setSelectedService] = useState("All");

  const [selectedWorker, setSelectedWorker] = useState(null);

  const [showWelcome, setShowWelcome] = useState(
    !localStorage.getItem("user")
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user")
  );

  const [workerLoggedIn, setWorkerLoggedIn] = useState(
    !!localStorage.getItem("worker")
  );

  const [seniorMode, setSeniorMode] = useState(false);

  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en"
  );

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <>
      {/* GLOBAL FLOATING AI */}
      <AIAssistant />

      {/* MAIN APP WRAPPER */}
      <div
        className={`bg-[#B4DBDC] min-h-screen pb-28 overflow-x-hidden ${
          seniorMode ? "text-xl" : "text-base"
        }`}
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
              />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile
                language={language}
              />
            }
          />

          <Route
            path="/contact"
            element={
              <Contact
                language={language}
              />
            }
          />

          <Route
            path="/terms"
            element={
              <Terms
                language={language}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <CustomerDashboard
                language={language}
              />
            }
          />

          <Route
            path="/bookings"
            element={
              <MyBookings
                language={language}
              />
            }
          />

          <Route
            path="/services"
            element={
              selectedWorker ? (
                <BookingForm
                  selectedWorker={selectedWorker}
                  setSelectedWorker={setSelectedWorker}
                  language={language}
                />
              ) : (
                <Workers
                  setSelectedWorker={setSelectedWorker}
                  selectedService="All"
                  language={language}
                />
              )
            }
          />
        </Routes>

        {/* LIQUID FOOTER NAV */}
        {isLoggedIn && <FooterNav />}
      </div>
    </>
  );
}

export default App;