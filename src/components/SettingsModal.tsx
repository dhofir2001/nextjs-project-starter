"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatSettings } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}: SettingsModalProps) {

  const updateSettings = (key: keyof ChatSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white p-0">
        <DialogTitle className="border-b border-gray-700 px-6 py-4 text-xl font-semibold">
          Settings
        </DialogTitle>

        <div className="px-6 py-6 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-medium">General</h3>
              <p className="text-sm text-gray-400">Configure general settings</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <p className="text-sm text-gray-400">Choose your preferred theme</p>
                </div>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => updateSettings('theme', value)}
                >
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Press Enter to send message
                  </label>
                  <p className="text-sm text-gray-400">
                    Use Enter key to send messages (Shift+Enter for new line)
                  </p>
                </div>
                <Switch
                  checked={settings.enterToSend}
                  onCheckedChange={(checked) => updateSettings('enterToSend', checked)}
                  className="bg-gray-700"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Show typing indicator
                  </label>
                  <p className="text-sm text-gray-400">
                    Display "Assistant is typing..." while generating response
                  </p>
                </div>
                <Switch
                  checked={settings.showTypingIndicator}
                  onCheckedChange={(checked) => updateSettings('showTypingIndicator', checked)}
                  className="bg-gray-700"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Stream responses
                  </label>
                  <p className="text-sm text-gray-400">
                    Show responses as they are being generated
                  </p>
                </div>
                <Switch
                  checked={settings.streamResponses}
                  onCheckedChange={(checked) => updateSettings('streamResponses', checked)}
                  className="bg-gray-700"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <p className="text-sm text-gray-400">Choose your preferred language</p>
                </div>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => updateSettings('language', value)}
                >
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
