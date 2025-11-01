import React, { useState } from 'react';
import Swal from 'sweetalert2';
import IconSrc from '@/assets/icon.png';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import { API_ENDPOINTS, GEMINI_API_URL, GEMINI_API_KEY } from '@/utils/apiConfig';

// Definisikan tipe untuk pesan
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// Data dummy awal
const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Halo Tuan, ada yang bisa Toto bantu hari ini?',
    sender: 'bot',
  },
  {
    id: 2,
    text: 'Tolong berikan ringkasan laporan sampah di Padang.',
    sender: 'user',
  },
  {
    id: 3,
    text: 'Tentu, Tuan. Terdapat 150 laporan sampah. 80 telah diverifikasi, 50 menunggu, dan 20 ditolak. Apakah Tuan ingin melihat detailnya?',
    sender: 'bot',
  },
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const refreshToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch(API_ENDPOINTS.TOKEN_REFRESH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        return data.access;
      } else {
        console.log('Token refresh failed:', data);
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  const handleSend = async (text: string) => {
    // 1. Tambahkan pesan user
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const isAuthenticated = localStorage.getItem('isAuthenticated');

      console.log('Token from localStorage:', token);
      console.log('Is authenticated:', isAuthenticated);

      if (!token || !isAuthenticated) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please login first to use the chatbot.',
          confirmButtonColor: '#0f766e'
        });
        setIsLoading(false);
        return;
      }

      console.log('Sending request to Gemini API:', GEMINI_API_URL);
      console.log('Request body:', {
          contents: [{
            parts: [{
              text: `You are Toto, a helpful chatbot assistant for Lestari.in, an environmental monitoring platform focused on environmental health and sustainability. You help users with information about environmental reports, waste management, water quality, and environmental issues. Always respond in Indonesian language and be friendly and informative. User message: ${text}`
            }]
          }]
      });

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Toto, a helpful chatbot assistant for Lestari.in, an environmental monitoring platform focused on environmental health and sustainability. You help users with information about environmental reports, waste management, water quality, and environmental issues. Always respond in Indonesian language and be friendly and informative. User message: ${text}`
            }]
          }]
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Tambahkan pesan bot dari Gemini API
        const botText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                       'Maaf, saya tidak dapat memproses pesan Anda saat ini.';
        const botMessage: Message = {
          id: Date.now() + 1,
          text: botText,
          sender: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Handle API error
        const errorMessage = data.error?.message || 'Terjadi kesalahan saat memproses pesan.';
        const botMessage: Message = {
          id: Date.now() + 1,
          text: `Maaf, ${errorMessage}`,
          sender: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header Internal Chat (Sesuai Desain) */}
      <div className="flex items-center gap-3 p-4 bg-green-700 rounded-t-2xl">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <img src={IconSrc} alt="Lestari.in" className="w-8 h-8 object-contain" />
        </div>
        <span className="text-xl font-bold text-white">Lestar.in</span>
      </div>

      {/* Badan Chat (Bisa di-scroll) */}
      <ChatBody messages={messages} />

      {/* Input Chat */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default ChatInterface;