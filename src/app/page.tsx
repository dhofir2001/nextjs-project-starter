"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import ModelDropdown from "@/components/ModelDropdown";
import SettingsModal from "@/components/SettingsModal";
import { ChatSession, Message, ChatSettings } from "@/lib/types";
import { callOpenRouterAPI } from "@/lib/openRouterApi";

const DEFAULT_MODEL = "deepseek/deepseek-r1:free";
const DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant.";

const DEFAULT_SETTINGS: ChatSettings = {
  enterToSend: true,
  showTypingIndicator: true,
  streamResponses: true,
  theme: "system",
  language: "auto"
};

export default function ChatDashboard() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat sessions and settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("chatSessions");
    const storedSettings = localStorage.getItem("chatSettings");
    
    if (stored) {
      const sessions: ChatSession[] = JSON.parse(stored);
      setChatSessions(sessions);
      if (sessions.length > 0) {
        setCurrentChatId(sessions[0].id);
      }
    }

    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Save chat sessions and settings to localStorage on change
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem("chatSettings", JSON.stringify(settings));
  }, [settings]);

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (settings.showTypingIndicator) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages, settings.showTypingIndicator]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          role: "system",
          content: DEFAULT_SYSTEM_PROMPT,
          timestamp: new Date(),
        }
      ],
      lastUpdated: Date.now(),
      systemPrompt: DEFAULT_SYSTEM_PROMPT
    };
    setChatSessions([newChat, ...chatSessions]);
    setCurrentChatId(newChat.id);
  };

  const selectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const addMessageToChat = (id: string, message: Message) => {
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              messages: [...chat.messages, message],
              lastUpdated: Date.now(),
            }
          : chat
      )
    );
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !currentChatId || loading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    addMessageToChat(currentChatId, userMessage);

    setLoading(true);
    setError("");

    if (settings.showTypingIndicator) {
      addMessageToChat(currentChatId, {
        role: "assistant",
        content: "...",
        timestamp: new Date(),
        isStreaming: true
      });
    }

    try {
      if (!currentChat) throw new Error("No current chat found");

      const responseText = await callOpenRouterAPI(
        selectedModel,
        currentChat.messages,
        settings.streamResponses
      );

      // Remove typing indicator if it exists
      if (settings.showTypingIndicator) {
        setChatSessions((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: chat.messages.filter((msg) => !msg.isStreaming),
                }
              : chat
          )
        );
      }

      const botMessage: Message = {
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };
      addMessageToChat(currentChatId, botMessage);
    } catch (err: any) {
      setError(err.message || "Failed to get a response. Please try again.");
      
      // Remove typing indicator if it exists
      if (settings.showTypingIndicator) {
        setChatSessions((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: chat.messages.filter((msg) => !msg.isStreaming),
                }
              : chat
          )
        );
      }

      // Add error message
      addMessageToChat(currentChatId, {
        role: "assistant",
        content: "An error occurred while generating the response.",
        timestamp: new Date(),
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (!currentChatId) return;
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [
                {
                  role: "system",
                  content: chat.systemPrompt || DEFAULT_SYSTEM_PROMPT,
                  timestamp: new Date()
                }
              ]
            }
          : chat
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        chats={chatSessions}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        currentChatId={currentChatId || undefined}
        onOpenSettings={() => setShowSettingsModal(true)}
      />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between border-b border-gray-700 p-4 bg-gray-800 shadow-md">
          <div className="flex items-center">
            <a 
              href="https://lynk.id/toolsmicrostock/s/ObgXNW4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="Buy me a coffee"
                width={64}
                height={64}
                className="rounded"
              />
            </a>
          </div>
          <div className="flex items-center gap-6">
            <ModelDropdown selectedModel={selectedModel} onSelect={setSelectedModel} />
            <button
              onClick={clearChat}
              className="px-5 py-2 text-sm font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              Clear Chat
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-800">
          {currentChat ? (
            <>
              <ChatHistory chatHistory={currentChat.messages} />
              <div ref={chatEndRef} />
            </>
          ) : (
            <div className="text-center text-gray-400 mt-32 text-lg">
              No chat selected. Please create a new chat.
            </div>
          )}
          {error && (
            <div className="bg-red-700 text-red-200 p-5 rounded-lg mt-6 max-w-3xl mx-auto">
              {error}
            </div>
          )}
        </main>
        <footer className="sticky bottom-0 border-t border-gray-700 bg-gray-900 p-6">
          <ChatInput 
            onSend={sendMessage} 
            disabled={!currentChatId} 
            isLoading={loading}
            enterToSend={settings.enterToSend}
          />
        </footer>
      </div>

      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}
