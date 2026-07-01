import { useState } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I'm E-SERVOO AI.\nHow can I help you today?",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input;
    const msg = input.toLowerCase();

    let reply = "";

    if (msg.includes("electrician")) {
      reply =
        "⚡ Electrician Available\n\nVisiting Charge: ₹199\nEstimated Time: 30 Minutes";
    } else if (msg.includes("plumber")) {
      reply =
        "🚿 Plumber Available\n\nVisiting Charge: ₹149";
    } else if (msg.includes("cleaner")) {
      reply =
        "🧹 Cleaner Available Near You";
    } else if (msg.includes("cook")) {
      reply =
        "👨‍🍳 Cook Available";
    } else if (msg.includes("booking")) {
      reply =
        "📖 Choose your worker and press Book Now to confirm.";
    } else if (msg.includes("price")) {
      reply =
        "💰 Prices depend on worker experience and urgency.";
    } else if (msg.includes("emergency")) {
      reply =
        "🚨 Emergency Booking Available.\nExtra charges may apply.";
    } else if (msg.includes("hello") || msg.includes("hi")) {
      reply =
        "Hello 👋\nWelcome to E-SERVOO.\nHow can I help you?";
    } else {
      reply =
        "