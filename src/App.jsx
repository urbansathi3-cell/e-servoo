import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { translations } from "./translations";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import WorkerOfMonth from "./components/WorkerOfMonth";
import TopWorkers from "./components/TopWorkers";
import Services from "./components/Services";
import Workers from "./components/Workers";
import SmartRecommendation from "./components/SmartRecommendation";
import AICostEstimator from "./components/AICostEstimator";
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
return ( <Welcome  
setShowWelcome={setShowWelcome}  
/>
);
}
console.log("showWelcome =", showWelcome);
console.log("user =", localStorage.getItem("user"));

if (!isLoggedIn) {
return (
<>
{showLogin && ( <Login  
setIsLoggedIn={setIsLoggedIn}  
setShowLogin={setShowLogin}  
setShowRegister={setShowRegister}  
/>
)}

{showRegister && (  
  <Register  
    setShowRegister={setShowRegister}  
    setShowLogin={setShowLogin}  
  />  
)}  

{!workerLoggedIn ? (  
  <WorkerLogin  
    setWorkerLoggedIn={setWorkerLoggedIn}  
  />  
) : (  
  <WorkerDashboard />  
)}

</>
);

}

return (

<> <Navbar />

{selectedWorker ? (
<BookingForm  
selectedWorker={selectedWorker}  
setSelectedWorker={setSelectedWorker}  
/>
) : (
<>

  <div className="py-4 text-center">

    <p className="text-gray-300 text-sm mb-3">
      🌐 Choose Language
    </p>

    <div className="flex justify-center gap-3">

      <button
        onClick={() => changeLanguage("en")}
        className={`px-4 py-2 rounded-lg ${
          language === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        EN
      </button>

      <button
        onClick={() => changeLanguage("hi")}
        className={`px-4 py-2 rounded-lg ${
          language === "hi"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        HI
      </button>

      <button
        onClick={() => changeLanguage("od")}
        className={`px-4 py-2 rounded-lg ${
          language === "od"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        OD
      </button>

    </div>

  </div>

  <Hero language={language} />
  <WorkerOfMonth />

<Stats />

<Services
setSelectedService={setSelectedService}
/>

<div className="flex justify-end p-3">
  <button
    onClick={() => setSeniorMode(!seniorMode)}
    className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
  >
    👴 Senior Mode
  </button>
</div>

<SmartRecommendation  
setSelectedService={setSelectedService}  
/>

<AICostEstimator />  

<WhatsappButton />  

  <div className="fixed bottom-0 left-0 right-0 w-full bg-slate-900 border-t border-slate-700 flex justify-around py-3 z-50 text-white">

  <a href="/">🏠 Home</a>

  <a href="/services">
    🛠 Services
  </a>

  <a href="/profile">
    👤 Profile
  </a>

</div>
</>

)}
</>

);
}

function App() {

const [selectedService, setSelectedService] =
useState("All");

const [selectedWorker, setSelectedWorker] =
useState(null);

const [showWelcome, setShowWelcome] =
useState(!localStorage.getItem("user"));

const [isLoggedIn, setIsLoggedIn] =
useState(!!localStorage.getItem("user"));

const [workerLoggedIn, setWorkerLoggedIn] =
useState(!!localStorage.getItem("worker"));

const [showLogin, setShowLogin] =
useState(true);

const [showRegister, setShowRegister] =
useState(false);

const [seniorMode, setSeniorMode] =
useState(false);


const [language, setLanguage] = useState(
localStorage.getItem("lang") || "en"
);

const t = translations[language];

const changeLanguage = (lang) => {
setLanguage(lang);
localStorage.setItem("lang", lang);
};

return (
  <div
    className={`bg-black min-h-screen pb-20 overflow-x-hidden ${
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
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            showRegister={showRegister}
            setShowRegister={setShowRegister}
          />
        }
      />

      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="/bookings" element={<MyBookings />} />
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
        setSelectedWorker={setSelectedWorker}
        selectedService="All"
      />
    )
  }
/>
    </Routes>
  </div>
);
}

export default App;