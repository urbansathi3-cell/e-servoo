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

return ( <section className="bg-[#B4DBDC] text-slate-900 py-16 px-5">


  <div className="max-w-3xl mx-auto bg-[#111111] p-8 rounded-3xl border border-blue-800">

    <h2 className="text-3xl font-bold text-blue-500 mb-4">
      AI Cost Estimator
    </h2>

    <select
  value={service}
  onChange={(e) => setService(e.target.value)}
  className="w-full p-3 rounded-xl bg-[#B4DBDC]"
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
  className="w-full p-3 rounded-xl bg-[#B4DBDC] mt-3"
>
  <option>Easy</option>
  <option>Medium</option>
  <option>Hard</option>
</select>

<button
  onClick={estimateCost}
  className="mt-4 bg-blue-500 px-5 py-3 rounded-xl"
>
  Estimate Cost
</button>

    {cost && (
      <div className="mt-6 bg-[#16233d] p-5 rounded-xl">
        <p className="text-green-400">
          Estimated Cost
        </p>

        <h3 className="text-4xl font-bold">
          ₹{cost}
        </h3>

        <p className="text-zinc-400 mt-2">
          Final price may vary based on job complexity.
        </p>
      </div>
    )}

  </div>

</section>


);
}

export default AICostEstimator;

