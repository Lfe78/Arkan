import React, { useState } from "react";

const ArkanImage = "https://i.imgur.com/5vT8Qdw.png";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "system", content: "أنت أركان، شاب أجنبي وسيم يتحدث بالعربية فقط." },
  ]);
  const [input, setInput] = useState("");
  const [humanMode, setHumanMode] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, humanMode }),
    });
    const data = await response.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>أركان - مساعدك الذكي</h1>
      <img src={ArkanImage} alt="أركان" style={{ width: 150, borderRadius: 10, marginBottom: 10 }} />
      <button
        onClick={() => setHumanMode(!humanMode)}
        style={{ marginBottom: 20, padding: 10, cursor: "pointer", backgroundColor: humanMode ? "#4caf50" : "#888", color: "white", border: "none", borderRadius: 5 }}
      >
        {humanMode ? "وضع الإنسان الحقيقي (مفعل)" : "تفعيل وضع الإنسان الحقيقي"}
      </button>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          height: 400,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages
          .filter((m) => m.role !== "system")
          .map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: msg.role === "user" ? "#dcf8c6" : "#fff",
                  padding: 10,
                  borderRadius: 10,
                  maxWidth: "80%",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
        {loading && <p>...جاري التفكير</p>}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
        placeholder="اكتب رسالتك هنا..."
        style={{ width: "100%", padding: 10, fontSize: 16, boxSizing: "border-box" }}
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{ marginTop: 10, padding: "10px 20px", fontSize: 16, cursor: "pointer" }}
      >
        إرسال
      </button>
    </div>
  );
}