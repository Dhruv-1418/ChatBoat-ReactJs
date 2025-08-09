import React, { useRef, useState, useEffect } from "react";
import Chatboaticon from "./components/Chatboaticon";
import Chatform from "./components/Chatform";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": import.meta.env.VITE_API_KEY, // Use API key from .env  
      },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong!");
      }

      const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/\*\*(.*?)\*\*/g, "$1")
        ?.trim() || "No response from API";
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <>
      <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
        <button
          id="chatbot-toggler"
          onClick={() => setShowChatbot((prev) => !prev)}
        >
          <span className="material-symbols-outlined">mode_comment</span>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="chatbot-popup">
          <div className="chat-header">
            <div className="header-info">
              <Chatboaticon />
              <h2 className="logo-text">ChatBoat</h2>
            </div>
            <button
              className="material-symbols-outlined"
              onClick={() => setShowChatbot((prev) => !prev)}
            >
              keyboard_double_arrow_down
            </button>
          </div>

          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
              <Chatboaticon />
              <div className="message-text">
                Hey There <br /> How can I help you today?
              </div>
            </div>

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="chat-footer">
            <Chatform
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;