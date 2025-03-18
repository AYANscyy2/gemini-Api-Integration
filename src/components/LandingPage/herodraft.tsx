"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Link from "next/link";

interface ChatSession {
  id: string;
  chatId: string;
  createdAt: string;
  title: string;
}

export function Heropt() {
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gemini Chatbot</h1>

      <button
        onClick={createNewChat}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Start New Chat
      </button>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Previous Chats</h2>
        {isLoading ? (
          <p>Loading chat sessions...</p>
        ) : chatSessions.length === 0 ? (
          <p>No previous chats found.</p>
        ) : (
          chatSessions.map((session) => (
            <div
              key={session.id}
              className="border p-3 rounded hover:bg-gray-100"
            >
              <Link href={`/chat/${session.chatId}`}>
                <div className="cursor-pointer">
                  <span className="font-medium">{session.title}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(session.createdAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
