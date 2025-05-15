"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  enterToSend?: boolean;
}

export default function ChatInput({ 
  onSend, 
  disabled, 
  isLoading = false,
  enterToSend = true 
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "56px";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Allow Shift+Enter for new line
        return;
      }
      if (enterToSend) {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 400)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative max-w-5xl mx-auto w-full">
      <div className="relative flex items-end w-full bg-gray-800 rounded-lg border border-gray-700 focus-within:border-gray-600 transition-colors">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={enterToSend ? "Send a message (Enter to send, Shift+Enter for new line)..." : "Send a message..."}
          disabled={disabled}
          className="min-h-[56px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-white placeholder:text-gray-400"
          style={{
            maxHeight: "400px",
          }}
        />
        <div className="absolute right-2 bottom-2">
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled || isLoading}
            className="h-8 w-8 bg-gray-700 hover:bg-gray-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2 12l7-7v4c11.953 0 11.953 12 11.953 12-1.195-2.39-3.586-4-7.171-4H9v4l-7-7z"
                />
              </svg>
            )}
          </Button>
        </div>
      </div>
      {!enterToSend && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          Press Ctrl+Enter or use the send button to send your message
        </div>
      )}
    </form>
  );
}
