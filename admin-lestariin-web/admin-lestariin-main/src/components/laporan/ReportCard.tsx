import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'motion/react';
import { API_ENDPOINTS } from '@/utils/apiConfig';

interface ReportCardProps {
  id: number;
  image: string;
  status: string;
  category: string;
  tags: string[];
  location: string;
  description: string;
  author: string;
  date: string;
  delay?: number;
  acted?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({
  id,
  image,
  status,
  category,
  tags,
  location,
  description,
  author,
  date,
  delay = 0,
  acted = false,
}) => {
  const navigate = useNavigate();
  const [isActed, setIsActed] = useState<boolean>(Boolean(acted));
  const [localStatus, setLocalStatus] = useState<string>(status);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'sampah':
        return 'text-red-600';
      case 'kualitas air':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTagColor = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('sampah')) return 'bg-red-100 text-red-700';
    if (t.includes('air')) return 'bg-blue-100 text-blue-700';
    if (t.includes('anorganik')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handleVerifikasi = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    // Check if user is admin (you might need to store admin status in localStorage or check token)
    const token = localStorage.getItem('access_token');
    if (!token) {
      Swal.fire('Error', 'Anda tidak memiliki akses.', 'error');
      return;
    }

    Swal.fire({
      title: 'Verifikasi Laporan',
      text: `Konfirmasi verifikasi laporan #${id}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Verifikasi',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#22c55e',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_ENDPOINTS.REPORTS_VERIFY}${id}/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIsActed(true);
            setLocalStatus('Diverifikasi');
            Swal.fire('Terverifikasi', `Laporan telah diverifikasi. ${data.message}`, 'success');
          } else {
            const errorData = await response.json();
            Swal.fire('Error', errorData.error || 'Gagal memverifikasi laporan.', 'error');
          }
        } catch (error) {
          console.error('Error verifying report:', error);
          Swal.fire('Error', 'Terjadi kesalahan saat memverifikasi laporan.', 'error');
        }
      }
    });
  };

  const handleTolak = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    Swal.fire({
      title: 'Tolak Laporan',
      text: `Apakah Anda yakin menolak laporan #${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tolak',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444',
    }).then((result) => {
      if (result.isConfirmed) {
        setLocalStatus('Verifikasi Ditolak');
        Swal.fire('Ditolak', 'Laporan telah ditolak.', 'success');
      }
    });
  };

  const openDetail = () => navigate(`/laporan/${id}`);

  return (
    <motion.div
      onClick={openDetail}
      className="bg-white rounded-lg shadow p-4 mb-4 cursor-pointer hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: (delay ?? 0) / 1000 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') openDetail(); }}
    >
      <div className="flex gap-4">
        <img src={image} alt={category} className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className={`text-sm font-semibold ${getCategoryColor(category)}`}>{category}</div>
              <div className="text-xs text-gray-500">{location} · {date}</div>
            </div>

            <div className="text-sm font-bold">{localStatus}</div>
          </div>

          <p className="mt-2 text-sm text-gray-700 line-clamp-2">{description}</p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {tags.map((t) => (
              <span key={t} className={`text-xs px-2 py-1 rounded ${getTagColor(t)}`}>{t}</span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">oleh {author}</div>
            <div className="flex items-center gap-2">
              {!isActed ? (
                <>
                  <button
                    onClick={handleVerifikasi}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded-md"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    Verifikasi
                  </button>
                  <button
                    onClick={handleTolak}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-md"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    Tolak
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-md cursor-default"
                >
                  Ditindaklanjuti
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;