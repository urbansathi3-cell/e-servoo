import { useState } from "react"

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Services from "./components/Services"
import Workers from "./components/Workers"
import BookingForm from "./components/BookingForm"
import CustomerDashboard from "./components/CustomerDashboard"
import WorkerDashboard from "./components/WorkerDashboard"
import WorkerLogin from "./components/WorkerLogin"
import MyBookings from "./components/MyBookings"
import Footer from "./components/Footer"
import WhatsappButton from "./components/WhatsappButton"
import Login from "./components/Login"
import Register from "./components/Register"
import Welcome from "./components/Welcome"

function App() {

  const [selectedService, setSelectedService] = useState("All")

  const [selectedWorker, setSelectedWorker] = useState(null)

  const [showWelcome, setShowWelcome] = useState(true)

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user")
  )

  const [workerLoggedIn, setWorkerLoggedIn] = useState(
    !!localStorage.getItem("worker")
  )

  const [showLogin, setShowLogin] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  if (showWelcome) {
    return (
      <Welcome
        setShowWelcome={setShowWelcome}
      />
    )
  }

  return (

    <div className="bg-black min-h-screen">

      {!isLoggedIn ? (

        <>
          {showLogin && (
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setShowLogin={setShowLogin}
              setShowRegister={setShowRegister}
            />
          )}

          {showRegister && (
            <Register
              setShowLogin={setShowLogin}
              setShowRegister={setShowRegister}
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

      ) : (

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

              <CustomerDashboard />

              <MyBookings />

              <Footer />

              <WhatsappButton />
            </>

          )}

        </>

      )}

    </div>

  )

}

export default App