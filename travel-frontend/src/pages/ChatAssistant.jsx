import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ChatAssistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const aiMsg = { role: "ai", text: data.reply };
      setChat((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6 text-center">
        🧠 Travel AI Assistant
      </h1>

      {/* CHAT BOX */}
      <div className="bg-white/10 p-4 rounded-xl h-[70vh] overflow-y-auto mb-4">

        {chat.map((c, i) => (
          <div
            key={i}
            className={`mb-3 p-3 rounded-xl w-fit max-w-[80%] ${
              c.role === "user"
                ? "bg-blue-500 ml-auto"
                : "bg-white/20"
            }`}
          >
            {c.text}
          </div>
        ))}

        {loading && (
          <p className="text-gray-300">Thinking...</p>
        )}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask travel question..."
          className="w-full p-3 rounded-xl text-black"
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}