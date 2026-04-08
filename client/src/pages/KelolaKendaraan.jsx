// src/pages/KelolaKendaraan.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Car, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getKendaraans, createKendaraan, updateKendaraan, deleteKendaraan } from '../service/kendaraanService';

const KelolaKendaraan = () => {
  const [kendaraans, setKendaraans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // State Input Form
  const [formData, setFormData] = useState({
    nama_jenis: '',
    tarif_per_jam: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format ke Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const fetchKendaraans = async () => {
    setIsLoading(true);
    try {
      const result = await getKendaraans();
      setKendaraans(result.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKendaraans();
  }, []);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ nama_jenis: '', tarif_per_jam: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kendaraan) => {
    setIsEditMode(true);
    setEditId(kendaraan.id_jenis);
    setFormData({ 
      nama_jenis: kendaraan.nama_jenis, 
      tarif_per_jam: kendaraan.tarif_per_jam 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (Number(formData.tarif_per_jam) < 0) {
      toast.error('Tarif tidak boleh minus!');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        await updateKendaraan(editId, formData);
        toast.success('Jenis kendaraan berhasil diperbarui!');
      } else {
        await createKendaraan(formData);
        toast.success('Jenis kendaraan baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchKendaraans();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, namaJenis) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          <div>
            <p className="font-bold text-gray-800">Hapus {namaJenis}?</p>
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
              toast.dismiss(t.id);
              try {
                await deleteKendaraan(id);
                toast.success('Jenis kendaraan berhasil dihapus!');
                fetchKendaraans();
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
    ), { duration: Infinity, position: 'top-center' });
  };

  return (
    <div className="space-y-6 relative">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-parkovka-500 flex items-center gap-2">
            <Car className="w-6 h-6" /> Kelola Jenis Kendaraan
          </h1>
          <p className="text-gray-500 text-sm mt-1">Atur kategori kendaraan dan tarif parkir per jam</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-parkovka-500 hover:bg-parkovka-400 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Tambah Kendaraan
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold w-16 text-center">No</th>
                <th className="p-4 font-semibold">Jenis Kendaraan</th>
                <th className="p-4 font-semibold">Tarif per Jam</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-parkovka-300" />
                    Memuat data...
                  </td>
                </tr>
              ) : kendaraans.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">
                    Belum ada data jenis kendaraan. Silakan tambah baru.
                  </td>
                </tr>
              ) : (
                kendaraans.map((kendaraan, index) => (
                  <tr key={kendaraan.id_jenis} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-center font-medium text-gray-500">{index + 1}</td>
                    <td className="p-4 font-bold text-gray-800">{kendaraan.nama_jenis}</td>
                    <td className="p-4 font-semibold text-parkovka-500">
                      {formatRupiah(kendaraan.tarif_per_jam)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(kendaraan)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(kendaraan.id_jenis, kendaraan.nama_jenis)}
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
                {isEditMode ? 'Edit Jenis Kendaraan' : 'Tambah Kendaraan Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Jenis Kendaraan</label>
                <input 
                  type="text"
                  required
                  placeholder="Misal: Mobil / Motor / Truk"
                  maxLength={30}
                  value={formData.nama_jenis}
                  onChange={(e) => setFormData({...formData, nama_jenis: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Tarif per Jam (Rp)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  step="500" // Supaya bisa naik/turun per kelipatan 500
                  placeholder="Misal: 5000"
                  value={formData.tarif_per_jam}
                  onChange={(e) => setFormData({...formData, tarif_per_jam: e.target.value})}
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

export default KelolaKendaraan;