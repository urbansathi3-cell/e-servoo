import { useState, useEffect, useRef } from "react";
import { askGemini } from "../api/gemini";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaVolumeUp,
} from "react-icons/fa";

function AIAssistant({ language = localStorage.getItem("lang") || "en" }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const bestVoiceRef = useRef(null);
  const messagesRef = useRef([]);
  const languageRef = useRef(language);

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState({
    x: 20,
    y: 200,
  });

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const getLanguageName = () => {
    if (languageRef.current === "hi") return "Hindi/Hinglish";
    if (languageRef.current === "od") return "Odia";
    return "English/Hinglish";
  };

  const getSpeechLang = () => {
    if (languageRef.current === "hi") return "hi-IN";
    if (languageRef.current === "od") return "or-IN";
    return "en-IN";
  };

  const getDefaultMessage = () => {
    if (languageRef.current === "hi") {
      return {
        sender: "ai",
        text:
          "👋 Namaste! Main E-SERVOO AI hoon.\n\nMain aapki help kar sakta hoon:\n\n⚡ Electrician\n🚿 Plumber\n🧹 Cleaner\n👨‍🍳 Cook\n💰 Cost Estimate\n📖 Booking\n🚨 Emergency Service\n\nAap type bhi kar sakte ho ya mic se bol bhi sakte ho 🎤.",
      };
    }

    if (languageRef.current === "od") {
      return {
        sender: "ai",
        text:
          "👋 ନମସ୍କାର! ମୁଁ E-SERVOO AI।\n\nମୁଁ ଆପଣଙ୍କୁ ଏହି ସେବାରେ ସାହାଯ୍ୟ କରିପାରିବି:\n\n⚡ Electrician\n🚿 Plumber\n🧹 Cleaner\n👨‍🍳 Cook\n💰 Cost Estimate\n📖 Booking\n🚨 Emergency Service\n\nଆପଣ type କରିପାରିବେ କିମ୍ବା mic ରେ କହିପାରିବେ 🎤.",
      };
    }

    return {
      sender: "ai",
      text:
        "👋 Hello! I am E-SERVOO AI.\n\nI can help you with:\n\n⚡ Electrician\n🚿 Plumber\n🧹 Cleaner\n👨‍🍳 Cook\n💰 Cost Estimate\n📖 Booking\n🚨 Emergency Service\n\nYou can type or use the mic 🎤.",
    };
  };

  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem("eservoo_ai_messages");

      if (savedMessages) {
        return JSON.parse(savedMessages);
      }

      return [getDefaultMessage()];
    } catch (error) {
      console.log(error);
      return [getDefaultMessage()];
    }
  });

  useEffect(() => {
    messagesRef.current = messages;

    localStorage.setItem(
      "eservoo_ai_messages",
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  /* ================= MULTI-LANGUAGE HUMAN VOICE LOADER ================= */

  useEffect(() => {
    const getVoiceScore = (voice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();

      let score = 0;
      const currentLang = languageRef.current;

      if (currentLang === "od") {
        if (lang === "or-in") score += 200;
        if (lang.includes("or")) score += 140;
        if (name.includes("odia")) score += 150;
        if (name.includes("oriya")) score += 150;
        if (name.includes("ଓଡ଼ିଆ")) score += 150;

        // Odia voice rare hoti hai, fallback Indian Hindi/English
        if (lang === "hi-in") score += 80;
        if (lang === "en-in") score += 70;
      }

      if (currentLang === "hi") {
        if (lang === "hi-in") score += 180;
        if (lang === "en-in") score += 120;
        if (lang.includes("hi")) score += 80;
      }

      if (currentLang === "en") {
        if (lang === "en-in") score += 180;
        if (lang === "hi-in") score += 80;
        if (lang.startsWith("en")) score += 60;
      }

      if (lang.includes("in")) score += 45;

      // More natural sounding voices
      if (name.includes("google")) score += 35;
      if (name.includes("microsoft")) score += 30;
      if (name.includes("natural")) score += 40;
      if (name.includes("online")) score += 25;
      if (name.includes("neural")) score += 35;
      if (name.includes("premium")) score += 25;

      // Indian voice names
      if (name.includes("india")) score += 40;
      if (name.includes("indian")) score += 40;
      if (name.includes("heera")) score += 45;
      if (name.includes("ravi")) score += 45;
      if (name.includes("neerja")) score += 45;
      if (name.includes("prabhat")) score += 45;
      if (name.includes("hindi")) score += 30;

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
  }, [language]);

  const quickAsk = (text) => {
    setInput(text);
  };

  /* ================= CONTEXT AWARE MULTI-LANGUAGE PROMPT ================= */

  const makeLanguagePrompt = (userMessage, conversationMessages) => {
    const selectedLanguage = getLanguageName();

    const realConversation = conversationMessages.filter(
      (msg) =>
        !msg.text.includes("Namaste! Main E-SERVOO AI hoon") &&
        !msg.text.includes("ମୁଁ E-SERVOO AI") &&
        !msg.text.includes("I am E-SERVOO AI") &&
        !msg.text.includes("Main aapki help kar sakta hoon")
    );

    const conversationHistory = realConversation
      .slice(-12)
      .map((msg) => {
        return `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`;
      })
      .join("\n");

    const userMessageCount = realConversation.filter(
      (msg) => msg.sender === "user"
    ).length;

    return `
You are E-SERVOO AI assistant.

E-SERVOO is a hyperlocal home service platform for:
Electrician, Plumber, Cleaner, Cook, Carpenter, Painter, AC Repair, Appliance Repair, CCTV, Tutor, Booking, Emergency Service and Cost Estimate.

Selected app language: ${selectedLanguage}

Language rules:
- If selected language is Odia, reply mainly in simple Odia script.
- If selected language is Hindi/Hinglish, reply in simple Indian Hinglish/Roman Hindi.
- If selected language is English/Hinglish, reply in simple Indian English with Hinglish touch.
- Do NOT mix too many languages in one reply.
- Keep service names like Electrician, Plumber, Cleaner okay in English if needed.
- Do NOT sound American.
- Do NOT say "Namaste", "Welcome", or introduce yourself again and again.
- Greet only when it is the first real user message.
- Current real user message count: ${userMessageCount}
- Continue the conversation using previous chat context.
- Understand references like "same", "uska", "ye", "wo", "pichla", "that issue", "same worker", "seita", "eita".
- Keep replies short, practical and helpful.
- Stay focused only on E-SERVOO home/local services.
- For repair cost, give estimate in Indian rupees.
- For booking help, guide the user clearly.
- Never answer unrelated topics like politics, coding, general knowledge, or exams.

Conversation so far:
${conversationHistory || "No previous real conversation yet."}

Current user message:
${userMessage}

Reply naturally in the selected language. Do not repeat greeting unless this is the first real user message.
    `;
  };

  /* ================= HUMANIZED MULTI-LANGUAGE VOICE ================= */

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
        utterance.lang = getSpeechLang();
      }

      // Human-like slow clear assistant voice
      if (languageRef.current === "od") {
        utterance.rate = 0.72;
        utterance.pitch = 1.02;
      } else if (languageRef.current === "hi") {
        utterance.rate = 0.76;
        utterance.pitch = 1.03;
      } else {
        utterance.rate = 0.82;
        utterance.pitch = 1.02;
      }

      utterance.volume = 1;

      utterance.onend = () => {
        index++;
        setTimeout(speakNextSentence, 220);
      };

      utterance.onerror = (error) => {
        console.log("Speech error:", error);
        index++;
        setTimeout(speakNextSentence, 220);
      };

      window.speechSynthesis.speak(utterance);
    };

    setTimeout(speakNextSentence, 160);
  };

  const askAI = async (userMessage, updatedMessages) => {
    if (!userMessage.trim()) return;

    setTyping(true);

    try {
      const finalPrompt = makeLanguagePrompt(
        userMessage,
        updatedMessages
      );

      const reply = await askGemini(finalPrompt);

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
        languageRef.current === "od"
          ? "⚠️ ଏବେ AI available ନାହିଁ। କିଛି ସମୟ ପରେ ପୁଣି try କରନ୍ତୁ।"
          : languageRef.current === "hi"
            ? "⚠️ Abhi AI available nahi hai. Thodi der baad dobara try kariye."
            : "⚠️ AI is currently unavailable. Please try again later.";

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

    const userMessageObject = {
      sender: "user",
      text,
    };

    const updatedMessages = [
      ...messagesRef.current,
      userMessageObject,
    ];

    setMessages(updatedMessages);
    setInput("");

    askAI(text, updatedMessages);
  };

  const handleOptionClick = (option) => {
    const userMessageObject = {
      sender: "user",
      text: option,
    };

    const updatedMessages = [
      ...messagesRef.current,
      userMessageObject,
    ];

    setMessages(updatedMessages);

    askAI(option, updatedMessages);
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();

    localStorage.removeItem("eservoo_ai_messages");

    setMessages([getDefaultMessage()]);
  };

  /* ================= VOICE INPUT MULTI-LANGUAGE ================= */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = getSpeechLang();
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
        alert(
          languageRef.current === "od"
            ? "Mic permission allow କରନ୍ତୁ।"
            : languageRef.current === "hi"
              ? "Mic permission allow kariye."
              : "Please allow mic permission."
        );
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      const userMessageObject = {
        sender: "user",
        text: transcript,
      };

      const updatedMessages = [
        ...messagesRef.current,
        userMessageObject,
      ];

      setMessages(updatedMessages);

      askAI(transcript, updatedMessages);
    };

    recognitionRef.current = recognition;
  }, [language]);

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(
        languageRef.current === "od"
          ? "Voice input browser ରେ supported ନୁହେଁ। Chrome use କରନ୍ତୁ।"
          : languageRef.current === "hi"
            ? "Voice input is browser me supported nahi hai. Chrome use kariye."
            : "Voice input is not supported in this browser. Please use Chrome."
      );
      return;
    }

    if (listening) return;

    try {
      recognitionRef.current.lang = getSpeechLang();
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

  const getTypingText = () => {
    if (language === "od") return "AI ଭାବୁଛି...";
    if (language === "hi") return "AI soch raha hai...";
    return "AI is thinking...";
  };

  const getListeningText = () => {
    if (language === "od") return "🎤 ଶୁଣୁଛି...";
    if (language === "hi") return "🎤 Sun raha hoon...";
    return "🎤 Listening...";
  };

  const getPlaceholderText = () => {
    if (language === "od") return "କିଛି ପଚାରନ୍ତୁ...";
    if (language === "hi") return "Kuch bhi poochiye...";
    return "Ask anything...";
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
                  type="button"
                  onClick={clearChat}
                  className="text-xs bg-[#E1E9E5] text-[#08566E] px-2 py-1 rounded-full font-bold hover:scale-105 transition"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMinimized(true);
                    window.speechSynthesis?.cancel();
                  }}
                  className="hover:scale-110 transition"
                >
                  ➖
                </button>

                <button
                  type="button"
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
                type="button"
                onClick={() => quickAsk("Electrician service chahiye")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Electrician
              </button>

              <button
                type="button"
                onClick={() => quickAsk("Plumber service chahiye")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Plumber
              </button>

              <button
                type="button"
                onClick={() => quickAsk("Cleaner service chahiye")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Cleaner
              </button>

              <button
                type="button"
                onClick={() => quickAsk("Mera fan nahi chal raha hai")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Fan Issue
              </button>

              <button
                type="button"
                onClick={() => quickAsk("Price estimate batao")}
                className="bg-[#08566E] text-white px-3 py-1 rounded-full text-sm"
              >
                Price
              </button>

              <button
                type="button"
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
                          type="button"
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
                  {getTypingText()}
                </div>
              )}

              {listening && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl w-fit animate-pulse">
                  {getListeningText()}
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
                placeholder={getPlaceholderText()}
                className="flex-1 rounded-xl px-4 py-2 outline-none bg-white text-[#08566E]"
              />

              <button
                type="button"
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
                type="button"
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