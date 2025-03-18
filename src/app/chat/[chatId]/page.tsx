"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export default function Chat() {
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  const { chatId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [sessionDocId, setSessionDocId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
          `/api/firebase/messages?chatId=${
            chatId || "97791a1b-4fb5-4a0d-9087-a0dbfa2427da"
          }`
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
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{chatTitle || "Chat"}</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          Back to Chats
        </button>
      </div>

      <div className="flex-1 overflow-y-auto border rounded p-4 mb-4">
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-100 ml-auto max-w-[75%] text-right"
                  : "bg-gray-100 mr-auto max-w-[75%] text-left"
              }`}
            >
              <p>{message.content}</p>
              <small className="text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-l p-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
