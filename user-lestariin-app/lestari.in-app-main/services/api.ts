import { API_BASE_URL, API_ENDPOINTS, API_HEADERS } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';

interface SignupData {
  email: string;
  name: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ProfileData {
  bio?: string;
}

interface ChatbotData {
  message: string;
}

interface ReportData {
  image: string; // base64 or uri
  description: string;
  latitude: number;
  longitude: number;
  prediction?: string; // AI prediction result
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

class ApiService {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: API_HEADERS,
    timeout: 10000,
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage
          AsyncStorage.removeItem('access_token');
        }
        return Promise.reject(error);
      }
    );
  }

  async signup(data: SignupData): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(API_ENDPOINTS.signup, data);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  async login(data: LoginData): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(API_ENDPOINTS.login, data);
      const { access } = response.data;
      if (access) {
        await AsyncStorage.setItem('access_token', access);
      }
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async getProfile(): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(API_ENDPOINTS.profile);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  async updateProfile(data: ProfileData): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.put(API_ENDPOINTS.profile, data);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async sendChatbotMessage(data: ChatbotData): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(API_ENDPOINTS.chatbot, data);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  async submitReport(data: ReportData): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: data.image,
        type: 'image/jpeg',
        name: 'report.jpg',
      } as any);
      formData.append('description', data.description);
      formData.append('latitude', data.latitude.toString());
      formData.append('longitude', data.longitude.toString());

      console.log('Submitting report with data:', {
        image: data.image,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      const response: AxiosResponse = await this.axiosInstance.post(API_ENDPOINTS.reports, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Report submitted successfully:', response.data);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      console.error('Report submission error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to submit report');
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
  }

  async getAllReports(): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(API_ENDPOINTS.allReports);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get all reports');
    }
  }

  async getUserReports(): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(API_ENDPOINTS.userReports);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user reports');
    }
  }

  async getLeaderboard(): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(API_ENDPOINTS.leaderboard);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get leaderboard');
    }
  }

  async redeemVoucher(voucherId: string): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(API_ENDPOINTS.redeem, { voucher_id: voucherId });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to redeem voucher');
    }
  }

  // NEW: helper untuk langsung mengambil angka points dari profile
  async getPoints(): Promise<number> {
    try {
      const profileRes = await this.getProfile();
      // asumsi backend mengembalikan { user: {...}, points: number } atau { points: number }
      const points = profileRes.data.points ?? profileRes.data.user?.points ?? 0;
      return points;
    } catch (error: any) {
      console.warn('Failed to fetch points:', error?.message || error);
      return 0;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  }
}

export const apiService = new ApiService();
