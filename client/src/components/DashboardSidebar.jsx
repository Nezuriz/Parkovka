import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Map, Car, ArrowRightLeft, FileText, UserCircle, LogOut, X } from 'lucide-react';
import toast from 'react-hot-toast'; 
import logo from '../assets/parkovka-logo.svg';
import { logoutUser } from '../service/authService';

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // data user localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = userData.role || 'admin'; // Default fallback ke admin

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <LogOut className="text-red-500 w-6 h-6" />
          <div>
            <p className="font-bold text-gray-800">Yakin ingin keluar?</p>
            <p className="text-sm text-gray-500">Sesi Anda akan diakhiri.</p>
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
                await logoutUser();
                localStorage.removeItem('user');
                toast.success('Berhasil logout!');
                navigate('/login');
              } catch (error) {
                toast.error('Gagal logout: ' + error.message);
              }
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  };

  // access role 
  const allMenus = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'petugas', 'owner'] },
    { name: 'Kelola User', path: '/dashboard/users', icon: <Users size={20} />, roles: ['admin'] },
    { name: 'Kelola Area', path: '/dashboard/area', icon: <Map size={20} />, roles: ['admin'] },
    { name: 'Kelola Kendaraan', path: '/dashboard/kendaraan', icon: <Car size={20} />, roles: ['admin'] },
    { name: 'Transaksi', path: '/dashboard/transaksi', icon: <ArrowRightLeft size={20} />, roles: ['admin', 'petugas'] },
    { name: 'Laporan Rekap', path: '/dashboard/laporan', icon: <FileText size={20} />, roles: ['owner'] }, // Hanya Owner
  ];

  // Filter role user 
  const permittedMenus = allMenus.filter(menu => menu.roles.includes(userRole));

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`w-64 bg-parkovka-500 text-pure-white flex flex-col h-screen shadow-xl z-50 fixed md:relative transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-parkovka-400/50">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Parkovka Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-wide">Parkovka</span>
          </div>
          
          <button 
            className="md:hidden text-parkovka-200 hover:text-white transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-col flex mt-6 px-4 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-parkovka-200 uppercase tracking-wider mb-2">
            Menu {userRole}
          </p>
          
          {/* Render menu filter */}
          {permittedMenus.map((item) => {
            const isActive = item.path === '/dashboard' 
              ? location.pathname === '/dashboard' 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-parkovka-400 text-pure-white font-semibold shadow-md' 
                    : 'text-parkovka-100 hover:bg-parkovka-400/50 hover:text-pure-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t border-parkovka-400/50 p-4 bg-parkovka-600/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <UserCircle className="w-10 h-10 text-parkovka-200 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-pure-white truncate">
                {userData.nama_lengkap || 'Administrator'}
              </p>
              <p className="text-xs font-semibold text-parkovka-200 uppercase tracking-wider">
                {userRole}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-200 hover:text-white hover:bg-red-500/80 px-4 py-2.5 rounded-xl transition-colors font-semibold"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default DashboardSidebar;