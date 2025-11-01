import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '@/utils/apiConfig';

interface DetailReportActionsProps {
  reportId: number;
  onStatusChange?: (newStatus: string) => void;
}

const DetailReportActions: React.FC<DetailReportActionsProps> = ({
  reportId,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [acted, setActed] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Menunggu Verifikasi');
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerifikasi = async () => {
    const result = await Swal.fire({
      title: 'Verifikasi Laporan',
      text: `Apakah Anda yakin ingin memverifikasi laporan #${reportId}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Verifikasi!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          Swal.fire({
            title: 'Error',
            text: 'No access token found',
            icon: 'error',
          });
          return;
        }

        const response = await fetch(`${API_ENDPOINTS.REPORTS_VERIFY}${reportId}/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setActed(true);
          setStatus('Diverifikasi');
          if (onStatusChange) {
            onStatusChange('Diverifikasi');
          }
          Swal.fire({
            title: 'Terverifikasi!',
            text: data.message || 'Laporan berhasil diverifikasi.',
            icon: 'success',
            confirmButtonColor: '#22c55e',
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            title: 'Error',
            text: errorData.error || 'Failed to verify report',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Error verifying report:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to verify report',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTolak = () => {
    Swal.fire({
      title: 'Tolak Laporan',
      text: `Apakah Anda yakin ingin menolak laporan #${reportId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Tolak!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        setStatus('Verifikasi Ditolak');
        if (onStatusChange) {
          onStatusChange('Verifikasi Ditolak');
        }
        Swal.fire({
          title: 'Ditolak!',
          text: 'Laporan telah ditolak.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-28">
      <button
        onClick={() => navigate('/laporan')}
        className="w-full px-4 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
      >
        Kembali
      </button>

      {!acted ? (
        <>
          <button
            onClick={handleVerifikasi}
            className="w-full px-4 py-2.5 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition-colors"
          >
            Verifikasi
          </button>
          <button
            onClick={handleTolak}
            className="w-full px-4 py-2.5 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition-colors"
          >
            Tolak
          </button>
        </>
      ) : (
        <button
          onClick={() => {}}
          className="w-full px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg shadow cursor-default"
        >
          Ditindaklanjuti
        </button>
      )}
    </div>
  );
};

export default DetailReportActions;