import { useState, useEffect, useRef } from "react";
import { askGemini } from "../api/gemini";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const messagesEndRef = useRef(null);

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState({
    x: 20,
    y: 200,
  });

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

  const handleOptionClick = (option) => {

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: option,
    },
  ]);

  askAI(option);

};

  const askAI = async (userMessage) => {

  if (!userMessage.trim()) return;

  setTyping(true);

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

const sendMessage = () => {

  if (!input.trim()) return;

  const text = input;

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text,
    },
  ]);

  setInput("");

  askAI(text);

};

  /* ================= DRAG (DESKTOP) ================= */
  const handleMouseDown = (e) => {
    dragging.current = true;

    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;

    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  /* ================= TOUCH (MOBILE) ================= */
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    dragging.current = true;

    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  const handleTouchMove = (e) => {
    if (!dragging.current) return;

    const touch = e.touches[0];

    setPosition({
      x: touch.clientX - offset.current.x,
      y: touch.clientY - offset.current.y,
    });
  };

  const handleTouchEnd = () => {
    dragging.current = false;
  };

  return (
    <>
      {/* FLOATING BUTTON (WHEN CLOSED OR MINIMIZED) */}
      {(!open || minimized) && (
        <button
          onClick={() => {
            setOpen(true);
            setMinimized(false);
          }}
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            zIndex: 9999,
          }}
          className="bg-[#08566E] text-white p-4 rounded-full shadow-xl"
        >
          <FaRobot size={22} />
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && !minimized && (
        <div
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            zIndex: 9999,
          }}
        >
          <div className="w-[350px] max-w-[95vw] h-[500px] bg-[#9ECFD0] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

            {/* HEADER (DRAG AREA) */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="bg-[#08566E] text-white p-4 font-bold text-lg flex justify-between items-center cursor-grab"
            >
              E-SERVOO AI

              <div className="flex gap-3">
                <button onClick={() => setMinimized(true)}>
                  ➖
                </button>

                <button onClick={() => setOpen(false)}>
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* QUICK BUTTONS */}
            <div className="flex flex-wrap gap-2 p-3 bg-[#B4DBDC]">
              <button onClick={() => quickAsk("Electrician")} className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm">Electrician</button>
              <button onClick={() => quickAsk("Plumber")} className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm">Plumber</button>
              <button onClick={() => quickAsk("Cleaner")} className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm">Cleaner</button>
              <button onClick={() => quickAsk("Price")} className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm">Price</button>
            </div>

            {/* MESSAGES */}
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
                  {msg.options && (
  <div className="flex flex-wrap gap-2 mt-3">
    {msg.options.map((option, i) => (
      <button
        key={i}
        onClick={() => handleOptionClick(option)}
        className="bg-[#08566E] text-white px-3 py-2 rounded-full hover:bg-[#06485C] text-sm"
      >
        {option}
      </button>
    ))}
  </div>
)}
                </div>
              ))}

              {typing && (
                <div className="bg-[#E1E9E5] text-[#08566E] px-4 py-3 rounded-2xl w-fit">
                  AI is typing...
                </div>
              )}

              <div ref={messagesEndRef}></div>
            </div>

            {/* INPUT */}
            <div className="flex p-3 gap-2 border-t border-[#6FA8AA]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Ask anything..."
                className="flex-1 rounded-xl px-4 py-2 outline-none bg-white text-[#08566E]"
              />

              <button
                onClick={sendMessage}
                className="bg-[#08566E] text-white px-4 rounded-xl"
              >
                <FaPaperPlane />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default AIAssistant;