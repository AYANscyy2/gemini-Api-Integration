"use client";
import { useState, useEffect, useRef, JSX } from "react";
import type React from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { User, Bot, Send, X, Menu, MessageSquare, Loader2 } from "lucide-react";
import { menuItems } from "@/config/menu-data";
import { Sidebar } from "@/components/LandingPage/sidebar";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string | { seconds: number; nanoseconds: number };
}

const formatResponse = (text: string) => {
  const elements: JSX.Element[] = [];
  let currentList: { type: "ul" | "ol"; items: JSX.Element[] } | null = null;

  const closeList = () => {
    if (currentList && currentList.items.length > 0) {
      elements.push(
        currentList.type === "ul" ? (
          <ul
            key={`ul-${elements.length}`}
            className="list-disc list-inside ml-4 space-y-1.5"
          >
            {currentList.items}
          </ul>
        ) : (
          <ol
            key={`ol-${elements.length}`}
            className="list-decimal list-inside ml-4 space-y-1.5"
          >
            {currentList.items}
          </ol>
        )
      );
    }
    currentList = null;
  };

  const processLine = (line: string, index: number) => {
    let formattedLine = DOMPurify.sanitize(line.trim());

    formattedLine = formattedLine
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
    if (/^\d+\.\s/.test(formattedLine)) {
      if (!currentList || currentList.type !== "ol") {
        closeList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(
        <li key={`li-${index}`} className="pl-2">
          <span
            dangerouslySetInnerHTML={{
              __html: formattedLine.replace(/^\d+\.\s/, "")
            }}
          />
        </li>
      );
    } else if (formattedLine.startsWith("- ")) {
      if (!currentList || currentList.type !== "ul") {
        closeList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(
        <li key={`li-${index}`} className="pl-2">
          <span
            dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }}
          />
        </li>
      );
    } else {
      closeList();
      elements.push(
        <p
          key={`p-${index}`}
          className="mb-3 leading-relaxed text-zinc-200"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    }
  };

  text.split("\n").forEach(processLine);
  closeList();

  return elements;
};

export default function Chat() {
  const params = useParams<{ chatId: string }>();
  const { data: session, status } = useSession();
  const { chatId } = params;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [chatTitle, setChatTitle] = useState("");
  const [sessionDocId, setSessionDocId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log(sessionDocId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;

    async function fetchMessages() {
      try {
        setIsFetching(true);
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
        setIsFetching(false);
      }
    }

    fetchMessages();
  }, [chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || isLoading) return;

    try {
      setIsLoading(true);
      setIsTyping(true);
      const userMessageContent = newMessage;
      setNewMessage("");
      if (session && session.user?.email) {
        console.log(session.user.email);
        const userMessageData = await axios.post("/api/firebase/messages", {
          chatId,
          content: userMessageContent,
          role: "user",
          email: session.user.email
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

        const assistantMessageData = await axios.post(
          "/api/firebase/messages",
          {
            chatId,
            content: assistantReply,
            email: session.user.email,
            role: "assistant"
          }
        );

        const assistantMessage = {
          id: assistantMessageData.data.id,
          chatId: chatId as string,
          content: assistantReply,
          role: "assistant" as const,
          timestamp: new Date().toISOString()
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
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
    <div className="flex flex-col mt-[136px] w-full h-full justify-center items-center p-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-400 font-light mb-6 md:mb-10 text-center">
        What can I help with?
      </h1>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-white max-w-4xl">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="p-3 md:p-4 bg-zinc-800/50 backdrop-blur-sm rounded-xl flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-zinc-700/50 transition-all duration-200 hover:scale-105"
          >
            {item.icon}
            <span className="text-xs sm:text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <div className="absolute inset-0 border-t-2 border-white/20 rounded-full animate-pulse" />
      </div>
      <p className="text-zinc-400 text-sm animate-pulse">
        Loading conversation...
      </p>
    </div>
  );

  if (status === "loading") {
    return <>loading ....</>;
  }

  return (
    <div className="min-h-screen relative w-full flex justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black pointer-events-none" />

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="max-md:fixed top-4 right-4 z-50 p-2 text-white bg-zinc-800/50 backdrop-blur-sm rounded-full md:hidden hover:bg-zinc-700/50 transition-colors"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-full w-64 sm:w-72 bg-black/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden border-r border-white/10">
          <Sidebar />
        </div>
      )}

      <div className="relative w-full max-md:max-w-5xl mx-auto flex flex-col h-screen px-2">
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        <div className="max-md:fixed top-0 left-0 right-0 z-10 bg-black/95 backdrop-blur-lg pt-3 pb-2 border-b border-white/10">
          <div className="flex items-center mt-3 ml-4 gap-3 mb-2">
            <MessageSquare className="text-white" size={20} />
            <h1 className="text-base font-medium text-zinc-200 truncate">
              {chatTitle || "New Chat"}
            </h1>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 w-full overflow-y-auto rounded-lg my-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        >
          <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 min-h-full">
            {isFetching ? (
              <LoadingState />
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {sortedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 sm:gap-3 animate-in fade-in-0 duration-300 ${
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
                      className={`rounded-2xl p-2.5 sm:p-3 max-w-[80%] sm:max-w-[75%] shadow-lg ${
                        message.role === "user"
                          ? "bg-blue-500/10 text-white border border-blue-500/20"
                          : "bg-zinc-800/50 text-zinc-200 border border-zinc-700/50"
                      }`}
                    >
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.role === "assistant"
                          ? formatResponse(message.content)
                          : message.content}
                      </div>
                      <div className="mt-1 text-[10px] sm:text-[11px] text-zinc-500">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-2 sm:gap-3 animate-in fade-in-0 duration-300">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-zinc-700">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="rounded-2xl p-2.5 sm:p-3 bg-zinc-800/50 text-zinc-200 border border-zinc-700/50">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="max-md:fixed bottom-0 left-0 right-0 px-2 sm:px-4 md:px-6 pb-3 pt-2 bg-black/95 backdrop-blur-lg z-10 border-t border-white/10">
          <div className="max-md:max-w-5xl mx-auto">
            <div className="h-[60px] sm:h-[70px] rounded-2xl shadow-lg">
              <div className="relative w-full h-full flex justify-end items-center gap-2 rounded-2xl px-2">
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
                      className="w-full h-10 sm:h-12 px-3 sm:px-4 text-xs sm:text-sm bg-zinc-800/50 rounded-xl border border-zinc-700/50 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-500 focus:outline-none text-white placeholder-zinc-500 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !newMessage.trim()}
                    className={`h-10 sm:h-12 px-3 sm:px-6 flex items-center justify-center gap-1 sm:gap-2 rounded-xl transition-all duration-200 ${
                      isLoading || !newMessage.trim()
                        ? "bg-zinc-800/50 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium text-white hidden sm:inline">
                      {isLoading ? "Sending..." : "Send"}
                    </span>
                    {isLoading ? (
                      <Loader2 size={16} className="text-white animate-spin" />
                    ) : (
                      <Send size={16} className="text-white" />
                    )}
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
