import React, { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "motion/react";
import { API_ENDPOINTS } from "@/utils/apiConfig";

const ChartCard: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(API_ENDPOINTS.REPORTS_ALL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const reports = await response.json();

          // Group reports by day of week
          const dayGroups: { [key: string]: any } = {
            'Senin': { Sampah: 0, 'Kualitas Air': 0, 'Penebangan Hutan': 0, 'Pembakaran Hutan': 0 },
            'Selasa': { Sampah: 0, 'Kualitas Air': 0, 'Penebangan Hutan': 0, 'Pembakaran Hutan': 0 },
            'Rabu': { Sampah: 0, 'Kualitas Air': 0, 'Penebangan Hutan': 0, 'Pembakaran Hutan': 0 },
            'Kamis': { Sampah: 0, 'Kualitas Air': 0, 'Penebangan Hutan': 0, 'Pembakaran Hutan': 0 },
            'Jumat': { Sampah: 0, 'Kualitas Air': 0, 'Penebangan Hutan': 0, 'Pembakaran Hutan': 0 },
            'Sabtu': { Sampah: 0, 'Kualitas Air': 0, 'Penebangan Hutan': 0, 'Pembakaran Hutan': 0 },
            'Minggu': { Sampah: 0, 'Kualitas Air': 0, 'Penebangan Hutan': 0, 'Pembakaran Hutan': 0 },
          };

          const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

          reports.forEach((report: any) => {
            const date = new Date(report.created_at);
            const dayName = dayNames[date.getDay()];

            if (report.trash_classification && report.trash_classification !== 'tidak_sampah') {
              dayGroups[dayName].Sampah += 1;
            }
            if (report.water_classification && report.water_classification !== 'Air_bersih') {
              dayGroups[dayName]['Kualitas Air'] += 1;
            }
            if (report.illegal_logging_classification && report.illegal_logging_classification !== 'tidak_penebangan_liar') {
              dayGroups[dayName]['Penebangan Hutan'] += 1;
            }
            if (report.public_fire_classification && report.public_fire_classification !== 'no_fire') {
              dayGroups[dayName]['Pembakaran Hutan'] += 1;
            }
          });

          const data = Object.keys(dayGroups).map(day => ({
            month: day,
            ...dayGroups[day]
          }));

          setChartData(data);
        } else {
          console.error('Failed to fetch reports for chart');
        }
      } catch (error) {
        console.error('Error fetching reports for chart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const data = loading ? [
    {
      month: "Senin",
      Sampah: 0,
      "Kualitas Air": 0,
      "Penebangan Hutan": 0,
      "Pembakaran Hutan": 0,
    },
    {
      month: "Selasa",
      Sampah: 0,
      "Kualitas Air": 0,
      "Penebangan Hutan": 0,
      "Pembakaran Hutan": 0,
    },
    {
      month: "Rabu",
      Sampah: 0,
      "Kualitas Air": 0,
      "Penebangan Hutan": 0,
      "Pembakaran Hutan": 0,
    },
    {
      month: "Kamis",
      Sampah: 0,
      "Kualitas Air": 0,
      "Penebangan Hutan": 0,
      "Pembakaran Hutan": 0,
    },
    {
      month: "Jumat",
      Sampah: 0,
      "Kualitas Air": 0,
      "Penebangan Hutan": 0,
      "Pembakaran Hutan": 0,
    },
    {
      month: "Sabtu",
      Sampah: 0,
      "Kualitas Air": 0,
      "Penebangan Hutan": 0,
      "Pembakaran Hutan": 0,
    },
    {
      month: "Minggu",
      Sampah: 0,
      "Kualitas Air": 0,
      "Penebangan Hutan": 0,
      "Pembakaran Hutan": 0,
    },
  ] : chartData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-lg p-6 h-64 md:h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
        >
          <defs>
            <linearGradient id="colorSampah" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorKualitasAir" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorPenebangan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorPembakaran" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
          <Area
            type="monotone"
            dataKey="Sampah"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorSampah)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Kualitas Air"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorKualitasAir)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Penebangan Hutan"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorPenebangan)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Pembakaran Hutan"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorPembakaran)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ChartCard;