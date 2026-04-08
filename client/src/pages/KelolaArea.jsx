// src/pages/KelolaArea.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Map, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAreas, createArea, updateArea, deleteArea } from '../service/areaService';

const KelolaArea = () => {
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Form (Tambah/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // State Input Form
  const [formData, setFormData] = useState({
    nama_area: '',
    kapasitas: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi mengambil data dari database
  const fetchAreas = async () => {
    setIsLoading(true);
    try {
      const result = await getAreas();
      setAreas(result.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // Handler membuka modal tambah
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ nama_area: '', kapasitas: '' });
    setIsModalOpen(true);
  };

  // Handler membuka modal edit
  const handleOpenEdit = (area) => {
    setIsEditMode(true);
    setEditId(area.id_area);
    setFormData({ nama_area: area.nama_area, kapasitas: area.kapasitas });
    setIsModalOpen(true);
  };

  // Handler Submit Form (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi Frontend: Kapasitas tidak boleh lebih dari 1000
    if (Number(formData.kapasitas) > 1000) {
      toast.error('Kapasitas maksimal adalah 1000 kendaraan!');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        await updateArea(editId, formData);
        toast.success('Area berhasil diperbarui!');
      } else {
        await createArea(formData);
        toast.success('Area baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchAreas(); // Refresh tabel
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus Area Menggunakan Custom Toast (Bukan Default Browser)
  const handleDelete = (id, namaArea) => {
    // Memanggil custom UI di dalam React Hot Toast
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          <div>
            <p className="font-bold text-gray-800">Hapus {namaArea}?</p>
            <p className="text-sm text-gray-500">Aksi ini tidak dapat dibatalkan.</p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Tutup toast konfirmasi
              
              // Jalankan proses delete
              try {
                await deleteArea(id);
                toast.success('Area berhasil dihapus!');
                fetchAreas(); // Refresh tabel
              } catch (error) {
                toast.error(error.message);
              }
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity, // Toast ini tidak akan hilang otomatis sampai user klik Batal/Ya
      position: 'top-center'
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-parkovka-500 flex items-center gap-2">
            <Map className="w-6 h-6" /> Kelola Area Parkir
          </h1>
          <p className="text-gray-500 text-sm mt-1">Atur lokasi dan kapasitas lahan parkir</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-parkovka-500 hover:bg-parkovka-400 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Tambah Area
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Nama Area</th>
                <th className="p-4 font-semibold">Kapasitas Maksimal</th>
                <th className="p-4 font-semibold">Terisi Saat Ini</th>
                <th className="p-4 font-semibold text-center">Sisa Slot</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-parkovka-300" />
                    Memuat data...
                  </td>
                </tr>
              ) : areas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                    Belum ada data area parkir. Silakan tambah baru.
                  </td>
                </tr>
              ) : (
                areas.map((area) => (
                  <tr key={area.id_area} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{area.nama_area}</td>
                    <td className="p-4 text-gray-600">{area.kapasitas} Kendaraan</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${area.terisi > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {area.terisi} Terisi
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-green-600">
                      {area.kapasitas - area.terisi}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(area)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(area.id_area, area.nama_area)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? 'Edit Area Parkir' : 'Tambah Area Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Nama Area</label>
                <input 
                  type="text"
                  required
                  placeholder="Misal: Lantai 1 / Basement A"
                  maxLength={30}
                  value={formData.nama_area}
                  onChange={(e) => setFormData({...formData, nama_area: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Kapasitas Kendaraan</label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="100" // Batasan maksimal input HTML
                  placeholder="Maksimal 100"
                  value={formData.kapasitas}
                  onChange={(e) => setFormData({...formData, kapasitas: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-parkovka-500 hover:bg-parkovka-400 text-white font-semibold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default KelolaArea;