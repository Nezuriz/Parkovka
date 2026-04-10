import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Calendar, DollarSign, Hash, 
  Search, Printer, Loader2, TrendingUp, MapPin 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getRekapTransaksi } from '../service/transaksiService';

const LaporanRekap = () => {
  const [rekapData, setRekapData] = useState({
    total_pendapatan: 0,
    total_transaksi: 0,
    data: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // State Filter Tanggal (Default: Hari Ini)
  const todayStr = new Date().toISOString().split('T')[0];
  const [filters, setFilters] = useState({
    startDate: todayStr,
    endDate: todayStr
  });

  // Fungsi fetchRekap dengan parameter isManual
  const fetchRekap = async (isManual = false) => {
    setIsLoading(true);
    try {
      const result = await getRekapTransaksi(filters.startDate, filters.endDate);
      setRekapData(result);
      
      // Toast muncul jika klik tombol (isManual === true)
      if (isManual) {
        if (result.data.length === 0) {
          toast.error('Tidak ada transaksi di rentang tanggal ini');
        } else {
          toast.success(`Berhasil memuat ${result.total_transaksi} transaksi`);
        }
      }
    } catch (error) {
      // Error sistem ada masalah server
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data pertama kali saat halaman dibuka (tanpa toast)
  useEffect(() => {
    fetchRekap(false);
  }, []);

  // Handler saat tombol Filter diklik (dengan toast)
  const handleSearch = (e) => {
    e.preventDefault();
    fetchRekap(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
  }).format(angka || 0);

  const formatTanggal = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', { 
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 print:p-0">
      
      {/* HEADER & FILTER (Hide saat diprint) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-parkovka-500" /> Laporan Pendapatan
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Rekapitulasi keuangan dan aktivitas parkir</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3 w-full lg:w-auto">
          <div className="space-y-1.5 flex-1 sm:flex-none">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Dari Tanggal</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="date" value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 font-semibold text-gray-700 shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5 flex-1 sm:flex-none">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Sampai Tanggal</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="date" value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 font-semibold text-gray-700 shadow-sm"
              />
            </div>
          </div>
          <button 
            type="submit" disabled={isLoading}
            className="bg-parkovka-500 hover:bg-parkovka-400 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search size={20} />}
            <span>Filter</span>
          </button>
          <button 
            type="button" onClick={handlePrint}
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Printer size={20} />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </form>
      </div>

      {/* HEADER KHUSUS PRINT */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-black uppercase">Laporan Parkovka</h1>
        <p className="font-bold">Periode: {filters.startDate} s/d {filters.endDate}</p>
      </div>

      {/* KARTU STATISTIK (HIGHLIGHT OWNER) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-parkovka-500 to-parkovka-600 rounded-3xl p-8 text-white shadow-xl shadow-parkovka-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <DollarSign className="w-8 h-8" />
              </div>
              <p className="font-bold text-parkovka-50 opacity-90 uppercase tracking-widest text-sm">Total Pendapatan Bersih</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black">{formatRupiah(rekapData.total_pendapatan)}</h2>
            <div className="mt-6 flex items-center gap-2 text-parkovka-100 text-sm font-semibold">
              <TrendingUp size={18} />
              <span>Berdasarkan filter tanggal terpilih</span>
            </div>
          </div>
          {/* Dekorasi Background */}
          <DollarSign className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Hash className="w-8 h-8" />
            </div>
            <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">Volume Transaksi</p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-800">{rekapData.total_transaksi} <span className="text-xl font-bold text-gray-400">Kendaraan</span></h2>
          <p className="mt-6 text-sm font-semibold text-gray-500 italic">"Data kendaraan yang telah keluar (Selesai)"</p>
        </div>
      </div>

      {/* TABEL DETAIL TRANSAKSI */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm">Rincian Riwayat Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="p-5">Waktu Keluar</th>
                <th className="p-5">Plat Nomor</th>
                <th className="p-5">Kendaraan</th>
                <th className="p-5">Area</th>
                <th className="p-5">Durasi</th>
                <th className="p-5 text-right text-parkovka-500">Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rekapData.data.map((item) => (
                <tr key={item.id_parkir} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="p-5 font-bold text-gray-600 text-sm">{formatTanggal(item.waktu_keluar)}</td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 font-black rounded-lg border border-gray-200 group-hover:bg-white transition-colors">
                      {item.plat_nomor}
                    </span>
                  </td>
                  <td className="p-5 font-bold text-gray-700">{item.jenis_kendaraan?.nama_jenis}</td>
                  <td className="p-5 font-semibold text-gray-500 flex items-center gap-1">
                    <MapPin size={14} className="text-parkovka-400" /> {item.area_parkir?.nama_area}
                  </td>
                  <td className="p-5 font-bold text-gray-800">{item.durasi_jam} Jam</td>
                  <td className="p-5 text-right font-black text-gray-800">{formatRupiah(item.biaya_total)}</td>
                </tr>
              ))}
              {rekapData.data.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <FileSpreadsheet className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold text-lg">Tidak ada data untuk periode ini.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER KHUSUS PRINT */}
      <div className="hidden print:flex justify-between mt-12 text-sm font-bold">
        <div className="text-center">
          <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        </div>
        <div className="text-center w-48 border-t-2 border-gray-800 pt-2 mt-20">
          <p>Tanda Tangan Owner</p>
        </div>
      </div>

    </div>
  );
};

export default LaporanRekap;