import { useState, useEffect, useRef } from "react";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

function AIAssistant() {

  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "👋 Welcome to E-SERVOO AI.\n\nI can help you with:\n\n⚡ Electrician\n🚿 Plumber\n🧹 Cleaner\n👨‍🍳 Cook\n💰 Cost Estimate\n📖 Booking\n🚨 Emergency",
    },
  ]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  const quickAsk = (text) => {

    setInput(text);

  };

  const sendMessage = () => {

    if (!input.trim()) return;

    const userMessage = input;

    const msg = input.toLowerCase();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setTyping(true);

    setInput("");

    setTimeout(() => {

      let reply = "";

      if (
        msg.includes("electrician")
      ) {

        reply =
          "⚡ Electrician Available\n\nVisiting Charge : ₹199\n\nEstimated Arrival : 30 Minutes";

      }

      else if (
        msg.includes("plumber")
      ) {

        reply =
          "🚿 Plumber Available\n\nVisiting Charge : ₹149";

      }

      else if (
        msg.includes("cleaner")
      ) {

        reply =
          "🧹 Cleaner Available Near You.";

      }

      else if (
        msg.includes("cook")
      ) {

        reply =
          "👨‍🍳 Professional Cook Available.";

      }

      else if (
        msg.includes("fan")
      ) {

        reply =
          "🌀 Fan Repair\n\nPossible Issues\n• Capacitor\n• Wiring\n• Motor\n\nEstimated Cost : ₹300 - ₹700";

      }

      else if (
        msg.includes("switch")
      ) {

        reply =
          "💡 Switch Repair\n\nEstimated Cost : ₹100 - ₹300";

      }

      else if (
        msg.includes("pipe")
      ) {

        reply =
          "🚿 Pipe Leakage\n\nEstimated Cost : ₹250 - ₹800";

      }

      else if (
        msg.includes("tap")
      ) {

        reply =
          "🚰 Tap Repair\n\nEstimated Cost : ₹150 - ₹500";

      }

      else if (
        msg.includes("ac")
      ) {

        reply =
          "❄️ AC Service\n\nEstimated Cost : ₹500 - ₹1500";

      }

      else if (
        msg.includes("washing machine")
      ) {

        reply =
          "🧺 Washing Machine Repair\n\nEstimated Cost : ₹400 - ₹2000";

      }

      else if (
        msg.includes("price") ||
        msg.includes("cost") ||
        msg.includes("charge")
      ) {

        reply =
          "💰 Estimated Charges\n\n⚡ Electrician : ₹199+\n🚿 Plumber : ₹149+\n🧹 Cleaner : ₹299+\n👨‍🍳 Cook : ₹499+\n\nFinal price depends on the actual work.";

      }

      else if (
        msg.includes("booking") ||
        msg.includes("book")
      ) {

        reply =
          "📖 Booking Process\n\n1️⃣ Select Service\n2️⃣ Choose Worker\n3️⃣ Fill Booking Form\n4️⃣ Confirm Booking\n\nYour worker will contact you shortly.";

      }

      else if (
        msg.includes("emergency") ||
        msg.includes("urgent")
      ) {

        reply =
          "🚨 Emergency Booking\n\nPlease choose 'Emergency' priority while booking.\nWe will try to assign the nearest available worker.";

      }

      else if (
        msg.includes("hello") ||
        msg.includes("hi")
      ) {

        reply =
          "👋 Hello! Welcome to E-SERVOO.\nHow can I help you today?";

      }

      else {

        reply =
          "🤖 Sorry, I couldn't understand your question.\n\nTry asking about:\n\n⚡ Electrician\n🚿 Plumber\n🧹 Cleaner\n👨‍🍳 Cook\n💰 Price\n📖 Booking\n🚨 Emergency";

      }

      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
        },
      ]);

    }, 900);

  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-[#08566E] hover:bg-[#06485C] text-white p-4 rounded-full shadow-xl"
      >
        {open ? <FaTimes size={22} /> : <FaRobot size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[350px] max-w-[95vw] h-[500px] bg-[#9ECFD0] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className="bg-[#08566E] text-white p-4 font-bold text-lg text-center">
            E-SERVOO AI Assistant
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-2 p-3 bg-[#B4DBDC]">
            <button onClick={() => quickAsk("Electrician")} className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm">Electrician</button>
            <button onClick={() => quickAsk("Plumber")} className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm">Plumber</button>
            <button onClick={() => quickAsk("Cleaner")} className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm">Cleaner</button>
            <button onClick={() => quickAsk("Price")} className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm">Price</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`max-w-[80%] whitespace-pre-line px-4 py-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "ml-auto bg-[#08566E] text-white"
                    : "bg-[#E1E9E5] text-[#08566E]"
                }`}
              >
                {msg.text}
              </div>

            ))}

            {typing && (
              <div className="bg-[#E1E9E5] text-[#08566E] px-4 py-3 rounded-2xl w-fit">
                AI is typing...
              </div>
            )}

            <div ref={messagesEndRef}></div>

          </div>

          {/* Input */}
          <div className="flex p-3 gap-2 border-t border-[#6FA8AA]">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask anything..."
              className="flex-1 rounded-xl px-4 py-2 outline-none bg-white text-[#08566E]"
            />

            <button
              onClick={sendMessage}
              className="bg-[#08566E] hover:bg-[#06485C] text-white px-4 rounded-xl"
            >
              <FaPaperPlane />
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIAssistant;