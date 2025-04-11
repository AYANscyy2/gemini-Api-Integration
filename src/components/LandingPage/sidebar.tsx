"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// import {FiMessageCircle} from "react-icons/fi"
import { RiMessengerLine } from "react-icons/ri";
import {
  MessageSquarePlus,
  Loader2,
  Trash2,
  ChevronLeft,
  // HomeIcon,
  AppWindow,
  ChevronRight,
  LogOutIcon
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface ChatSession {
  id: string;
  chatId: string;
  createdAt: string | { seconds: number; nanoseconds: number };
  title: string;
}

export function Sidebar() {
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const { data: session, status } = useSession();
  if (status === "loading") {
    <>loading ...</>;
  }
  useEffect(() => {
    async function fetchChatSessions() {
      try {
        setIsLoading(true);
        if (session && session.user?.email) {
          const response = await axios.get(
            `/api/firebase/chats?email=${session.user.email}`
          );
          if (response.data.sessions) {
            setChatSessions(response.data.sessions);
          }
        }
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChatSessions();
  }, [session]);

  const createNewChat = async () => {
    const chatId = uuidv4();
    router.push(`/chat/${chatId}`);
  };

  const handleDeleteChatSession = async (chatId: string) => {
    try {
      setIsDeletingId(chatId);
      const response = await axios.delete(
        `/api/firebase/chats?chatId=${chatId}`
      );

      if (response.data.success) {
        setChatSessions((prev) =>
          prev.filter((session) => session.chatId !== chatId)
        );
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeletingId(null);
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

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
        </div>
        <div className="absolute inset-0 border-t-2 border-zinc-700 rounded-full animate-pulse" />
      </div>
      <p className="text-sm text-zinc-500 animate-pulse">Loading chats...</p>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-3">
      <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
        <MessageSquarePlus size={24} className="text-zinc-400" />
      </div>
      <p className="text-sm text-zinc-500 text-center">
        No previous chats found.
        <br />
        Start a new conversation!
      </p>
    </div>
  );

  return (
    <div
      className={`h-screen bg-black/95 backdrop-blur-lg  flex flex-col border-r border-white/10 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-[100vw] md:w-80"
      }`}
    >
      <div className="relative p-4">
        <div
          className={`flex items-center gap-3 mb-6 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 transition-all duration-300"
          >
            {isHovered ? (
              isCollapsed ? (
                <ChevronRight className="text-blue-500 cursor-pointer" />
              ) : (
                <ChevronLeft className="text-blue-500 cursor-pointer" />
              )
            ) : (
              <AppWindow className="text-blue-500 cursor-pointer" />
            )}
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-semibold text-white tracking-tight">
              WiWiChat
            </h1>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={createNewChat}
            className="w-full flex cursor-pointer items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-white px-4 py-3 rounded-xl mb-8 transition-all duration-200 font-medium text-sm border border-white/5 hover:border-white/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquarePlus size={18} />
            <span>New Chat</span>
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={createNewChat}
            className="w-7 h-7 cursor-pointer rounded-full hover:scale-[1.02] active:scale-[0.98] bg-blue-500/10 flex items-center justify-center flex-shrink-0"
            title="New Chat"
          >
            <MessageSquarePlus className="text-white/[0.6]" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent px-4">
        {!isCollapsed && (
          <h2 className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider px-1">
            Previous Chats
          </h2>
        )}
        <div className="space-y-1">
          {!isCollapsed ? (
            isLoading ? (
              <>
                <LoadingState />
              </>
            ) : chatSessions.length === 0 ? (
              !isCollapsed && <EmptyState />
            ) : (
              chatSessions.map((session) => (
                <div key={session.id} className="group relative">
                  <div
                    onClick={() => router.push(`/chat/${session.chatId}`)}
                    className={`hover:bg-zinc-800/50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-white/5 ${
                      isCollapsed ? "p-2" : "p-3"
                    }`}
                    title={isCollapsed ? session.title : undefined}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        {!isCollapsed && (
                          <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors duration-200 truncate pr-8">
                            {session.title}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChatSession(session.chatId);
                          }}
                          className={`${
                            isCollapsed ? "" : "absolute right-2"
                          } opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-zinc-700/50 rounded-lg`}
                          disabled={isDeletingId === session.chatId}
                        >
                          {isDeletingId === session.chatId ? (
                            <Loader2
                              size={16}
                              className="text-zinc-400 animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={16}
                              className="text-zinc-400 hover:text-red-400 transition-colors"
                            />
                          )}
                        </button>
                      </div>
                      {!isCollapsed && (
                        <span className="text-xs text-zinc-600 mt-1">
                          {formatTimestamp(session.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <div className="rounded-full  flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] cursor-pointer  transition-all duration-300">
              <RiMessengerLine size={24} className="text-white/[0.6]" />
            </div>
          )}
        </div>{" "}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="hover:bg-red-800/15 gap-2 fixed bottom-3  rounded-xl text-red-800 flex items-center w-[90%] py-4 px-3 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-900/5"
        >
          <LogOutIcon size={18} className="text-red-800" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
