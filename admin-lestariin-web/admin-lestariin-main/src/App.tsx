import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'leaflet/dist/leaflet.css';

import Index from "./pages/index"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import LaporanPage from "./pages/LaporanPage"
import DetailLaporanPage from "./pages/DetailLaporan"
import ChatbotPage from "./pages/ChatbotPage"

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const accessToken = localStorage.getItem('access_token');

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  useEffect(() => {
      AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-out'
      });
    }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/laporan" element={<ProtectedRoute><LaporanPage /></ProtectedRoute>} />
        <Route path="/laporan/:id" element={<ProtectedRoute><DetailLaporanPage /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}
