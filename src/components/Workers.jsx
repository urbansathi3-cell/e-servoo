import { useEffect, useState } from "react"

function Workers({
setSelectedWorker,
selectedService
}) {

const [workers, setWorkers] = useState([])
const [search, setSearch] = useState("")

useEffect(() => {

const fetchWorkers = () => {

fetch(
"https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec"
)
.then((res) => res.json())
.then((data) => {

if (Array.isArray(data)) {  
    setWorkers(data)  
  } else {  
    setWorkers([])  
  }  

})  
.catch((error) => {  
  console.log(error)  
})

}

fetchWorkers()

const interval = setInterval(() => {
fetchWorkers()
}, 3000)

return () => clearInterval(interval)

}, [])

const topWorkers = [...workers]
.sort(
(a, b) =>
(Number(b.rating || 0) * 0.7 +
Number(b.TrustScore || 0) * 0.3)
-
(Number(a.rating || 0) * 0.7 +
Number(a.TrustScore || 0) * 0.3)
)
.slice(0, 5)

return (

<section  
  id="workers"  
  className="bg-black text-white py-24 px-5"  
>    <h2 className="text-5xl font-bold text-center text-blue-500 mb-12">  
    Our Workers  
  </h2>    <div className="max-w-7xl mx-auto mb-12">    <h3 className="text-3xl font-bold text-yellow-400 mb-6">  
    ⭐ Top Rated Workers  
  </h3>    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">  {topWorkers.map((worker, index) => (  

  <div  
    key={index}  
    onClick={() => setSelectedWorker(worker)}  
    className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500 rounded-3xl p-5 cursor-pointer hover:scale-105 transition"  
  >  

    <img  
      src={worker.image}  
      alt={worker.name}  
      className="w-20 h-20 rounded-full mx-auto object-cover"  
    />  

    <h4 className="text-center text-xl font-bold mt-3">  
      {worker.name}  
    </h4>  

    <p className="text-center text-blue-400">  
      {worker.service}  
    </p>  

    <div className="text-center mt-2">  
      <p className="text-yellow-400">  
        ⭐ {worker.rating}  
      </p>  

      <p className="text-green-400">  
        🛡️ {worker.TrustScore}% Trust  
      </p>  

      <p className="text-white">  
        ₹{worker.fare}  
      </p>  
    </div>  

  </div>  

))}

  </div>  </div>    <div className="max-w-xl mx-auto mb-8">  <input  
  type="text"  
  placeholder="Search Workers"  
  value={search}  
  onChange={(e) => setSearch(e.target.value)}  
  className="w-full p-4 rounded-xl bg-[#111111] border border-zinc-700 text-white focus:border-blue-500 outline-none"  
/>

  </div>    <div className="max-w-7xl mx-auto space-y-6">  {  
  workers  
    .filter(worker =>  
      selectedService === "All"  
        ? true  
        : worker.service?.toLowerCase() === selectedService.toLowerCase()  
    )  
    .filter(worker =>  
      worker.name?.toLowerCase().includes(search.toLowerCase()) ||  
      worker.service?.toLowerCase().includes(search.toLowerCase())  
    )  
    .map((worker, index) => (  

      <div  
        key={index}  
        onClick={() => setSelectedWorker(worker)}  
        className="bg-[#16233d] border border-blue-900 rounded-3xl p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between hover:border-blue-500 transition cursor-pointer"  
      >  

        <div className="flex items-center gap-4">  

          <img  
            src={worker.image}  
            alt={worker.name}  
            referrerPolicy="no-referrer"  
            onError={(e) => {  
              e.target.src =  
                "https://via.placeholder.com/150"  
            }}  
            className="w-16 h-16 rounded-2xl object-cover"  
          />  

          <div>  

            <div className="flex items-center gap-2 flex-wrap">  

              <h3 className="font-bold text-xl text-white">  
                {worker.name}  
              </h3>  

              {worker.Verified === "Yes" && (

  <span className="flex items-center gap-1 text-orange-400 text-xs font-semibold">  
    <svg  
      xmlns="http://www.w3.org/2000/svg"  
      viewBox="0 0 24 24"  
      fill="currentColor"  
      className="w-4 h-4"  
    >  
      <path  
        fillRule="evenodd"  
        d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75S6.624 21.75 12 21.75 21.75 17.376 21.75 12 17.376 2.25 12 2.25zm4.28 8.47a.75.75 0 00-1.06-1.06l-4.97 4.97-1.97-1.97a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5.5-5.5z"  
        clipRule="evenodd"  
      />  
    </svg>  
    Verified  
  </span>  
)}  
                </div>  <p className="text-blue-400">  
              {worker.service}  
            </p>

{worker.CertificateLink && (
<a
href={worker.CertificateLink}
target="_blank"
rel="noreferrer"
onClick={(e) => {
e.stopPropagation()
}}
className="text-orange-400 text-xs font-semibold hover:underline"

> 

📜 Verified Skill Certificate

  </a>  
)}  <div className="flex flex-wrap gap-3 mt-2 text-sm">  

              <span className="text-yellow-400">  
                ⭐ {worker.rating || "4.8"}  
              </span>  

              <span className="text-zinc-400">  
                📍 {worker.location || "Local Area"}  
              </span>  

              <span className="text-green-400 font-semibold">  
                🛡️ {worker.TrustScore || "90"}% Trust  
              </span>  

            </div>  

          </div>  

        </div>  

        <div className="text-right">  

          <h3 className="text-3xl font-bold text-white">  
            ₹{worker.fare}  
          </h3>  

          <p className="text-zinc-400 text-sm">  
            visiting cost  
          </p>  

          <div className="mt-2">  

            {worker.status?.trim() === "Available" ? (  

              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">  
                Available  
              </span>  

            ) : (  

              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">  
                Busy  
              </span>  

            )}  

          </div>  

        </div>  

      </div>  

    ))  
}

  </div>  </section>  )

}

export default Workers