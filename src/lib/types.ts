export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
  error?: boolean;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
  systemPrompt?: string;
  mode?: ChatMode;
}

export type ChatMode = "creative" | "code" | "translator" | "default";

export interface ChatSettings {
  enterToSend: boolean;
  showTypingIndicator: boolean;
  streamResponses: boolean;
  theme: "system" | "light" | "dark";
  language: string;
}

export interface Model {
  id: string;
  name: string;
  description?: string;
  contextLength?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
}
