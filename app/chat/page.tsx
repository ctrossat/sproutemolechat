"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [lastMessage, setLastMessage] = useState("HELLO WORLD");
//   const [messages, setMessages] = useState<Array<String>>([]);
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

  const onClick = () => {
    const inputValue = inputRef.current?.value;
    inputRef.current!.value = "";
    console.log("Emitting event F with data:", inputValue);
    socket.emit("message", inputValue);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-aroundmy-4">
        <div>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
        </div>
        <div className="flex flex-1 flex-col-reverse w-[50rem] mb-8 bg-black p-4 text-3xl font-omori border-4 border-white w-[40rem]">
            <input 
            type="text" 
            ref={inputRef} 
            className="bg-white text-black" 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                onClick();
                }
            }}
            />
            <button onClick={onClick}>Send</button>
            <div className="felx flex-col items-center">
                <p className="text-center mb-8 font-omori text-3xl">{`Last message sent: ${lastMessage}`}</p>
            </div>
        </div>
    </div>
  );
}