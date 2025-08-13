import React, { useState, useRef, useEffect } from "react";
import { db, auth, model } from "../../../../Firebase/firebase";
import { FaPaperPlane, FaRegTrashAlt } from "react-icons/fa";
import "./ConceptExplainer.css";

const ConceptExplainer = ({
  placeholder = "Ask about a concept...",
  initialValue = "",
}) => {
  const [message, setMessage] = useState(initialValue);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]); // Chat history
  const textAreaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const resizeTextarea = () => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
    };
    resizeTextarea();
    const observer = new ResizeObserver(resizeTextarea);
    if (textAreaRef.current) observer.observe(textAreaRef.current);
    return () => observer.disconnect();
  }, [message]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message and get bot response with full conversation context
  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const userMsg = {
      id: Date.now(),
      text: message.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add user message to chat history immediately
    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      // Build prompt with previous conversation for context
      const conversationContext = messages
        .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`)
        .join("\n");

      const prompt = `
You are a helpful assistant explaining concepts.

Conversation history:
${conversationContext}

User: ${message.trim()}
Bot:`;

      const result = await model.generateContent(prompt);
      const botResponse = await result.response.text();

      const botMsg = {
        id: Date.now() + 1,
        text: botResponse || "Sorry, I didn't understand. Could you rephrase?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setMessage("");
    } catch (error) {
      console.error("Error generating AI response:", error);
      alert("Failed to get response. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Send on Enter key without Shift
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Chat history */}
      <div ref={chatContainerRef} className="chat-history">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-wrapper ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <div className="message">
              <p>{msg.text}</p>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={textAreaRef}
            className="chat-textarea"
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Chat Message Input"
            disabled={isSending}
          />
          {message && (
            <button
              className="icon-button clear-btn"
              onClick={() => setMessage("")}
              aria-label="Clear Message"
              disabled={isSending}
            >
              <FaRegTrashAlt />
            </button>
          )}
          <button
            className="icon-button send-btn"
            onClick={handleSend}
            aria-label="Send Message"
            disabled={isSending || !message.trim()}
          >
            {isSending ? "Sending..." : <FaPaperPlane />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptExplainer;
