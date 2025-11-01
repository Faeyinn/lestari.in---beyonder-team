import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = text.trim();
    if (message && !disabled) {
      onSend(message);
      setText('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-100 border-t border-gray-200"
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik Sesuatu"
          className="flex-1 w-full px-5 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-green-500 transition-colors"
        />
        <button
          type="submit"
          className="shrink-0 w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;