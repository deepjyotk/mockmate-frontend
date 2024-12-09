'use client';
import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

function WebSocketClient() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:9090/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connected to WebSocket server");

      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    });

    setStompClient(client);

    // Clean up on component unmount
    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("Disconnected from WebSocket server");
        });
      }
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        nickname: nickname || "Anonymous",
        content: message,
      };

      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setMessage(""); // Clear the input field after sending the message
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.nickname}:</strong> {msg.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WebSocketClient;
