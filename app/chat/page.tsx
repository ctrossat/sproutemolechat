"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [lastMessage, setLastMessage] = useState("HELLO WORLD");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("Connected to socket");
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      console.log("Disconnected from socket");
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", (message) => {
      console.log("Received message:", message);
      setLastMessage(message);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, []);

  const onClick = () => {
    const inputValue = inputRef.current?.value;
    console.log("Emitting event F with data:", inputValue);
    socket.emit("message", inputValue);
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <h1>{lastMessage}</h1>
        <input type="text" ref={inputRef} className="bg-white text-black"/>
      <button onClick={onClick}>click</button>
    </div>
  );
}