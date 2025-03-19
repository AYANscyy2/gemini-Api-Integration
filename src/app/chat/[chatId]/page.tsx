"use client";
import { useState, useEffect, useRef } from "react";
import type React from "react";

import { useParams } from "next/navigation";
import axios from "axios";
import { User, Bot, Send, X, Menu, MessageSquare } from "lucide-react";
import Threads from "@/components/reactbits/Threads";
import { menuItems } from "@/config/menu-data";
import { Hero } from "@/components/LandingPage/hero";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string | { seconds: number; nanoseconds: number };
}

export default function Chat() {
  const params = useParams<{ chatId: string }>();
  const { chatId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [sessionDocId, setSessionDocId] = useState<string | null>(null);
  console.log(sessionDocId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;

    async function fetchMessages() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/firebase/messages?chatId=${chatId}`
        );

        if (response.data.messages) {
          setMessages(response.data.messages);
          setChatTitle(response.data.chatTitle || "Chat");
          setSessionDocId(response.data.sessionDocId);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      setIsLoading(true);
      const userMessageContent = newMessage;
      setNewMessage(""); // Clear input immediately for better UX

      const userMessageData = await axios.post("/api/firebase/messages", {
        chatId,
        content: userMessageContent,
        role: "user"
      });

      const userMessage = {
        id: userMessageData.data.id,
        chatId: chatId as string,
        content: userMessageContent,
        role: "user" as const,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMessage]);

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: userMessageContent }]
              }
            ]
          })
        }
      );

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API Error: ${geminiResponse.statusText}`);
      }

      const geminiData = await geminiResponse.json();
      const assistantReply =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I didn't understand that.";

      const assistantMessageData = await axios.post("/api/firebase/messages", {
        chatId,
        content: assistantReply,
        role: "assistant"
      });

      const assistantMessage = {
        id: assistantMessageData.data.id,
        chatId: chatId as string,
        content: assistantReply,
        role: "assistant" as const,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const getTime = (
      timestamp: string | { seconds: number; nanoseconds: number } | undefined
    ) => {
      if (!timestamp) return 0;
      if (typeof timestamp === "string") {
        return new Date(timestamp).getTime();
      } else {
        return timestamp.seconds * 1000;
      }
    };

    return getTime(a?.timestamp) - getTime(b?.timestamp);
  });

  const formatTimestamp = (timestamp: Message["timestamp"]) => {
    if (typeof timestamp === "object" && timestamp && "seconds" in timestamp) {
      return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    } else if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleTimeString();
    }
    return "Unknown time";
  };

  const EmptyState = () => (
    <div className="flex flex-col w-full h-full justify-center items-center p-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-400 font-light mb-6 md:mb-10 text-center">
        What can I help with?
      </h1>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-white max-w-4xl">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="p-3 md:p-4 bg-neutral-800 rounded-xl flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-neutral-700 transition-colors"
          >
            {item.icon}
            <span className="text-xs sm:text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative w-full flex justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Threads amplitude={2} distance={0.1} enableMouseInteraction={true} />
      </div>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 text-white bg-zinc-800/50 rounded-full md:hidden"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isMenuOpen && (
        <div
          className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-black transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Hero />
        </div>
      )}

      <div className="relative w-full max-w-5xl mx-auto flex flex-col h-screen px-2 sm:px-4 md:px-6">
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <div className="fixed top-0 left-0 right-0 z-10 bg-black pt-3 pb-2">
          <div className="flex items-center mt-3 ml-4 gap-3 mb-2">
            <MessageSquare className="text-white" size={20} />
            <h1 className="text-base font-medium text-zinc-200 truncate">
              {chatTitle || "Chat"}
            </h1>
          </div>
          {/* <div className="h-[1px] bg-gray-600 w-full" /> */}
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto rounded-lg mt-[68px] backdrop-blur-md bg-zinc-900/30 mb-20"
        >
          <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 min-h-full">
            {isLoading && messages.length === 0 ? (
              <div className="text-center text-zinc-500 text-sm py-4">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              sortedMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 sm:gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-blue-500" : "bg-zinc-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl p-2.5 sm:p-3 max-w-[80%] sm:max-w-[75%] ${
                      message.role === "user"
                        ? "bg-zinc-800 text-white"
                        : "bg-zinc-700/50 text-zinc-200"
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <div className="mt-1 text-[10px] sm:text-[11px] text-zinc-500">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 px-2 sm:px-4 md:px-6 pb-3 pt-2 bg-black z-10">
          <div className="max-w-5xl mx-auto">
            <div className="h-[60px] sm:h-[70px] rounded-2xl shadow-lg  p-[1px]">
              <div className="relative w-full h-full flex justify-end items-center gap-2 bg-black rounded-2xl px-2">
                <form
                  onSubmit={sendMessage}
                  className="w-full h-full flex items-center gap-2 sm:gap-4"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full h-10 sm:h-12 px-3 sm:px-4 text-xs sm:text-sm bg-zinc-800/50 rounded-xl border border-zinc-700/50 focus:border-zinc-600 focus:outline-none text-white placeholder-zinc-500 transition-colors"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="h-10 sm:h-12 px-3 sm:px-6 flex items-center justify-center gap-1 sm:gap-2 bg-white/30 hover:bg-white/10 disabled:bg-zinc-800 disabled:cursor-not-allowed rounded-xl transition-colors duration-200"
                  >
                    <span className="text-xs sm:text-sm font-medium text-white hidden sm:inline">
                      {isLoading ? "Sending..." : "Send"}
                    </span>
                    <Send size={16} className="text-white" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
