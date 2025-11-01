import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { type Message } from './ChatInterface';

interface ChatBodyProps {
  messages: Message[];
}

const ChatBody: React.FC<ChatBodyProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Efek untuk auto-scroll ke pesan terbaru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-white"
    >
      {messages.map((msg, index) => (
        <ChatMessage key={msg.id} message={msg} delay={index * 50} />
      ))}
    </div>
  );
};

export default ChatBody;