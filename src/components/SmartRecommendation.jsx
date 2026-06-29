import { useState } from "react";

function SmartRecommendation({ setSelectedService }) {
const [problem, setProblem] = useState("");
const [recommendation, setRecommendation] = useState("");

const serviceKeywords = {
Electrician: [
"fan",
"switch",
"wire",
"light",
"socket",
"electric",
"power"
],


Plumber: [
  "water",
  "tap",
  "pipe",
  "leak",
  "tank",
  "bathroom"
],

Carpenter: [
  "door",
  "window",
  "furniture",
  "table",
  "chair",
  "wood"
],

Cleaner: [
  "clean",
  "dust",
  "wash",
  "garbage",
  "dirty"
],

Cook: [
  "food",
  "meal",
  "cook",
  "kitchen",
  "chef"
]


};

const handleRecommend = () => {
const text = problem.toLowerCase();


let bestMatch = "";

for (const service in serviceKeywords) {
  const matched = serviceKeywords[service].some((keyword) =>
    text.includes(keyword)
  );

  if (matched) {
    bestMatch = service;
    break;
  }
}

if (bestMatch) {
  setRecommendation(bestMatch);
  setSelectedService(bestMatch);
} else {
  setRecommendation("No recommendation found");
}


};

return ( <section className="bg-[#A4D1D2] text-slate-900 py-16 px-5"> <div className="max-w-3xl mx-auto bg-[#6FA8AE] rounded-3xl p-8 shadow-xl border border-[#5E9AA1]">


    <h2 className="text-3xl font-bold text-[#08566E] mb-4">
      Smart Service Recommendation
    </h2>

    <p className="text-[#26454C] mb-5">
      Describe your problem and E-SERVOO will suggest the best service.
    </p>

    <input
      type="text"
      placeholder="Example: My fan is not working"
      value={problem}
      onChange={(e) => setProblem(e.target.value)}
      className="w-full p-4 rounded-xl bg-[#E1E9E5] border border-[#6FA8AE] text-[#08566E] placeholder:text-[#5E7E86] outline-none focus:border-[#08566E]"
    />

    <button
      onClick={handleRecommend}
      className="mt-4 bg-[#08566E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#06495C] transition"
    >
      Get Recommendation
    </button>

    {recommendation && (
      <div className="mt-6 bg-[#08566E] p-4 rounded-xl">
        <p className="text-[#B4DBDC] font-bold">
          Recommended Service:
        </p>

        <h3 className="text-2xl font-bold mt-2 text-white">
          {recommendation}
        </h3>
      </div>
    )}
  </div>
</section>


);
}

export default SmartRecommendation;
