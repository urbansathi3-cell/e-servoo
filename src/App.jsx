import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
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
selectedService,
setSelectedService,
selectedWorker,
setSelectedWorker,

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
      <Hero />

      <Services
        setSelectedService={setSelectedService}
      />

      <Workers
        setSelectedWorker={setSelectedWorker}
        selectedService={selectedService}
      />

      <WhatsappButton />

      <div className="fixed bottom-0 left-0 right-0 w-full bg-slate-900 border-t border-slate-700 flex justify-around py-3 z-50 text-white">
        <a href="/">🏠 Home</a>
        <a href="#services">🛠 Services</a>
        <a href="#workers">👷 Workers</a>
        <a href="/profile">👤 Profile</a>
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
useState(true);

const [isLoggedIn, setIsLoggedIn] =
useState(!!localStorage.getItem("user"));

const [workerLoggedIn, setWorkerLoggedIn] =
useState(!!localStorage.getItem("worker"));

const [showLogin, setShowLogin] =
useState(true);

const [showRegister, setShowRegister] =
useState(false);

return ( <div className="bg-black min-h-screen pb-20 overflow-x-hidden">


  <Routes>

    <Route
      path="/"
      element={
        <HomePage
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}

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

    <Route
      path="/profile"
      element={<Profile />}
    />

    <Route
      path="/contact"
      element={<Contact />}
    />

    <Route
      path="/terms"
      element={<Terms />}
    />

    <Route
      path="/dashboard"
      element={<CustomerDashboard />}
    />

    <Route
      path="/bookings"
      element={<MyBookings />}
    />

  </Routes>

</div>


);
}

export default App;
