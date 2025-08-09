import React from "react";
import Chatboaticon from "./Chatboaticon";

const ChatMessage = ({ chat }) => {
  return (
    <div
      className={`message ${
        chat.role === "model" ? "bot" : "user"
      }-message ${chat.isError ? "error" : ""}`}
    >
      {chat.role === "model" && <Chatboaticon />}
      <p className="message-text">{chat.text || "No message content"}</p>
    </div>
  );
};

export default ChatMessage;