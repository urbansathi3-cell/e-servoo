import { useEffect, useState } from "react"

function Workers({
setSelectedWorker,
selectedService
}) {

const [workers, setWorkers] = useState([])
const [sortBy, setSortBy] = useState("");
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
  .filter(w => w && w.name && w.image)
  .sort((a, b) =>
    (Number(b.rating || 0) * 0.7 +
     Number(b.TrustScore || 0) * 0.3)
    -
    (Number(a.rating || 0) * 0.7 +
     Number(a.TrustScore || 0) * 0.3)
  )
  .slice(0, 5);

  let filteredWorkers = [...workers];

if (sortBy === "rating") {
  filteredWorkers.sort(
    (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
  );
}



if (sortBy === "available") {
  filteredWorkers = filteredWorkers.filter(
    worker =>
      worker.status?.trim().toLowerCase() ===
      "available"
  );
}

return (

<section    
  id="workers"    
  className="bg-[#B4DBDC] text-slate-900 py-24 px-5"    
>    <h2 className="text-5xl font-bold text-center text-[#08566E] mb-12">    
    Our Workers    
  </h2>     <div className="max-w-xl mx-auto mb-8">  <input    
  type="text"    
  placeholder="Search Workers"    
  value={search}    
  onChange={(e) => setSearch(e.target.value)}    
  className="w-full p-4 rounded-xl bg-[#E1E9E5] border border-[#8FBDBE] text-slate-900 focus:border-blue-500 outline-none"    
/>    </div>   

<div className="max-w-xl mx-auto mb-8">
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="w-full p-4 rounded-xl bg-[#E1E9E5] border border-[#8FBDBE] text-slate-900"
  >
    <option value="">Sort Workers</option>

    <option value="rating">
      Rating High → Low
    </option>

    <option value="available">
      Available Only
    </option>

  </select>
</div>

 <div className="max-w-7xl mx-auto space-y-6">  {    
  filteredWorkers
    .filter(worker =>    
      selectedService === "All"    
        ? true    
        : worker.service?.toLowerCase() === selectedService.toLowerCase()    
    )    
    .filter(worker =>    
      worker.name?.toLowerCase().includes(search.toLowerCase()) ||    
      worker.service?.toLowerCase().includes(search.toLowerCase())    
    )    
    .map((worker, index) => (    <div
  key={index}
  onClick={() => {
  if (worker.status?.trim() !== "Available") return;


  setSelectedWorker({
    ...worker,
    status: worker.status
  });
}}
  className={`bg-[#8FBDBE] border border-[#6FA6A8] rounded-3xl p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between transition
    ${worker.status?.trim() === "Available"
      ? "hover:border-blue-500 cursor-pointer"
      : "opacity-50 cursor-not-allowed"
    }`}
>

    <div className="flex items-center gap-4">    

      <img
  src={worker.image || "https://via.placeholder.com/150"}
  alt={worker.name}
  referrerPolicy="no-referrer"
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/150";
  }}
  className="w-16 h-16 rounded-2xl object-cover"
/>

      <div>    

        <div className="flex items-center gap-2 flex-wrap">    

          <h3 className="font-bold text-xl text-[#08566E]">    
            {worker.name}    
          </h3>    
  
                </div>  <p className="text-[#0A5E75]">    
              {worker.service}    
            </p>  {worker.CertificateLink && (
<a
href={worker.CertificateLink}
target="_blank"
rel="noreferrer"
onClick={(e) => {
e.stopPropagation()
}}
className="text-[#08566E] text-xs font-semibold hover:underline"

> 

📜 Verified Skill Certificate

  </a>    
)}  <div className="flex flex-wrap gap-3 mt-2 text-sm">    <span className="text-yellow-400">    
            ⭐ {worker.rating || "4.8"}    
          </span>    

          <span className="text-slate-700">    
            📍 {worker.location || "Local Area"}    
          </span>    

          <span className="text-green-400 font-semibold">    
            🛡️ {worker.TrustScore || "90"}% Trust    
          </span>    

        </div>    

      </div>    

    </div>    

    <div className="text-right">

  <h3 className="text-xl font-bold text-[#08566E]">
    ✔ Verified Professional
  </h3>

 <p className="text-[#E1E9E5] text-sm font-medium">
  Inspection Based Pricing
</p>

  <div className="mt-2">    

        {worker.status?.trim() === "Available" ? (    

          <span className="bg-[#08566E] text-[#E1E9E5] px-3 py-1 rounded-full text-sm">    
            Available    
          </span>    

        ) : (    

          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">    
            Busy    
          </span>    

        )}    

      </div>    

    </div>    

  </div>    

))

}

  </div>  </section>  )  }

export default Workers