import { useState, useEffect } from "react"
import { FaTimes } from "react-icons/fa"

function BookingForm({ selectedWorker, setSelectedWorker }) {

const [formData, setFormData] = useState({
name: "",
phone: "",
address: "",
service: "",
worker: ""
})

const [success, setSuccess] = useState(false)

useEffect(() => {

if (selectedWorker) {

  setFormData({
    name: "",
    phone: "",
    address: "",
    service: selectedWorker.service,
    worker: selectedWorker.name
  })

}

}, [selectedWorker])

const handleChange = (e) => {

setFormData({
  ...formData,
  [e.target.name]: e.target.value
})

}

const handleSubmit = async (e) => {

e.preventDefault()

try {

  await fetch(
    "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
    {
      method: "POST",
      body: JSON.stringify(formData)
    }
  )

  setSuccess(true)

} catch (error) {

  alert("Booking Failed")

}

}

return (

<>

  {success && (

    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] px-5">

      <div className="bg-zinc-900 p-8 rounded-3xl border border-green-500 text-center max-w-md w-full">

        <h2 className="text-3xl font-bold text-green-500">
          ✅ Booking Successful
        </h2>

        <p className="mt-5 text-white text-lg">
          Worker: {formData.worker}
        </p>

        <p className="mt-2 text-Blue-500 text-lg">
          Service: {formData.service}
        </p>

        <p className="mt-4 text-zinc-400">
          Our team will contact you shortly.
        </p>

        <button
  onClick={() => {

    setSuccess(false)
    setSelectedWorker(null)

    setFormData({
      name: "",
      phone: "",
      address: "",
      service: "",
      worker: ""
    })

  }}
  className="bg-blue-500 px-6 py-3 rounded-xl mt-6 hover:bg-blue-600"
>
  Close
</button>

      </div>

    </div>

  )}

  {selectedWorker && (

    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-5">

      <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-8 relative border border-blue-500">

        <button
          onClick={() => setSelectedWorker(null)}
          className="absolute top-5 right-5 text-white text-xl"
        >
          <FaTimes />
        </button>

        <img
          src={selectedWorker.image}
          alt={selectedWorker.name}
          className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-blue-500"
        />

        <h2 className="text-3xl font-bold text-center text-white mt-5">
          {selectedWorker.name}
        </h2>

        <p className="text-center text-blue-500 mt-2">
          {selectedWorker.service}
        </p>

        <p className="text-green-400 font-bold">
  Service Charge: {selectedWorker?.fare}
</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-8"
        >

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="p-4 rounded-xl bg-black text-white"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-4 rounded-xl bg-black text-white"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="p-4 rounded-xl bg-black text-white"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition duration-300"
          >
            Confirm Booking
          </button>

        </form>

      </div>

    </div>

  )}

</>

)
}

export default BookingForm
