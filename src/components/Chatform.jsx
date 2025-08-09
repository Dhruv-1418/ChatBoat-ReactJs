import React, { useRef } from "react";

const Chatform = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    const updatedHistory = [
      ...chatHistory,
      { role: "user", text: userMessage },
    ];
    setChatHistory(updatedHistory);

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { role: "model", text: "Thinking..." },
      ]);
      generateBotResponse(updatedHistory);
    }, 600);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="message-input"
        placeholder="Message..."
        required
      />
      <button className="material-symbols-outlined">arrow_upward</button>
    </form>
  );
};

export default Chatform;