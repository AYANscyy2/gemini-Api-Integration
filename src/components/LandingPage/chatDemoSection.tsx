import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isTyping?: boolean;
}

const initialMessages: Message[] = [
  { id: 1, text: "Hello! How can I assist you today?", sender: "bot" }
];

const responses = [
  "I can definitely help you with that! Could you provide more details?",
  "Based on your query, here are some recommendations that might help you.",
  "That's an interesting question. Here's what I know about this topic.",
  "I've analyzed your request and have some insights to share.",
  "Let me check my knowledge base for the most up-to-date information on that."
];

const ChatDemoSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user"
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: "", sender: "bot", isTyping: true }
      ]);

      setTimeout(() => {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages.pop();
          newMessages.push({
            id: prevMessages.length,
            text: responses[Math.floor(Math.random() * responses.length)],
            sender: "bot"
          });

          return newMessages;
        });
      }, 1500);
    }, 500);
  };

  return (
    <section className="py-20 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            See Our Chatbot in Action
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the natural flow and intelligence of our AI chatbot with
            this interactive demo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass-morphism rounded-xl overflow-hidden">
          <div className="bg-gray-900 p-4 border-b border-gray-800 flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-400 ml-2">AI Chatbot Demo</span>
          </div>
          <div className="p-4 h-96 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] flex ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  } items-end space-x-2 ${
                    message.sender === "user" ? "space-x-reverse" : ""
                  }`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`rounded-2xl p-3 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex space-x-1 items-center px-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-700 text-white text-xs">
                        ME
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="bg-gray-800 border-gray-700"
              />
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatDemoSection;
