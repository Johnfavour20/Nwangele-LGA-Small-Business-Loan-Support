import React, { useState, useEffect, useRef } from 'react';
import type { Message, User } from '../../types';
import { Button } from '../ui/Button';
import { ICONS } from '../../constants';

interface MessagingProps {
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string) => void;
}

export const Messaging: React.FC<MessagingProps> = ({ messages, currentUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
        <div className="p-4 border-b">
            <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                {ICONS.message}
                Communication Log
            </h3>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg p-3 rounded-lg ${isCurrentUser ? 'bg-green-700 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border rounded-bl-none'}`}>
                <p className="font-bold text-sm">{msg.senderName}</p>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-green-200' : 'text-gray-500'}`}>{msg.timestamp}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white flex items-center gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all"
          rows={1}
        />
        <Button onClick={handleSend} className="flex-shrink-0">
          {ICONS.send}
          <span className="ml-2 hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
};