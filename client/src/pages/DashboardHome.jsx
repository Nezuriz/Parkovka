import React, { useState, useEffect } from 'react';
import { Map, Car, ArrowRightLeft, FileText, Clock, LogIn, LogOut, Loader2 } from 'lucide-react';
import { getAreas } from '../service/areaService';
import { getTransaksis } from '../service/transaksiService';
import toast from 'react-hot-toast';

const DashBoardHome = () => {
  const [areas, setAreas] = useState([]);
  const [transaksis, setTransaksis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // data user
  const currentUser = JSON.parse(localStorage.getItem('user')) || { nama_lengkap: 'Administrator' };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resArea, resTrx] = await Promise.all([
        getAreas(),
        getTransaksis()
      ]);
      setAreas(resArea.data);
      setTransaksis(resTrx.data);
    } catch (error) {
      toast.error('Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  FILTER (RESET 00:00)
  const today = new Date();
  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // statistik
  const statTotalArea = areas.length;
  const statKendaraanParkir = transaksis.filter(t => t.status === 'masuk').length;
  const statTransaksiHariIni = transaksis.filter(t => isToday(t.waktu_masuk) || isToday(t.waktu_keluar)).length;
  const statTotalTransaksi = transaksis.length;

  // Log
  let todayLogs = [];
  transaksis.forEach(trx => {
    // kendaraan masuk 
    if (isToday(trx.waktu_masuk)) {
      todayLogs.push({
        id: `masuk-${trx.id_parkir}`,
        type: 'masuk',
        waktu: new Date(trx.waktu_masuk),
        pesan: `Kendaraan dengan plat nomor ${trx.plat_nomor} masuk.`,
        petugas: trx.user?.nama_lengkap || 'Petugas'
      });
    }
    // kendaraan keluar
    if (trx.status === 'keluar' && isToday(trx.waktu_keluar)) {
      todayLogs.push({
        id: `keluar-${trx.id_parkir}`,
        type: 'keluar',
        waktu: new Date(trx.waktu_keluar),
        pesan: `Kendaraan dengan plat nomor ${trx.plat_nomor} telah keluar (Checkout).`,
        petugas: trx.user?.nama_lengkap || 'Petugas'
      });
    }
  });

  // Urut log dari yang paling baru 
  todayLogs.sort((a, b) => b.waktu - a.waktu);

  // Format Jam
  const formatJam = (date) => {
    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-parkovka-500 mb-4" />
        <p className="text-gray-500 font-medium">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* HEADER WELCOME */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-2">
          Welcome back, {currentUser.nama_lengkap}! <span className="text-4xl animate-wave">👋</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Here is what's happening in your parking system today.
        </p>
      </div>

      {/* 4 KARTU STATISTIK UTAMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Area */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Map className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Area</p>
            <p className="text-3xl font-black text-gray-800">{statTotalArea}</p>
          </div>
        </div>

        {/* Card 2: Kendaraan Parkir */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Car className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Kendaraan Parkir</p>
            <p className="text-3xl font-black text-gray-800">{statKendaraanParkir}</p>
          </div>
        </div>

        {/* Card 3: Transaksi Hari Ini */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <ArrowRightLeft className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Transaksi Hari Ini</p>
            <p className="text-3xl font-black text-gray-800">{statTransaksiHariIni}</p>
          </div>
        </div>

        {/* Card 4: Total Transaksi */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Transaksi</p>
            <p className="text-3xl font-black text-gray-800">{statTotalTransaksi}</p>
          </div>
        </div>
      </div>

      {/* Section log aktivitas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-parkovka-500" /> Log Aktivitas Hari Ini
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-1">Data akan otomatis tereset pada jam 00:00</p>
          </div>
          <div className="px-3 py-1 bg-parkovka-50 text-parkovka-600 rounded-lg text-xs font-bold border border-parkovka-100">
            Live
          </div>
        </div>

        <div className="p-6">
          {todayLogs.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Belum ada aktivitas transaksi hari ini.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {todayLogs.map((log, index) => (
                <div key={log.id} className="flex gap-4 relative">
                  {/* Garis Vertikal Timeline */}
                  {index !== todayLogs.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-gray-100"></div>
                  )}
                  
                  {/* Icon Timeline */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white
                    ${log.type === 'masuk' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {log.type === 'masuk' ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                  </div>

                  {/* Konten Log */}
                  <div className="flex-1 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-gray-800">{log.pesan}</p>
                      <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                        {formatJam(log.waktu)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      Diinput oleh: <span className="text-parkovka-600">{log.petugas}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default DashBoardHome;