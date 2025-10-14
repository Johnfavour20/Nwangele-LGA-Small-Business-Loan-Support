import React, { useState, useEffect, useRef } from 'react';
import type { Message, User } from '../types';
import { Button } from './ui/Button';
import { ICONS } from '../constants';

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

  const SendIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  );

  return (
    <div className="flex flex-col h-[60vh]">
        <div className="p-4 border-b dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                {ICONS.message}
                Communication Log
            </h3>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg p-3 rounded-lg ${isCurrentUser ? 'bg-green-700 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm border dark:border-slate-600 rounded-bl-none'}`}>
                <p className="font-bold text-sm">{msg.senderName}</p>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-green-200' : 'text-slate-500 dark:text-slate-400'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all"
          rows={1}
        />
        <Button onClick={handleSend} className="flex-shrink-0">
          <SendIcon />
          <span className="ml-2 hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
};
