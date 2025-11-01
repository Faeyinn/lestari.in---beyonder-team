// API Configuration
export const API_BASE_URL = 'http://127.0.0.1:8000';

// Gemini API Configuration
export const GEMINI_API_KEY = 'AIzaSyC94uxPEVP-YTthUIafedlZ6uqUZ_NhUOY';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

// API Endpoints
export const API_ENDPOINTS = {
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login/`,
  TOKEN_REFRESH: `${API_BASE_URL}/api/token/refresh/`,
  CHATBOT: `${API_BASE_URL}/api/chatbot/`,
  REPORTS_ALL: `${API_BASE_URL}/api/reports/all/`,
  REPORTS_DETAIL: `${API_BASE_URL}/api/reports/`,
  REPORTS_USER: `${API_BASE_URL}/api/reports/user/`,
  REPORTS_VERIFY: `${API_BASE_URL}/api/reports/verify/`,
  LEADERBOARD: `${API_BASE_URL}/api/leaderboard/`,
};
