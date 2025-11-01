import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Droplet, Axe, Flame, MessageSquare } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/dashboard/Header';
import StatCard from '@/components/dashboard/StatCard';
import MapView from '@/components/dashboard/MapView';
import ChartCard from '@/components/dashboard/ChartCard';
import WaterQualityCard from '@/components/dashboard/WaterQualityCard';
import { API_ENDPOINTS } from '@/utils/apiConfig';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiReports, setApiReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(API_ENDPOINTS.REPORTS_ALL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setApiReports(data);
        } else {
          console.error('Failed to fetch reports for dashboard');
        }
      } catch (error) {
        console.error('Error fetching reports for dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Calculate stats from API data
  const stats = React.useMemo(() => {
    if (loading) {
      return [
        {
          title: 'Total Laporan',
          subtitle: 'Total Laporan',
          value: 'Loading...',
          icon: FileText,
          color: 'green',
          delay: 0,
        },
        {
          title: 'Sampah',
          subtitle: 'Total Laporan',
          value: 'Loading...',
          icon: Trash2,
          color: 'green',
          delay: 100,
        },
        {
          title: 'Kualitas Air',
          subtitle: 'Total Laporan',
          value: 'Loading...',
          icon: Droplet,
          color: 'green',
          delay: 200,
        },
        {
          title: 'Penebangan Hutan',
          subtitle: 'Total Laporan',
          value: 'Loading...',
          icon: Axe,
          color: 'green',
          delay: 300,
        },
        {
          title: 'Pembakaran Hutan',
          subtitle: 'Total Laporan',
          value: 'Loading...',
          icon: Flame,
          color: 'green',
          delay: 400,
        },
      ];
    }

    const total = apiReports.length;
    const sampah = apiReports.filter(r => r.trash_classification && r.trash_classification !== 'tidak_sampah').length;
    const air = apiReports.filter(r => r.water_classification && r.water_classification !== 'Air_bersih').length;
    const penebangan = apiReports.filter(r => r.illegal_logging_classification && r.illegal_logging_classification !== 'tidak_penebangan_liar').length;
    const kebakaran = apiReports.filter(r => r.public_fire_classification && r.public_fire_classification !== 'no_fire').length;

    return [
      {
        title: 'Total Laporan',
        subtitle: 'Total Laporan',
        value: total.toString(),
        icon: FileText,
        color: 'green',
        delay: 0,
      },
      {
        title: 'Sampah',
        subtitle: 'Total Laporan',
        value: sampah.toString(),
        icon: Trash2,
        color: 'green',
        delay: 100,
      },
      {
        title: 'Kualitas Air',
        subtitle: 'Total Laporan',
        value: air.toString(),
        icon: Droplet,
        color: 'green',
        delay: 200,
      },
      {
        title: 'Penebangan Hutan',
        subtitle: 'Total Laporan',
        value: penebangan.toString(),
        icon: Axe,
        color: 'green',
        delay: 300,
      },
      {
        title: 'Pembakaran Hutan',
        subtitle: 'Total Laporan',
        value: kebakaran.toString(),
        icon: Flame,
        color: 'green',
        delay: 400,
      },
    ];
  }, [apiReports, loading]);

  return (
    <div className="flex h-screen bg-linear-to-br from-green-50 via-cyan-50 to-blue-50 overflow-hidden">
      {/* Sidebar (fixed, melayang) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[calc(18rem+1.5rem)]">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            {/* Map Section */}
            <div className="mb-6" data-aos="fade-up">
              <div className="bg-white rounded-2xl shadow-xl p-4 h-[400px] md:h-[500px]">
                <MapView />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  subtitle={stat.subtitle}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  delay={stat.delay}
                />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2">
                <ChartCard />
              </div>

              {/* Water Quality Card */}
              <div className="lg:col-span-1">
                <WaterQualityCard />
              </div>
            </div>
          </div>
        </main>

        {/* Floating Chatbot Button - Kanan Bawah */}
        <Link to='/chatbot' className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110">
          <MessageSquare size={28} className="text-white" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;