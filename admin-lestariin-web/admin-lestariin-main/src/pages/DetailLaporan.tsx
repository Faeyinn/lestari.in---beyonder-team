import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import DetailReportHeader from '@/components/laporan/DetailReportHeader';
import DetailReportContent from '@/components/laporan/DetailReportContent';
import { type Report } from '@/utils/reportData';
import { API_ENDPOINTS } from '@/utils/apiConfig';

// API Report interface
interface ApiReport {
  id: number;
  image_url: string;
  description: string;
  latitude: number;
  longitude: number;
  water_classification: string;
  forest_classification: string;
  public_fire_classification: string;
  trash_classification: string;
  illegal_logging_classification: string;
  verified: boolean;
  created_at: string;
  user: {
    email: string;
    name: string;
  };
}

const DetailLaporanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No access token found');
          return;
        }

        const response = await fetch(API_ENDPOINTS.REPORTS_ALL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: ApiReport[] = await response.json();
          const report = data.find(r => r.id === parseInt(id));
          if (!report) {
            setError('Report not found');
            return;
          }

          // Convert API data to Report format
          const convertedReport: Report = {
            id: report.id,
            image: report.image_url,
            status: report.verified ? 'Terverifikasi' : 'Menunggu Verifikasi',
            category: getCategoryFromClassifications(report),
            tags: getTagsFromClassifications(report),
            location: `Lat: ${report.latitude.toFixed(4)}, Lng: ${report.longitude.toFixed(4)}`,
            description: report.description,
            author: report.user.name,
            date: new Date(report.created_at).toLocaleDateString('id-ID'),
            latitude: report.latitude,
            longitude: report.longitude,
          };

          setReport(convertedReport);
        } else {
          setError('Failed to fetch report details');
        }
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError('Error loading report details');
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [id]);

  // Helper functions to convert API classifications to category and tags
  const getCategoryFromClassifications = (data: ApiReport): string => {
    if (data.public_fire_classification && data.public_fire_classification !== 'no_fire') {
      return 'Pembakaran Hutan';
    } else if (data.illegal_logging_classification && data.illegal_logging_classification !== 'tidak_penebangan_liar') {
      return 'Penebangan Hutan';
    } else if (data.water_classification && data.water_classification !== 'Air_bersih') {
      return 'Kualitas Air';
    } else if (data.trash_classification && data.trash_classification !== 'tidak_sampah') {
      return 'Sampah';
    }
    return 'Laporan';
  };

  const getTagsFromClassifications = (data: ApiReport): string[] => {
    const tags: string[] = [];
    if (data.public_fire_classification && data.public_fire_classification !== 'no_fire') {
      tags.push('Kebakaran');
    }
    if (data.illegal_logging_classification && data.illegal_logging_classification !== 'tidak_penebangan_liar') {
      tags.push('Penebangan Liar');
    }
    if (data.water_classification && data.water_classification !== 'Air_bersih') {
      tags.push('Kualitas Air Buruk');
    }
    if (data.trash_classification && data.trash_classification !== 'tidak_sampah') {
      tags.push('Sampah');
    }
    return tags.length > 0 ? tags : ['Laporan Umum'];
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[calc(18rem+1.5rem)]">
          <DetailReportHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading report details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[calc(18rem+1.5rem)]">
          <DetailReportHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600">{error || 'Report not found'}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const position: [number, number] = [report.latitude ?? -0.103, report.longitude ?? 100.602]; // Fallback coordinates

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 overflow-hidden">
      {/* Sidebar yang sudah ada dari project Tuan */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[calc(18rem+1.5rem)]">
        {/* Header baru untuk halaman detail */}
        <DetailReportHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Konten Utama */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            <DetailReportContent report={report} position={position} onStatusChange={(newStatus) => {
              setReport(prev => prev ? { ...prev, status: newStatus } : null);
            }} />
          </div>
        </main>

        {/* Tombol Chatbot (sama seperti di halaman lain) */}
        <button className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110">
          <MessageSquare size={28} className="text-white" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </button>
      </div>
    </div>
  );
};

export default DetailLaporanPage;