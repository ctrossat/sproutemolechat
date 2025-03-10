"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";

//TODO: ADD NAMETAGE ABOVE MESSAGE, AND MAKE NAMETAG CHOOSABLE ON CHAT SIDE

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
      setLastMessage(message);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, []);

  return (
    <div className="w-full h-full flex bg-green-500 flex-col items-center justify-center">
        <p className="fixed top-0 left-0 text-2xl">Status: {isConnected ? "connected" : "disconnected"}</p>
        <span className="border-2 border-black" >
            <h1 className="bg-black p-4 text-3xl font-omori border-4 border-white w-[40rem]">{lastMessage}</h1>
        </span>
    </div>
  );
}