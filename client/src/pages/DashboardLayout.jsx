// src/pages/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react'; // Tambahan icon Hamburger

const DashboardLayout = () => {
  const isAuthenticated = localStorage.getItem('user');
  
  // State untuk mengontrol sidebar di mode Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Sidebar Kiri (Sekarang menerima props) */}
      <DashboardSidebar 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
      />

      {/* Konten Kanan */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        
        {/* --- HEADER KHUSUS MOBILE --- */}
        {/* Hanya muncul di layar kecil (md:hidden) */}
        <div className="md:hidden bg-parkovka-500 text-white p-4 flex justify-between items-center shadow-md z-10">
          <span className="text-xl font-bold tracking-wide">Parkovka</span>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 hover:bg-parkovka-400 rounded-lg transition-colors"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Area Konten Dinamis */}
        {/* Padding disesuaikan biar di HP nggak terlalu sempit */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 md:p-12">
          <Outlet /> 
        </main>
        
      </div>
    </div>
  );
};

export default DashboardLayout;