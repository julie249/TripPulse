import React, { useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatAssistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      role: "bot",
      text: "Hi! I’m your TripNova travel assistant. Ask me anything about your trip ✈️",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("https://trippulse-11nu.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply || "Sorry, I could not answer right now.",
        },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Backend is not responding. Please check your server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What should I pack?",
    "Best time to visit Goa?",
    "How to reduce my travel budget?",
    "Suggest food to try",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-white/10 p-4 rounded-full">
              <Bot size={36} />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold">
            TripNova AI Chat
          </h1>

          <p className="text-gray-300 mt-2">
            Ask travel questions, packing tips, budget advice and destination help.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border border-white/20">
          <div className="h-[55vh] overflow-y-auto pr-2 space-y-4 mb-5">
            {chat.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${
                  item.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {item.role === "bot" && (
                  <div className="bg-purple-500 p-2 rounded-full h-fit">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm md:text-base ${
                    item.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white/20 text-gray-100 rounded-bl-none"
                  }`}
                >
                  {item.text}
                </div>

                {item.role === "user" && (
                  <div className="bg-blue-500 p-2 rounded-full h-fit">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="bg-purple-500 p-2 rounded-full h-fit">
                  <Bot size={18} />
                </div>
                <div className="bg-white/20 px-4 py-3 rounded-2xl rounded-bl-none">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setMessage(s)}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full text-sm flex items-center gap-1"
              >
                <Sparkles size={14} />
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything about your trip..."
              className="flex-1 px-4 py-3 rounded-2xl text-black outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 rounded-2xl hover:scale-105 transition"
            >
              <Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}