"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  // ArrowLeft,
  // Code,
  // Text,
  // HandHelping,
  // Sparkle,
  User,
  Bot,
  Send,
  X,
  Menu,
  // ChartBar,
  MessageSquare
} from "lucide-react";
import Threads from "@/components/reactbits/Threads";
import { menuItems } from "@/config/menu-data";
import { Heropt } from "@/components/LandingPage/herodraft";
import { ThreeDotsLoader } from "@/components/ui/three-dot-loader";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string | { seconds: number; nanoseconds: number };
}

export default function Chat() {
  // const router = useRouter();
  const params = useParams<{ chatId: string }>();
  const { chatId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [sessionDocId, setSessionDocId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [geminiResponseLoader, setGeminiResponseLoader] = useState(false);
  console.log(sessionDocId);

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

        console.log(response.data);
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

      const userMessageData = await axios.post("/api/firebase/messages", {
        chatId,
        content: newMessage,
        role: "user"
      });

      const userMessage = {
        id: userMessageData.data.id,
        chatId: chatId as string,
        content: newMessage,
        role: "user" as const,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMessage]);
      setGeminiResponseLoader(true);

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
                parts: [{ text: newMessage }]
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
      setGeminiResponseLoader(false);
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
    <div className="flex flex-col w-full h-full justify-center items-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-400 font-light mb-10">
        What can I help with?
      </h1>
      <div className="flex flex-wrap justify-center gap-4 text-white max-w-4xl">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-neutral-800 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-neutral-700 transition-colors"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative w-full flex justify-center bg-black">
      <div className="relative w-full" style={{ height: "100vh" }}>
        <Threads amplitude={2} distance={0.1} enableMouseInteraction={true} />
      </div>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-2 cursor-pointer z-50 p-2 text-white md:hidden"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full mt-20  transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Heropt />
      </div>

      <div className="flex flex-col justify-center items-center absolute inset-0 px-4 sm:px-8 md:px-16 lg:px-24">
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <div className="absolute  w-full inset-0 flex flex-col h-screen  p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-white" />
              <h1 className="text-base font-medium text-zinc-200">
                {chatTitle || "Chat"}
              </h1>
            </div>
          </div>{" "}
          <div className="h-[1px] bg-gray-600 w-full" />
          <div className="flex-1 overflow-y-auto rounded-2xl mb-4 backdrop-blur-md bg-zinc-900/30">
            <div className="p-4 space-y-6 h-full">
              {isLoading && messages.length === 0 ? (
                <div className="text-center text-zinc-500 text-sm">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <EmptyState />
              ) : (
                sortedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-center gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
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
                      className={`rounded-2xl p-3 max-w-[75%] ${
                        message.role === "user"
                          ? "bg-zinc-800 text-white"
                          : "bg-zinc-700/50 text-zinc-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="mt-1.5 text-[11px] text-zinc-500">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {geminiResponseLoader && (
                <div>
                  <ThreeDotsLoader />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="h-[80px] w-full bg-black rounded-3xl shadow-lg bg-gradient-to-tl from-neutral-800 via-zinc-400 to-neutral-800">
            <div className="relative w-full h-full flex justify-end items-center gap-2 bg-black rounded-3xl">
              <form
                onSubmit={sendMessage}
                className="w-full h-full flex items-center gap-4"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full h-12 px-4 text-sm bg-zinc-800/50 rounded-xl border border-zinc-700/50 focus:border-zinc-600 focus:outline-none text-white placeholder-zinc-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-6 flex items-center justify-center gap-2 bg-white/30 hover:bg-white/10 disabled:bg-zinc-800 disabled:cursor-not-allowed rounded-xl transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-white">
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
  );
}
