import { useState, useEffect, useRef } from "react";
import { askGemini } from "../api/gemini";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaVolumeUp,
} from "react-icons/fa";

function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const bestVoiceRef = useRef(null);

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
        "👋 Welcome to E-SERVOO AI.\n\nI can help you with:\n\n⚡ Electrician\n🚿 Plumber\n🧹 Cleaner\n👨‍🍳 Cook\n💰 Cost Estimate\n📖 Booking\n🚨 Emergency\n\nYou can type or use the mic 🎤.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  /* ================= BEST VOICE LOADER ================= */

  useEffect(() => {
    const loadBestVoice = () => {
      if (!window.speechSynthesis) return;

      const voices = window.speechSynthesis.getVoices();

      const selectedVoice =
        voices.find(
          (voice) =>
            voice.lang === "en-IN" &&
            voice.name.toLowerCase().includes("google")
        ) ||
        voices.find((voice) => voice.lang === "en-IN") ||
        voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            voice.name.toLowerCase().includes("natural")
        ) ||
        voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            voice.name.toLowerCase().includes("google")
        ) ||
        voices.find((voice) => voice.lang.startsWith("en"));

      bestVoiceRef.current = selectedVoice || null;

      console.log(
        "Selected AI Voice:",
        selectedVoice?.name || "Default voice"
      );
    };

    loadBestVoice();

    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadBestVoice;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const quickAsk = (text) => {
    setInput(text);
  };

  /* ================= IMPROVED AI VOICE ================= */

  const speakText = (text) => {
    if (!voiceReply) return;

    if (!window.speechSynthesis) {
      console.log("Speech synthesis not supported");
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*#_`]/g, "")
      .replace(/₹/g, " rupees ")
      .replace(/•/g, "")
      .replace(
        /🔧|🛠|💰|⏱|📌|⚠️|✅|❌|🚨|📖|👋|⚡|🚿|🧹|👨‍🍳|🎤/g,
        ""
      )
      .replace(/━━━━━━━━━━━━━━━━━━━━━━/g, "")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    const sentences = cleanText.match(/[^.!?]+[.!?]*/g) || [cleanText];

    let index = 0;

    const speakNextSentence = () => {
      if (index >= sentences.length) return;

      const sentence = sentences[index].trim();

      if (!sentence) {
        index++;
        speakNextSentence();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentence);

      if (bestVoiceRef.current) {
        utterance.voice = bestVoiceRef.current;
        utterance.lang = bestVoiceRef.current.lang;
      } else {
        utterance.lang = "en-IN";
      }

      utterance.rate = 0.86;
      utterance.pitch = 1.08;
      utterance.volume = 1;

      utterance.onend = () => {
        index++;
        setTimeout(speakNextSentence, 140);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextSentence();
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

      speakText(reply);
    } catch (error) {
      console.error(error);

      setTyping(false);

      const errorMessage =
        "⚠️ AI is currently unavailable. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMessage,
        },
      ]);

      speakText(errorMessage);
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

  /* ================= VOICE INPUT ================= */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.log("Voice error:", event.error);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: transcript,
        },
      ]);

      askAI(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    if (listening) return;

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log("Voice start error:", error);
    }
  };

  /* ================= DRAG DESKTOP ================= */

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

  /* ================= DRAG MOBILE ================= */

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
      {/* FLOATING BUTTON */}
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
          className="bg-[#08566E] text-white p-4 rounded-full shadow-xl hover:bg-[#06485C]"
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

            {/* HEADER */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="bg-[#08566E] text-white p-4 font-bold text-lg flex justify-between items-center cursor-grab select-none"
            >
              <span>E-SERVOO AI</span>

              <div className="flex gap-3 items-center">
                <button
                  onClick={() => {
                    setMinimized(true);
                    window.speechSynthesis?.cancel();
                  }}
                  className="hover:scale-110 transition"
                >
                  ➖
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    window.speechSynthesis?.cancel();
                  }}
                  className="hover:scale-110 transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* QUICK BUTTONS */}
            <div className="flex flex-wrap gap-2 p-3 bg-[#B4DBDC]">
              <button
                onClick={() => quickAsk("Electrician")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Electrician
              </button>

              <button
                onClick={() => quickAsk("Plumber")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Plumber
              </button>

              <button
                onClick={() => quickAsk("Cleaner")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Cleaner
              </button>

              <button
                onClick={() => quickAsk("Fan not working")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Fan Issue
              </button>

              <button
                onClick={() => quickAsk("Price estimate")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Price
              </button>

              <button
                onClick={() => {
                  setVoiceReply(!voiceReply);
                  window.speechSynthesis?.cancel();
                }}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                <FaVolumeUp />
                {voiceReply ? "Voice On" : "Voice Off"}
              </button>
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

              {listening && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl w-fit animate-pulse">
                  🎤 Listening...
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
                onClick={startVoiceInput}
                className={`px-4 rounded-xl text-white ${
                  listening
                    ? "bg-red-500 animate-pulse"
                    : "bg-[#08566E] hover:bg-[#06485C]"
                }`}
              >
                <FaMicrophone />
              </button>

              <button
                onClick={sendMessage}
                className="bg-[#08566E] hover:bg-[#06485C] text-white px-4 rounded-xl"
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