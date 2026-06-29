import { useState } from "react";

function AICostEstimator() {

const [service, setService] = useState("");
const [cost, setCost] = useState(null);
const [difficulty, setDifficulty] = useState("Easy");
const estimateCost = () => {


const prices = {
  Electrician: {
    Easy: 299,
    Medium: 599,
    Hard: 999
  },
  Plumber: {
    Easy: 349,
    Medium: 699,
    Hard: 1199
  },
  Carpenter: {
    Easy: 399,
    Medium: 799,
    Hard: 1499
  },
  Cleaner: {
    Easy: 249,
    Medium: 499,
    Hard: 799
  },
  Cook: {
    Easy: 499,
    Medium: 999,
    Hard: 1999
  }
};

setCost(
  prices[service]?.[difficulty] || 0
);


};

return ( <section className="bg-[#A4D1D2] text-slate-900 py-16 px-5">


  <div className="max-w-3xl mx-auto bg-[#6FA8AE] p-8 rounded-3xl shadow-xl border border-[#5E9AA1]">

    <h2 className="text-3xl font-bold text-[#08566E] mb-4">
      AI Cost Estimator
    </h2>

    <select
  value={service}
  onChange={(e) => setService(e.target.value)}
  className="w-full p-3 rounded-xl bg-[#E1E9E5] border border-[#6FA8AE] text-[#08566E] outline-none focus:border-[#08566E]"
>
  <option value="">Select Service</option>
  <option>Electrician</option>
  <option>Plumber</option>
  <option>Carpenter</option>
  <option>Cleaner</option>
  <option>Cook</option>
</select>

<select
  value={difficulty}
  onChange={(e) => setDifficulty(e.target.value)}
  className="w-full p-3 rounded-xl bg-[#E1E9E5] border border-[#6FA8AE] text-[#08566E] mt-3 outline-none focus:border-[#08566E]"
>
  <option>Easy</option>
  <option>Medium</option>
  <option>Hard</option>
</select>

<button
  onClick={estimateCost}
  className="mt-4 bg-[#08566E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#06495C] transition"
>
  Estimate Cost
</button>

    {cost && (
      <div className="mt-6 bg-[#08566E] p-5 rounded-xl">
        <p className="text-[#B4DBDC] font-semibold">
          Estimated Cost
        </p>

        <h3 className="text-4xl font-bold text-white">
          ₹{cost}
        </h3>

        <p className="text-[#E1E9E5] mt-2">
          Final price may vary based on job complexity.
        </p>
      </div>
    )}

  </div>

</section>


);
}

export default AICostEstimator;

