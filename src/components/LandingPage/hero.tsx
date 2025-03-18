"use client";
import { Code } from "lucide-react";
import { Text } from "lucide-react";
import { HandHelping } from "lucide-react";
import { Sparkle } from "lucide-react";
import { LogIn } from "lucide-react";
// import { AudioLines } from "lucide-react";
import Threads from "../reactbits/Threads";

export const Hero = () => {
  const sendMessage = () => {
    console.log("hii");
  };
  return (
    <>
      <div className="min-h-screen relative w-full flex justify-center bg-black">
        <div className="relative w-full" style={{ height: "100vh" }}>
          <Threads amplitude={2} distance={0.1} enableMouseInteraction={true} />
        </div>
        <div className="flex flex-col justify-center items-center absolute inset-0 px-4 sm:px-8 md:px-16 lg:px-24 ">
          <div className="w-full py-10">
            <div className="h-[calc(85vh-80px)] bg-transparent bg-opacity-4 backdrop-blur-md w-full rounded-3xl px-4 text-center">
              <div className="flex flex-col w-full h-full justify-center items-center">
                <h1 className=" text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-400 font-light">
                  What can I help with?
                </h1>
                <div className="flex flex-wrap justify-center mt-10 gap-4 text-white">
                  <div className="p-2 bg-neutral-800 rounded-xl flex items-center gap-2">
                    <Code className="text-blue-400" />
                    Code
                  </div>
                  <div className="p-2 bg-neutral-800 rounded-xl flex items-center gap-2">
                    <Text className="text-yellow-400" />
                    Summarize Text
                  </div>
                  <div className="p-2 bg-neutral-800 rounded-xl flex items-center gap-2">
                    <HandHelping className="text-violet-400" />
                    Get Advice
                  </div>
                  <div className="p-2 bg-neutral-800 rounded-xl flex items-center gap-2">
                    <Sparkle className="text-red-400" />
                    Brainstorm
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[80px] mt-3 w-full bg-black rounded-3xl text-white p-[1px] text-xl shadow-lg bg-gradient-to-tl from-blue-500 via-purple-500 to-pink-500">
              <div className="relative w-full h-full flex justify-end items-center p-4 gap-2 bg-black rounded-3xl">
                <form onSubmit={sendMessage} className="w-full">
                  <input
                    type="text"
                    // value={newMessage}
                    // onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full border-none focus:border-none focus:outline-0  rounded-l p-2"
                    // disabled={isLoading}
                  />{" "}
                  <button
                    type="submit"
                    className="absolute r-0 bg-neutral-600 p-2 rounded-2xl"
                  >
                    <LogIn className="cursor-pointer text-black" />
                  </button>
                  {/* <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                    // disabled={isLoading}
                  > */}
                  {/* {isLoading ? "Sending..." : "Send"} */}
                  {/* </button> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
