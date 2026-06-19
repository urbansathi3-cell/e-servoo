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

return ( <section className="bg-black text-white py-16 px-5"> <div className="max-w-3xl mx-auto bg-[#111111] rounded-3xl p-8 border border-blue-900">


    <h2 className="text-3xl font-bold text-blue-500 mb-4">
      Smart Service Recommendation
    </h2>

    <p className="text-zinc-400 mb-5">
      Describe your problem and E-SERVOO will suggest the best service.
    </p>

    <input
      type="text"
      placeholder="Example: My fan is not working"
      value={problem}
      onChange={(e) => setProblem(e.target.value)}
      className="w-full p-4 rounded-xl bg-black border border-zinc-700"
    />

    <button
      onClick={handleRecommend}
      className="mt-4 bg-blue-500 px-6 py-3 rounded-xl font-semibold hover:bg-blue-600"
    >
      Get Recommendation
    </button>

    {recommendation && (
      <div className="mt-6 bg-[#16233d] p-4 rounded-xl">
        <p className="text-green-400 font-bold">
          Recommended Service:
        </p>

        <h3 className="text-2xl font-bold mt-2">
          {recommendation}
        </h3>
      </div>
    )}
  </div>
</section>


);
}

export default SmartRecommendation;
