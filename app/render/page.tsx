"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  type msgs = {usrname: string, msg: string};
  const [messages, setMessages] = useState<Array<msgs>>([]);
  const [lastMessage, setLastMessage] = useState("HELLO WORLD");
  const [render, setRender] = useState<'msg' | 'chat'>("msg");
  type renderType = 'sprout' | 'humphrey' | 'something';
  const [renderType, setRenderType] = useState<renderType>("sprout");
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

  const humphreyUsernames = [
    "Hummmphrey",
    "HumfreeTheLab",
    "Dr_Humph",
    "Xx_HumpBot_xX",
    "GooChefH",
    "WhaleDocHump",
    "Hum_FungiFreak",
    "HumphTheCook",
    "SlimeWhaleH",
    "MedHumpPhrey",
    "Prof_Humph",
    "Hump_Research",
    "Xx_SlimeGuru_xX",
    "SeaLabHump",
    "HumphreyLabX",
    "WitchPetHump",
    "GooeyHumph",
    "MizuchiHump",
    "MarinaHump",
    "SlimeMancerH",
    "HumpGrump",
    "GoofyPhrey",
    "BLUB_BLUB_H",
    "Xx_TooManyMe_xX",
    "HumpHungry99",
    "SLIMEYBOI_H",
    "HumphREEEEE",
    "HumpLostAgain",
    "WhaleOfTears",
    "OopsAllHumphs",
    "Hump_Oopsie",
    "Xx_GooBrain_xX",
    "HumpForgetful",
    "CryBabyHump",
    "HumpDERP",
    "HumphreyWTF",
    "BlobfishHump",
    "Dumbphrey69",
    "HumpTiredZzz",
    "BigMoodWhale"
  ];

  const fearUsernames = [
    "?????",
    "drown?",
    "Mari...",
    "B?sil",
    "lost.",
    "deep??",
    "fall!!",
    "skitter",
    "HANG?",
    "silk..",
    "s?ink",
    "WHY??",
    "NoAir",
    "legs??",
    "FALL.",
    "tied.",
    "drip?",
    "fade_",
    "gone?",
    "STAY."
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
      const usrname = renderType === 'sprout' ? sproutMoleUsernames[Math.floor(Math.random() * sproutMoleUsernames.length)] 
        : renderType === 'humphrey' ? humphreyUsernames[Math.floor(Math.random() * humphreyUsernames.length)]
        : fearUsernames[Math.floor(Math.random() * fearUsernames.length)];
      setMessages((prev) => [{usrname,msg:message}, ...prev]);
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
  }, [renderType]);

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

          <div className='mt-4 flex flex-col' onChange={(e) => {
            const value = (setRenderType((e.target as HTMLInputElement).value as renderType));}}>
              <div className="flex items-center py-2 px-3 hover:bg-green-600 rounded-md">
              <input id='radioType1' type="radio" value="sprout" name="renderType" defaultChecked/>
              <label htmlFor='radioType1' className="ml-2">Sprout Mole</label>
            </div>
            <div className="flex items-center py-2 px-3 hover:bg-green-600 rounded-md">
              <input id='radioType2' type="radio" value="humphrey" name="renderType" />
              <label htmlFor='radioType2' className="ml-2">Humphrey</label>
            </div>
            <div className="flex items-center py-2 px-3 hover:bg-green-600 rounded-md">
              <input id='radioType3' type="radio" value="something" name="renderType" />
              <label htmlFor='radioType3' className="ml-2">Something</label>
            </div>
          </div>
        </div>

        {render === 'msg' ? (
          <span className="border-2 border-black" >
              <h1 className="bg-black p-4 text-3xl font-omori border-4 border-white w-[35rem]">{lastMessage}</h1>
          </span>
        ) :  (
          <div className="border-black border-1">
          <div className="flex flex-col bg-black p-5 text-3xl font-omori border-2 border-white w-[16.55rem] h-[60rem] scrollbar-hidden">
            {renderType === 'sprout' ? (
              <h1 className="text-center mt-4 relative">
                <span className="line-through absolute text-[1.75rem] top-[-1.8rem] left-[-0.5rem] rotate-[-4deg]">SPROUT MOLE</span> 
                <span className="line-through text-[1.75rem] absolute top-[-1.8rem] left-[8rem] rotate-[-1deg]">HUMPHREY</span> 
                SPROUT MOLE CHAT</h1>
            ) 
            : renderType === 'humphrey' ? (  
              <h1 className="text-center mt-4 relative"><span className="line-through absolute top-[-1.6rem] left-[-0.5rem] rotate-[-4deg]">SPROUT MOLE</span> HUMPHREY CHAT</h1>
            ) : (
              <h1 className="text-center relative font-scared font-omori">??? CHAT</h1>
            )}
            <div className='flex flex-col-reverse flex-1 overflow-y-auto mt-4 scrollbar-hidden'>
              {messages.map((message, index) => (
                    <p key={index} className={"text-left w-full " + (renderType === 'something' ? 'font-scared text-3xl' : 'text-2xl')}>
                      <span className={"font-condensed font-omori " + (renderType === 'something' ? 'opacity-60' : 'text-gray-200')}>{`<${message.usrname}> `}</span>
                      {message.msg}</p>
              ))}
            </div>
          </div>
          </div>
        )
        }
    </div>
  );
}