import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Episode, Message } from "../types";
// import { useState } from "react";
// import axios from "axios";
// import { Message } from "../types"; // Import message types

import config from "../config";

export default function ChatPage() {
  // const [messages, setMessages] = useState<Message[]>([]); // Define array of messages
  // const [input, setInput] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const episode = location.state?.episode as Episode | null; // Retrieve passed episode
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 When the page loads, automatically start the conversation
  useEffect(() => {
    if (episode) {
      const date = episode.formatted_date
        ? episode.formatted_date
        : episode.date;

      const initialMessage: Message = {
        role: "assistant",
        content: `
          Welcome! You’re exploring the episode **"${
            episode.title
          }"**, which aired on **${date}**.  

          **Episode Details:**  
          - **Guests:** ${
            episode.guests?.join(", ") || "No guest info available"
          }  
          - **Top 5 Comparison Year:** ${
            episode.top_5_comparison_year || "Not available"
          }  
          - **Notes:** ${episode.notes || "No additional notes provided."}  

          I can help summarize this episode, provide insights, or answer specific questions!  
          What would you like to know? 🎙️  
        `,
      };
      setMessages([initialMessage]);
    }
  }, [episode]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Create user message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add to state
    setLoading(true);

    try {
      const response = await axios.post<{ response: string }>(
        `${config.apiUrl}/ask`,
        {
          query: input,
        }
      );

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
