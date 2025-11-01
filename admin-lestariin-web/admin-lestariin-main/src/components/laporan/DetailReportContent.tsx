import React from 'react';
import { type Report } from '@/utils/reportData';
import DetailReportMap from './DetailReportMap';
import DetailReportActions from './DetailReportActions';
import { motion } from 'motion/react';

interface DetailReportContentProps {
  report: Report;
  position: [number, number];
  onStatusChange?: (newStatus: string) => void;
}

const DetailReportContent: React.FC<DetailReportContentProps> = ({
  report,
  position,
  onStatusChange,
}) => {
  // Fungsi helper warna dari ReportCard Tuan
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
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('sampah')) return 'bg-red-100 text-red-700';
    if (tagLower.includes('air')) return 'bg-blue-100 text-blue-700';
    if (tagLower.includes('anorganik')) return 'bg-orange-100 text-orange-700'; // Sesuai desain
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Kolom 1: Gambar (Lebih besar di desktop) */}
        <div className="lg:col-span-5">
          <img
            src={report.image}
            alt={report.category}
            className="w-full h-auto max-h-[75vh] object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Kolom 2: Detail (Peta, Info) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <DetailReportMap position={position} category={report.category} />

          {/* Info Pelapor */}
          <div className="text-right text-sm text-gray-500 -mt-2">
            <p className="font-semibold">{report.author}</p>
            <p>{report.date}</p>
          </div>

          {/* Detail Teks */}
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Status : </span>
              <span className="text-lg font-bold text-gray-800">
                {report.status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Kategori : </span>
              <span
                className={`text-lg font-bold ${getCategoryColor(
                  report.category
                )}`}
              >
                {report.category}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {report.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${getTagColor(
                    tag
                  )}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div>
              <span className="text-gray-600">Lokasi : </span>
              <span className="text-lg font-bold text-gray-800">
                {report.location}
              </span>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Deskripsi :</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">
                {report.description}
              </p>
            </div>
          </div>
        </div>

        {/* Kolom 3: Tombol Aksi */}
        <div className="lg:col-span-2">
          <DetailReportActions reportId={report.id} onStatusChange={onStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default DetailReportContent;