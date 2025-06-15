import React, { useState } from "react";

/**
 * ChatBot: A simple in-game assistant/chat helper.
 * You can expand it with AI APIs, command parser, or FAQ logic.
 */
const FAQ = [
  { q: "How do I buy stocks?", a: "Go to the Stock Market tab and click the Buy button next to the stock you want." },
  { q: "What affects commodity prices?", a: "Commodity prices can change based on simulated global events and market news." },
  { q: "How do I earn more money?", a: "Trade smartly, watch the news, and invest in profitable companies and commodities." }
];

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am your assistant. Ask me something about the game." }
  ]);
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;
    const answer = FAQ.find(faq =>
      input.toLowerCase().includes(faq.q.toLowerCase().split(" ")[2]) // crude matching
    );
    setMessages([
      ...messages,
      { from: "user", text: input },
      { from: "bot", text: answer ? answer.a : "Sorry, I don't know that yet!" }
    ]);
    setInput("");
  }

  return (
    <div style={{
      background: "#f3f6fa",
      border: "1px solid #d5dbe0",
      borderRadius: 8,
      padding: 16,
      maxWidth: 350,
      margin: "0 auto"
    }}>
      <div style={{ minHeight: 120, marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.from === "user" ? "right" : "left",
            margin: "6px 0"
          }}>
            <span style={{
              background: m.from === "user" ? "#d0e7f9" : "#e1eaf7",
              padding: "6px 12px",
              borderRadius: 12,
              display: "inline-block"
            }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          style={{
            flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc"
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type your question…"
        />
        <button style={{
          background: "#3b7ddd", color: "white", border: "none", borderRadius: 8, padding: "0 16px"
        }} onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}