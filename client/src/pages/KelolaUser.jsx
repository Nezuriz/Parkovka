// src/pages/KelolaUser.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Users, Loader2, AlertTriangle, 
  Search, UserCircle2, ChevronLeft, ChevronRight,
  Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers, createUser, updateUser, deleteUser } from '../service/userService';

const KelolaUser = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    password: '',
    role: 'petugas',
    status_aktif: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getUsers();
      setUsers(result.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredUsers = users.filter((user) => 
    user.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setShowPassword(false);
    setFormData({ 
      nama_lengkap: '', username: '', password: '', role: 'petugas', status_aktif: true 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditMode(true);
    setShowPassword(false);
    setEditId(user.id_user);
    setFormData({ 
      nama_lengkap: user.nama_lengkap, 
      username: user.username, 
      password: '', 
      role: user.role,
      status_aktif: user.status_aktif
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { ...formData };
      if (isEditMode && !payload.password) {
        delete payload.password;
      }

      if (isEditMode) {
        await updateUser(editId, payload);
        toast.success('Data user berhasil diperbarui!');
      } else {
        await createUser(payload);
        toast.success('User baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, nama) => {
    if (id === currentUser.id_user) {
      toast.error('Anda tidak dapat menghapus akun Anda sendiri!');
      return;
    }

    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          <div>
            <p className="font-bold text-gray-800">Hapus {nama}?</p>
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
                await deleteUser(id);
                toast.success('User berhasil dihapus!');
                if (currentItems.length === 1 && currentPage > 1) {
                  setCurrentPage(prev => prev - 1);
                }
                fetchUsers();
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-parkovka-500 flex items-center gap-2">
            <Users className="w-6 h-6" /> Kelola Pengguna
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manajemen akun admin, petugas, dan owner</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari nama / username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 shadow-sm"
            />
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-parkovka-500 hover:bg-parkovka-400 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={18} /> Tambah User
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-10 h-10 animate-spin text-parkovka-300 mb-4" />
          <p className="text-gray-500 font-medium">Memuat data pengguna...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <UserCircle2 className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium text-lg">
            {searchQuery ? 'Tidak ada user yang cocok dengan pencarian.' : 'Belum ada data user.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((user) => (
              <div 
                key={user.id_user} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-parkovka-200 transition-all duration-300 relative group flex flex-col"
              >
                <div className="flex justify-between items-start mb-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                      user.role === 'owner' ? 'bg-orange-100 text-orange-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                  
                  <span className="flex h-3 w-3 relative" title={user.status_aktif ? 'Aktif' : 'Nonaktif'}>
                    {user.status_aktif && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${user.status_aktif ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </span>
                </div>

                <div className="flex flex-col items-center text-center mb-6 flex-1">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-parkovka-100 to-parkovka-200 flex items-center justify-center mb-3 text-parkovka-600 font-black text-2xl shadow-inner border-2 border-white">
                    {user.nama_lengkap.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 w-full truncate px-2" title={user.nama_lengkap}>
                    {user.nama_lengkap}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium w-full truncate px-2" title={user.username}>
                    @{user.username}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleOpenEdit(user)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-parkovka-600 bg-parkovka-50 hover:bg-parkovka-100 rounded-xl transition-colors"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id_user, user.nama_lengkap)}
                    disabled={user.id_user === currentUser.id_user}
                    className="flex-none p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-red-50"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-colors shadow-sm ${
                      currentPage === index + 1
                        ? 'bg-parkovka-500 text-white border border-parkovka-500'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Nama Lengkap</label>
                <input 
                  type="text" 
                  required 
                  minLength={3} 
                  maxLength={30} 
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Username</label>
                <input 
                  type="text" 
                  required 
                  minLength={4} 
                  maxLength={20} 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">
                  Password {isEditMode && <span className="text-xs text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                </label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required={!isEditMode}
                    minLength={6} 
                    maxLength={15} 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-4 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
                  >
                    <option value="petugas">Petugas</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <select 
                    value={formData.status_aktif}
                    onChange={(e) => setFormData({...formData, status_aktif: e.target.value === 'true'})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
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

export default KelolaUser;