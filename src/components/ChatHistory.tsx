"use client";

import { Message } from "@/lib/types";
import Image from "next/image";

interface ChatHistoryProps {
  chatHistory: Message[];
}

export default function ChatHistory({ chatHistory }: ChatHistoryProps) {
  return (
    <div className="flex flex-col space-y-4 max-w-5xl mx-auto w-full">
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-4 ${
            message.role === "user" ? "flex-row-reverse" : ""
          }`}
        >
          <div className="flex-shrink-0 w-8 h-8 mt-1">
            {message.role === "user" ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            ) : message.role === "system" ? (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="AI"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
            )}
          </div>

          <div
            className={`flex flex-col flex-grow space-y-2 ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[85%] whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-gray-700 text-white"
                  : message.role === "system"
                  ? "bg-blue-600 text-white"
                  : message.error
                  ? "bg-red-600/20 text-red-200 border border-red-600/50"
                  : "bg-gray-800 text-white"
              } ${message.isStreaming ? "animate-pulse" : ""}`}
            >
              {message.content}
              {message.error && (
                <button
                  onClick={() => {/* TODO: Implement retry */}}
                  className="mt-2 text-sm text-red-200 hover:text-red-100 underline"
                >
                  Retry
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
