"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [lastMessage, setLastMessage] = useState("HELLO WORLD");
  const [messages, setMessages] = useState<Array<String>>([]);
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
      setMessages((prev) => [message, ...prev]);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, []);

  const onClick = () => {
    const inputValue = inputRef.current?.value;
    if (inputValue != "") {
      inputRef.current!.value = "";
      console.log("Emitting event F with data:", inputValue);
      socket.emit("message", inputValue);
    }
  };

  console.log(messages);

  return (
    <div className="h-screen flex flex-col items-center">
        <div className="absolute left-0">
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
        </div>
        <div className="flex flex-col w-[50rem] my-8">
            <input 
            type="text" 
            ref={inputRef} 
            className="bg-white text-black p-2 mb-4" 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                onClick();
                }
            }}
            />
            <button className='bg-black py-1 px-4 text-3xl font-omori border-4 border-white w-fit' onClick={onClick}>Send</button>
        </div>
          <div className="flex flex-1 flex-col items-center">
            <h2 className="font-omori text-3xl mb-5">Message history:</h2>
            {messages.map((message, index) => (
                <p key={index} className="text-left font-omori text-2xl w-full">{`> ${message}`}</p>
            ))}

          </div>
    </div>
  );
}