import { useState } from "react"

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Services from "./components/Services"
import Workers from "./components/Workers"
import BookingForm from "./components/BookingForm"
import Dashboard from "./components/Dashboard"
import Footer from "./components/Footer"
import WhatsappButton from "./components/WhatsappButton"

function App() {

  const [selectedWorker, setSelectedWorker] = useState(null)

  return (

    <div className="bg-zinc-950">

      <Navbar />

      <Hero />

      <Services />

<Dashboard />

<Workers setSelectedWorker={setSelectedWorker} />

<BookingForm
  selectedWorker={selectedWorker}
  setSelectedWorker={setSelectedWorker}
/>

      <Footer />

      <WhatsappButton />

    </div>

  )
}

export default App