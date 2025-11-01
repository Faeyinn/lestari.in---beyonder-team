import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/chatbot/ChatHeader';
import ChatInterface from '@/components/chatbot/ChatInterface';

const ChatbotPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!token || !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[calc(18rem+1.5rem)]">
        {/* Header Khusus untuk Halaman Chat */}
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />

        <motion.main
          className="flex-1 overflow-hidden p-4 md:p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-full max-w-[1600px] mx-auto">
            <ChatInterface />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default ChatbotPage;