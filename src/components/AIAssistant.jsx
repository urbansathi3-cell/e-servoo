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
        "👋 Namaste! Main E-SERVOO AI hoon.\n\nMain aapki help kar sakta hoon:\n\n⚡ Electrician\n🚿 Plumber\n🧹 Cleaner\n👨‍🍳 Cook\n💰 Cost Estimate\n📖 Booking\n🚨 Emergency Service\n\nAap type bhi kar sakte ho ya mic se bol bhi sakte ho 🎤.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  /* ================= INDIAN VOICE LOADER ================= */

  useEffect(() => {
    const getVoiceScore = (voice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();

      let score = 0;

      // Best for Hinglish / Indian English
      if (lang === "en-in") score += 120;

      // Good for Hindi / Hinglish
      if (lang === "hi-in") score += 100;

      // Some systems write language slightly differently
      if (lang.includes("in")) score += 40;
      if (lang.includes("hi")) score += 30;

      // Prefer natural / Google / Microsoft India voices
      if (name.includes("india")) score += 35;
      if (name.includes("indian")) score += 35;
      if (name.includes("google")) score += 25;
      if (name.includes("microsoft")) score += 20;
      if (name.includes("natural")) score += 25;

      // Common Indian voices
      if (name.includes("heera")) score += 40;
      if (name.includes("ravi")) score += 40;
      if (name.includes("neerja")) score += 40;
      if (name.includes("prabhat")) score += 40;
      if (name.includes("hindi")) score += 25;
      if (name.includes("हिन्दी")) score += 25;
      if (name.includes("हिंदी")) score += 25;

      // Fallback English voices
      if (lang.startsWith("en")) score += 10;

      return score;
    };

    const loadBestVoice = () => {
      if (!window.speechSynthesis) return;

      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      const sortedVoices = [...voices].sort(
        (a, b) => getVoiceScore(b) - getVoiceScore(a)
      );

      bestVoiceRef.current = sortedVoices[0] || null;

      console.log(
        "Selected E-SERVOO AI Voice:",
        bestVoiceRef.current?.name || "Default voice",
        bestVoiceRef.current?.lang || ""
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

  /* ================= HINGLISH PROMPT ================= */

  const makeHinglishPrompt = (userMessage) => {
    return `
You are E-SERVOO AI assistant.

Reply style:
- Use simple Indian Hinglish.
- Prefer Roman Hindi/Hinglish, like: "aap", "service", "booking", "professional", "issue", "price estimate".
- Do not sound American.
- Keep tone helpful, Indian, polite and friendly.
- Keep answers short and clear.
- For repair cost, give estimate in rupees.
- Stay focused only on E-SERVOO home/local services.

User message:
${userMessage}
    `;
  };

  /* ================= IMPROVED INDIAN HINGLISH VOICE ================= */

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
        /🔧|🛠|💰|⏱|📌|⚠️|✅|❌|🚨|📖|👋|⚡|🚿|🧹|👨‍🍳|🎤|⭐/g,
        ""
      )
      .replace(/━━━━━━━━━━━━━━━━━━━━━━/g, "")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    const sentences =
      cleanText.match(/[^.!?।]+[.!?।]*/g) || [cleanText];

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

      // Indian assistant style: slower, clearer, less robotic
      utterance.rate = 0.78;
      utterance.pitch = 1.03;
      utterance.volume = 1;

      utterance.onend = () => {
        index++;
        setTimeout(speakNextSentence, 180);
      };

      utterance.onerror = (error) => {
        console.log("Speech error:", error);
        index++;
        setTimeout(speakNextSentence, 180);
      };

      window.speechSynthesis.speak(utterance);
    };

    setTimeout(speakNextSentence, 120);
  };

  const askAI = async (userMessage) => {
    if (!userMessage.trim()) return;

    setTyping(true);

    try {
      const reply = await askGemini(makeHinglishPrompt(userMessage));

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
        "⚠️ Abhi AI available nahi hai. Thodi der baad dobara try kariye.";

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

  /* ================= VOICE INPUT - INDIAN HINGLISH ================= */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    // hi-IN usually works better for Indian Hinglish on Chrome
    recognition.lang = "hi-IN";
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

      if (event.error === "not-allowed") {
        alert("Mic permission allow kariye.");
      }
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
      alert("Voice input is browser me supported nahi hai. Chrome use kariye.");
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
                onClick={() => quickAsk("Electrician service chahiye")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Electrician
              </button>

              <button
                onClick={() => quickAsk("Plumber service chahiye")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Plumber
              </button>

              <button
                onClick={() => quickAsk("Cleaner service chahiye")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Cleaner
              </button>

              <button
                onClick={() => quickAsk("Mera fan nahi chal raha hai")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Fan Issue
              </button>

              <button
                onClick={() => quickAsk("Price estimate batao")}
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
                  AI soch raha hai...
                </div>
              )}

              {listening && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl w-fit animate-pulse">
                  🎤 Sun raha hoon...
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
                placeholder="Kuch bhi poochiye..."
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