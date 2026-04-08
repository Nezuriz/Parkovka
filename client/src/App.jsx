// src/App.jsx
import { Routes, Route } from 'react-router-dom';

import Home from './home.jsx';
import Login from './pages/Login.jsx';
import DashboardLayout from './pages/DashboardLayout.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import KelolaArea from './pages/KelolaArea.jsx';
import KelolaKendaraan from './pages/KelolaKendaraan.jsx';
import KelolaUser from './pages/KelolaUser.jsx';
import KelolaTransaksi from './pages/KelolaTransaksi.jsx';
import LaporanRekap from './pages/LaporanRekap.jsx';

const App = () => {
    return ( 
        <Routes>
            {/* Rute Publik (Bisa diakses siapa saja) */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Rute Private (Hanya bisa diakses kalau sudah login) */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                
                {/* index berarti ini rute default saat user masuk ke /dashboard */}
                <Route index element={<DashboardHome />} />
                <Route path="area" element={<KelolaArea />} />  
                <Route path="kendaraan" element={<KelolaKendaraan />} />  
                <Route path="users" element={<KelolaUser />} />
                <Route path="transaksi" element={<KelolaTransaksi />} />
                <Route path="laporan" element={<LaporanRekap />} />
                
            </Route>
        </Routes>
    );
};

export default App;