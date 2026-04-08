// src/pages/KelolaTransaksi.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, LogOut, CarFront, Search, 
  Loader2, Ticket, CheckCircle2, MapPin, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTransaksis, catatMasuk, catatKeluar } from '../service/transaksiService';
import { getAreas } from '../service/areaService';
import { getKendaraans } from '../service/kendaraanService';

const KelolaTransaksi = () => {
  const [transaksis, setTransaksis] = useState([]);
  const [areas, setAreas] = useState([]);
  const [kendaraans, setKendaraans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Kasir (Form Masuk)
  const [formData, setFormData] = useState({
    plat_nomor: '',
    id_area: '',
    id_jenis: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Tabel (Search, Filter, Pagination)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua'); // 'semua', 'masuk', 'keluar'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Modal Struk (Receipt)
  const [receiptData, setReceiptData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resTrx, resArea, resKendaraan] = await Promise.all([
        getTransaksis(), getAreas(), getKendaraans()
      ]);
      setTransaksis(resTrx.data);
      setAreas(resArea.data);
      setKendaraans(resKendaraan.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format Helper
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  const formatTanggal = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  // Logika Kasir: Kendaraan Masuk
  const handleMasuk = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await catatMasuk(formData);
      toast.success('Kendaraan berhasil masuk!');
      setFormData({ plat_nomor: '', id_area: '', id_jenis: '' });
      fetchData(); // Refresh data untuk update sisa kapasitas area & tabel
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logika Kasir: Kendaraan Keluar (Checkout)
  const handleKeluar = async (id_parkir) => {
    const loadingToast = toast.loading('Memproses checkout...');
    try {
      const response = await catatKeluar(id_parkir);
      toast.success('Checkout berhasil!', { id: loadingToast });
      
      // Ambil data detail transaksi dari list state + response backend untuk ditampilkan di Struk
      const trxDetail = transaksis.find(t => t.id_parkir === id_parkir);
      setReceiptData({ ...trxDetail, ...response.data }); 
      
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.message, { id: loadingToast });
    }
  };

  // --- FILTER & PAGINATION LOGIC ---
  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const filteredData = transaksis.filter((trx) => {
    const matchPlat = trx.plat_nomor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'semua' || trx.status === statusFilter;
    return matchPlat && matchStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-parkovka-500 flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6" /> Kasir Transaksi
          </h1>
          <p className="text-gray-500 text-sm mt-1">Catat kendaraan masuk dan keluar secara *real-time*</p>
        </div>
      </div>

      {/* PANEL INPUT KASIR (KENDARAAN MASUK) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-parkovka-200/60 bg-gradient-to-br from-white to-parkovka-50/30">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <CarFront className="w-5 h-5 text-parkovka-500" /> Kendaraan Masuk
        </h2>
        <form onSubmit={handleMasuk} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plat Nomor</label>
            <input 
              type="text" required placeholder="Contoh: B 1234 CDE"
              value={formData.plat_nomor}
              onChange={(e) => setFormData({...formData, plat_nomor: e.target.value.toUpperCase()})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 font-bold uppercase"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis Kendaraan</label>
            <select 
              required value={formData.id_jenis}
              onChange={(e) => setFormData({...formData, id_jenis: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 font-medium"
            >
              <option value="" disabled>-- Pilih Kendaraan --</option>
              {kendaraans.map(k => (
                <option key={k.id_jenis} value={k.id_jenis}>{k.nama_jenis} ({formatRupiah(k.tarif_per_jam)}/jam)</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Area Parkir</label>
            <select 
              required value={formData.id_area}
              onChange={(e) => setFormData({...formData, id_area: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 font-medium"
            >
              <option value="" disabled>-- Pilih Area --</option>
              {areas.map(a => {
                const isPenuh = a.terisi >= a.kapasitas;
                return (
                  <option key={a.id_area} value={a.id_area} disabled={isPenuh}>
                    {a.nama_area} {isPenuh ? '(PENUH)' : `(Tersedia: ${a.kapasitas - a.terisi})`}
                  </option>
                );
              })}
            </select>
          </div>
          <button 
            type="submit" disabled={isSubmitting}
            className="w-full px-4 py-2.5 bg-parkovka-500 hover:bg-parkovka-400 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50 h-[46px]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Ticket className="w-5 h-5" /> Cetak Tiket</>}
          </button>
        </form>
      </div>

      {/* FILTER & TABEL TRANSAKSI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex bg-gray-200/50 p-1 rounded-xl w-full sm:w-auto">
            {['semua', 'masuk', 'keluar'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg capitalize transition-all ${
                  statusFilter === status ? 'bg-white text-parkovka-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" placeholder="Cari plat nomor..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Plat Nomor & Kendaraan</th>
                <th className="p-4 font-bold">Area</th>
                <th className="p-4 font-bold">Waktu Masuk</th>
                <th className="p-4 font-bold">Biaya & Durasi</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-center">Aksi Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-parkovka-300" />Memuat...</td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-medium">Tidak ada transaksi ditemukan.</td></tr>
              ) : (
                currentItems.map((trx) => (
                  <tr key={trx.id_parkir} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-black text-gray-800 text-base">{trx.plat_nomor}</p>
                      <p className="text-xs font-semibold text-gray-500">{trx.jenis_kendaraan?.nama_jenis || '-'}</p>
                    </td>
                    <td className="p-4 font-semibold text-gray-700">{trx.area_parkir?.nama_area || '-'}</td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800 text-sm">{formatTanggal(trx.waktu_masuk)}</p>
                      {trx.status === 'keluar' && (
                        <p className="text-xs text-gray-500 mt-0.5">Keluar: {formatTanggal(trx.waktu_keluar)}</p>
                      )}
                    </td>
                    <td className="p-4">
                      {trx.status === 'keluar' ? (
                        <>
                          <p className="font-bold text-parkovka-600">{formatRupiah(trx.biaya_total)}</p>
                          <p className="text-xs font-semibold text-gray-500">{trx.durasi_jam} Jam</p>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">Sedang parkir...</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${trx.status === 'masuk' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {trx.status === 'masuk' ? (
                        <button 
                          onClick={() => handleKeluar(trx.id_parkir)}
                          className="px-4 py-1.5 bg-parkovka-500 hover:bg-parkovka-400 text-white rounded-lg text-sm font-bold transition-colors shadow-sm mx-auto flex items-center gap-2"
                        >
                          <LogOut size={16} /> Checkout
                        </button>
                      ) : (
                        <button 
                          onClick={() => setReceiptData(trx)}
                          className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors mx-auto flex items-center gap-2"
                        >
                          Lihat Struk
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center gap-2 bg-gray-50/30">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1} onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg font-bold text-sm transition-colors ${
                  currentPage === i + 1 ? 'bg-parkovka-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODAL STRUK (RECEIPT) */}
      {receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col relative">
            
            {/* Dekorasi Atas Struk */}
            <div className="h-4 bg-parkovka-500 w-full relative">
              <div className="absolute -bottom-2 w-full flex justify-around overflow-hidden">
                {[...Array(15)].map((_,i) => <div key={i} className="w-3 h-3 bg-white rounded-full"></div>)}
              </div>
            </div>

            <div className="p-8 pt-6 pb-6 text-center flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />
              <h2 className="text-xl font-black text-gray-800 tracking-wide uppercase">Parkovka</h2>
              <p className="text-sm text-gray-500 font-medium border-b border-dashed border-gray-300 pb-4 mb-4 w-full">
                Struk Pembayaran Parkir
              </p>

              <div className="w-full space-y-3 text-left text-sm mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Plat Nomor</span>
                  <span className="font-black text-lg text-gray-800">{receiptData.plat_nomor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Kendaraan</span>
                  <span className="font-bold text-gray-800">{receiptData.jenis_kendaraan?.nama_jenis || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Area</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1"><MapPin size={14}/> {receiptData.area_parkir?.nama_area || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Durasi</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1"><Clock size={14}/> {receiptData.durasi_jam} Jam</span>
                </div>
              </div>

              <div className="w-full bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Biaya</p>
                <p className="text-3xl font-black text-parkovka-600">{formatRupiah(receiptData.biaya_total)}</p>
              </div>
              
              <p className="text-xs text-gray-400 mt-6 font-medium">Terima kasih atas kunjungan Anda.</p>
            </div>

            {/* Dekorasi Bawah Struk */}
            <div className="h-4 bg-gray-100 w-full relative border-t border-dashed border-gray-300"></div>

            <button 
              onClick={() => setReceiptData(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default KelolaTransaksi;