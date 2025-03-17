import { useState } from "react";
import axios from "axios";
import { Message } from "../types"; // Import message types

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]); // Define array of messages
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Create user message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add to state
    setLoading(true);

    try {
      const response = await axios.post<{ response: string }>("/api/ask", {
        query: input,
      });

      // Create AI response message
      const aiMessage: Message = {
        role: "assistant",
        content: response.data.response,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]); // Add AI response
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat with AI</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <p>AI is typing...</p>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
