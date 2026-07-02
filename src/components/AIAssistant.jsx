import { useState, useEffect, useRef } from "react";
import { askGemini } from "../api/gemini";
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

  const sendMessage = async () => {

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

    try {

  const reply = await askGemini(userMessage);

  setTyping(false);

  setMessages((prev) => [
    ...prev,
    {
      sender: "ai",
      text: reply,
    },
  ]);

} catch (error) {

  console.error(error);

  setTyping(false);

  setMessages((prev) => [
    ...prev,
    {
      sender: "ai",
      text: "⚠️ AI is currently unavailable. Please try again.",
    },
  ]);

}

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