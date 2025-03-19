"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";

interface ChatSession {
  id: string;
  chatId: string;
  createdAt: string | { seconds: number; nanoseconds: number };
  title: string;
}

export function Hero() {
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchChatSessions() {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/firebase/chats");
        if (response.data.sessions) {
          setChatSessions(response.data.sessions);
        }
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChatSessions();
  }, []);

  const createNewChat = async () => {
    try {
      const chatId = uuidv4();
      const response = await axios.post("/api/firebase/chats", {
        chatId,
        title: "New Chat"
      });
      if (response.data.success) {
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  useEffect(() => {
    if (pathname === "/") {
      createNewChat();
    }
  });

  const formatTimestamp = (timestamp: ChatSession["createdAt"]) => {
    let date;
    if (typeof timestamp === "object" && timestamp && "seconds" in timestamp) {
      date = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      return "Unknown date";
    }

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="w-[100vw] md:w-80 h-screen bg-black p-4 flex flex-col">
      <h1 className="text-xl font-semibold text-white mb-6 tracking-tight">
        Gemini Chatbot
      </h1>
      <button
        onClick={createNewChat}
        className="flex items-center cursor-pointer justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-3 rounded-lg mb-8 transition-colors duration-200 font-medium text-sm border border-zinc-800"
      >
        <MessageSquarePlus size={18} />
        New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
          Previous Chats
        </h2>
        <div className="space-y-1">
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading chat sessions...</p>
          ) : chatSessions.length === 0 ? (
            <p className="text-sm text-zinc-500">No previous chats found.</p>
          ) : (
            chatSessions.map((session) => (
              <Link
                key={session.id}
                href={`/chat/${session.chatId}`}
                className="block"
              >
                <div className="group cursor-pointer p-3 hover:bg-zinc-900 rounded-lg transition-colors duration-200 border-b border-zinc-900">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors duration-200">
                      {session.title}
                    </span>
                    <span className="text-xs text-zinc-600 mt-1">
                      {formatTimestamp(session.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
