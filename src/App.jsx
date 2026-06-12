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

function HomePage({
  selectedService,
  setSelectedService,
  selectedWorker,
  setSelectedWorker,
}) {
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
          <Hero />

          <Services
            setSelectedService={setSelectedService}
          />

          <Workers
            setSelectedWorker={setSelectedWorker}
            selectedService={selectedService}
          />

          <WhatsappButton />

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700 flex justify-around py-3 z-50 text-white">
            <a href="#">🏠 Home</a>
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

  return (
    <div className="bg-black min-h-screen pb-20">

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              selectedWorker={selectedWorker}
              setSelectedWorker={setSelectedWorker}
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