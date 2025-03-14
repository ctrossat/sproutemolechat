"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<Array<String>>([]);
  const [lastMessage, setLastMessage] = useState("HELLO WORLD");
  const [render, setRender] = useState<'msg' | 'chat'>("msg");
  const audioRef = useRef<HTMLAudioElement>(null);

  const sproutMoleUsernames = [
    "Tofu4Life",
    "SweetheartFan99",
    "MoleInLove",
    "TofuOverlord",
    "SweetTofuMole",
    "MoleBard202X",
    "EternalTofu",
    "Sweetheart4Ever",
    "TofuChefMole",
    "MoleOfLove",
    "Simp4Sweetheart",
    "TofuConnoisseur",
    "SproutyLover",
    "MoleKnightOfLove",
    "TofuCollector",
    "SweetheartDreamer",
    "MoleWithATofu",
    "TofuSnackMaster",
    "HopelessRomanticMole",
    "TofuAddicted",
    "SweetheartLover42",
    "XX_SweetMole__X",
    "MarryMeSweetheart",
    "TofuForSweetheart",
    "MolePrinceOfLove",
    "Xx_HeartMole_xX",
    "SweetDevotedMole",
    "ObsessedWithHer",
    "TofuKnight42",
    "Xx_SweetSimper_xX",
    "MoleGroom202X",
    "XX_TofuRomance__XX",
    "MoleWithARing",
    "ForeverSweetheart",
    "MarryMeNow",
    "HopelessMoleRomantic",
    "TofuFanatic99",
    "Xx_TrueLoveMole_xX",
    "SweetheartOrNothing",
    "DesperateMoleXX"
  ];

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
      setMessages((prev) => [message, ...prev]);
      setLastMessage(message);
      if (audioRef.current) {
        audioRef.current.play();
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, []);

  return (
    <div className="w-full h-full flex bg-green-500 flex-col items-center justify-top pt-20">
        <audio ref={audioRef} src="/swish.mp3" />
        <div className="flex flex-col fixed left-8 top-8">
          <p className="text-2xl">Status: {isConnected ? "connected" : "disconnected"}</p>
          <div className='mt-4 flex flex-col' onChange={(e) => {setRender((e.target as HTMLInputElement).value as 'msg' | 'chat')}}>
            <div className="flex items-center py-2 px-3 hover:bg-green-600 rounded-md">
              <input id='radio1' type="radio" value="msg" name="render" defaultChecked/>
              <label htmlFor='radio1' className="ml-2">Last message</label>
            </div>
            <div className="flex items-center py-2 px-3 hover:bg-green-600 rounded-md">
              <input id='radio2' type="radio" value="chat" name="render" />
              <label htmlFor='radio2' className="ml-2">Chat block</label>
            </div>
          </div>
        </div>

        {render === 'msg' ? (
          <span className="border-2 border-black" >
              <h1 className="bg-black p-4 text-3xl font-omori border-4 border-white w-[35rem]">{lastMessage}</h1>
          </span>
        ) : (
          <div className="border-black border-1">
          <div className="flex flex-col bg-black p-4 text-3xl font-omori border-2 border-white w-[28rem] h-[40rem] font-omori">
            <h1 className="text-center">SPROUT MOLE CHAT</h1>
            <div className='flex flex-col-reverse flex-1 overflow-y-auto mt-4'>
              {messages.map((message, index) => (
                    <p key={index} className="text-left text-2xl w-full">
                      <span className="text-gray-200 font-condensed">{`<${sproutMoleUsernames[Math.floor(Math.random() * sproutMoleUsernames.length)]}> `}</span>
                      {message}</p>
              ))}
            </div>
          </div>
          </div>
        )
        }
    </div>
  );
}