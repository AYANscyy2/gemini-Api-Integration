"use client";
// import { AudioLines } from "lucide-react";
import Threads from "../reactbits/Threads";
import { useState } from "react";
import { 
  Code, 
  Text, 
  HandHelping, 
  Sparkle, 
  LogIn, 
  Menu, 
  X,
  Image,
  FileText,
  MessageSquare,
  PenTool,
  Music,
  VideoIcon,
  Calculator
} from "lucide-react";
import { Heropt } from "./herodraft";
export const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sendMessage = () => {
    console.log("hii");
  };
  const menuItems = [
    { icon: <Code className="text-blue-400" />, text: "Code" },
    { icon: <Text className="text-yellow-400" />, text: "Summarize Text" },
    { icon: <HandHelping className="text-violet-400" />, text: "Get Advice" },
    { icon: <Sparkle className="text-red-400" />, text: "Brainstorm" },
    { icon: <Image className="text-green-400" />, text: "Generate Images" },
    { icon: <FileText className="text-orange-400" />, text: "Write Content" },
    { icon: <MessageSquare className="text-pink-400" />, text: "Chat" },
    { icon: <PenTool className="text-indigo-400" />, text: "Design" },
    { icon: <Music className="text-purple-400" />, text: "Create Music" },
    { icon: <VideoIcon className="text-cyan-400" />, text: "Edit Video" },
    { icon: <Calculator className="text-emerald-400" />, text: "Math Help" }
  ];
  return (
    <>
     <div className="min-h-screen relative w-full flex justify-center bg-black">
     <div className="relative w-full" style={{ height: "100vh" }}>
<Threads amplitude={2} distance={0.1} enableMouseInteraction={true} />
</div>
        {/* Hamburger Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 text-white md:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-neutral-900 transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col p-6 mt-16 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <Heropt/>
          </div>
        </div>

        {/* Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        <div className="flex flex-col justify-center items-center absolute inset-0 px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="w-full py-10">
            <div className="h-[calc(85vh-80px)] bg-transparent bg-opacity-40 backdrop-blur-md w-full rounded-3xl px-4 text-center">
              <div className="flex flex-col w-full h-full justify-center items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-400 font-light">
                  What can I help with?
                </h1>
                <div className="hidden md:flex flex-wrap justify-center mt-10 gap-4 text-white max-w-4xl">
                  {menuItems.slice(0, 4).map((item, index) => (
                    <div 
                      key={index}
                      className="p-2 bg-neutral-800 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-neutral-700 transition-colors"
                    >
                      {item.icon}
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-[80px] mt-3 w-full bg-black rounded-3xl text-white p-[1px] text-xl shadow-lg bg-gradient-to-tl from-neutral-800 via-white to-neutral-800">
              <div className="relative w-full h-full flex justify-end items-center p-4 gap-2 bg-black rounded-3xl">
                <form onSubmit={sendMessage} className="w-full h-full flex justify-between">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full border-none focus:border-none focus:outline-0 rounded-lg p-2 flex flex-1 bg-transparent text-white"
                  />
                  <div className="cursor-pointer bg-neutral-600 hover:bg-neutral-500 transition-colors text-white h-full flex items-center p-2 rounded-lg text-[16px]">
                    Submit
                    <LogIn className="ml-2"/>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
