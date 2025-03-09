import React, { useState, useEffect } from "react";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080"); // Update port if needed

    socket.onopen = () => console.log("Connected to WebSocket");

    socket.onmessage = (event) => {
      // If the message is a Blob (e.g., image, file)
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMessages((prev) => [...prev, reader.result]); // Convert Blob to string and display
        };
        reader.readAsText(event.data);
      } else {
        // If the message is a string
        setMessages((prev) => [...prev, event.data]);
      }
    };

    socket.onerror = (error) => console.log("WebSocket Error:", error);
    socket.onclose = () => console.log("Connection closed");

    setWs(socket);

    return () => socket.close(); // Cleanup on unmount
  }, []);

  const sendMessage = () => {
    if (input && ws) {
      ws.send(input);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p> // Display the message content
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
