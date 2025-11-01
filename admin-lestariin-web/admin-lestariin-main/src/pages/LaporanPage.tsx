import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Clock, XCircle, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import Swal from "sweetalert2";
import Sidebar from "@/components/Sidebar";
import ReportHeader from "@/components/laporan/ReportHeader";
import ReportStatCard from "@/components/laporan/ReportStatCard";
import ReportCard from "@/components/laporan/ReportCard";
import Pagination from "@/components/laporan/Pagination";
import FilterModal, {
  type FilterState,
} from "@/components/laporan/FilterModal";
import { API_ENDPOINTS } from "@/utils/apiConfig";
import type { Report } from "@/utils/reportData";

const LaporanPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  const [apiReports, setApiReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

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
          // Transform API data to match Report interface
          const transformedData = data.map((item: any) => ({
            id: item.id,
            image: item.image_url,
            status: item.verified ? 'Diverifikasi' : 'Menunggu Verifikasi',
            category: item.water_classification || item.forest_classification || item.trash_classification || 'Lainnya',
            tags: [
              item.water_classification ? `Air: ${item.water_classification}` : null,
              item.forest_classification ? `Hutan: ${item.forest_classification}` : null,
              item.public_fire_classification ? `Kebakaran: ${item.public_fire_classification}` : null,
              item.trash_classification ? `Sampah: ${item.trash_classification}` : null,
              item.illegal_logging_classification ? `Penebangan: ${item.illegal_logging_classification}` : null,
            ].filter(Boolean),
            location: `${item.latitude}, ${item.longitude}`,
            description: item.description,
            author: item.user.name,
            date: new Date(item.created_at).toLocaleDateString('id-ID'),
            acted: item.verified
          }));
          setApiReports(transformedData);
        } else {
          console.error('Failed to fetch reports');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Use only API reports for real backend data
  const allReports = useMemo(() => {
    return apiReports;
  }, [apiReports]);

  // Reset ke halaman 1 ketika search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const stats = useMemo(() => {
    const total = allReports.length;
    const verified = allReports.filter(
      (r) => r.status === "Diverifikasi"
    ).length;
    const unverified = allReports.filter(
      (r) => r.status === "Menunggu Verifikasi" || r.status === "Belum Diverifikasi"
    ).length;
    const rejected = allReports.filter(
      (r) => r.status === "Verifikasi Ditolak"
    ).length;
    return { total, verified, unverified, rejected };
  }, [allReports]);

  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allReports.filter((report) => {
      // Search filter
      const matchesSearch =
        !q ||
        report.category.toLowerCase().includes(q) ||
        report.location.toLowerCase().includes(q) ||
        report.description.toLowerCase().includes(q) ||
        report.author.toLowerCase().includes(q) ||
        report.tags.some((tag) => tag.toLowerCase().includes(q));

      // Category filter
      const matchesCategory =
        !filters.category || report.category === filters.category;

      // Status filter
      const matchesStatus = !filters.status || report.status === filters.status;

      // Date filtering
      let matchesDate = true;
      if (filters.dateFrom || filters.dateTo) {
        try {
          const rDate = new Date(report.date);

          if (filters.dateFrom) {
            const from = new Date(filters.dateFrom);
            from.setHours(0, 0, 0, 0);
            matchesDate = matchesDate && rDate >= from;
          }

          if (filters.dateTo) {
            const to = new Date(filters.dateTo);
            to.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && rDate <= to;
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          matchesDate = true;
        }
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  }, [searchQuery, filters, allReports]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / itemsPerPage)
  );

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, currentPage, itemsPerPage]);

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    Swal.fire({
      title: "Export Laporan",
      text: "Pilih format export",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Excel",
      denyButtonText: "PDF",
      cancelButtonText: "Batal",
      confirmButtonColor: "#22c55e",
      denyButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Export Excel",
          text: "Export selesai",
          icon: "success",
          confirmButtonColor: "#22c55e",
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: "Export PDF",
          text: "Export selesai",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      }
    });
  };

  const statCards = [
    {
      title: "Total Laporan",
      subtitle: "Total Laporan",
      value: stats.total,
      icon: FileText,
      gradient: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
      delay: 0,
    },
    {
      title: "Diverifikasi",
      subtitle: "Laporan",
      value: stats.verified,
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
      delay: 100,
    },
    {
      title: "Belum Diverifikasi",
      subtitle: "Laporan",
      value: stats.unverified,
      icon: Clock,
      gradient: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
      delay: 200,
    },
    {
      title: "Verifikasi Ditolak",
      subtitle: "Laporan",
      value: stats.rejected,
      icon: XCircle,
      gradient: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
      delay: 300,
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[calc(18rem+1.5rem)]">
        <ReportHeader
          onMenuClick={() => setSidebarOpen(true)}
          onFilterClick={() => setFilterOpen(true)}
          onExportClick={handleExport}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full">
            {/* STAT CARDS */}
            <div className="w-full mb-6">
              <motion.div
                className="w-full lg:sticky lg:top-20 z-40 bg-transparent py-2"
                initial={{ opacity: 0, y: -8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statCards.map((stat, idx) => (
                    <ReportStatCard
                      key={idx}
                      title={stat.title}
                      subtitle={stat.subtitle}
                      value={stat.value}
                      icon={stat.icon}
                      gradient={stat.gradient}
                      delay={stat.delay}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Reports column (3/4) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Daftar Laporan
                  </h2>

                  {paginatedReports.length > 0 ? (
                    <>
                      {paginatedReports.map((report, index) => (
                        <ReportCard
                          key={report.id}
                          {...report}
                          delay={index * 50}
                        />
                      ))}

                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredReports.length}
                        itemsPerPage={itemsPerPage}
                      />
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        Tidak ada laporan yang ditemukan
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right tools panel (1/4) */}
              <aside className="lg:col-span-1">
                <div className="lg:sticky lg:top-28 space-y-4">
                  {/* Search / Filter / Export */}
                  <div className="bg-white rounded-2xl shadow-lg p-4">
                    <div className="mb-2 text-sm font-semibold text-gray-600">
                      Pencarian
                    </div>
                    <div className="relative mb-3">
                      <input
                        type="text"
                        placeholder="Telusuri Laporan"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFilterOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-gray-700"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M4 6h16M6 12h12M10 18h4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm font-medium">Filter</span>
                      </button>

                      <button
                        onClick={handleExport}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points="7 10 12 15 17 10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="12"
                            y1="15"
                            x2="12"
                            y2="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">Export</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-white rounded-2xl shadow-lg p-4">
                    <h3 className="text-sm text-gray-600 mb-2">Ringkasan</h3>
                    <div className="text-lg font-bold">
                      {filteredReports.length} laporan
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Total: {stats.total}
                      <br />
                      Diverifikasi: {stats.verified}
                      <br />
                      Menunggu: {stats.unverified}
                      <br />
                      Ditolak: {stats.rejected}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
        {/* Floating Chatbot Button - Kanan Bawah */}
        <Link
          to="/chatbot"
          className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110"
        >
          <MessageSquare size={28} className="text-white" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </Link>
      </div>

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default LaporanPage;
