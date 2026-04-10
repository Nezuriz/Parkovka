import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../assets/parkovka-logo.svg';

import { loginUser } from '../service/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // password minimal 6 karakter
    if (password.length < 6) {
      toast.error('Password minimal harus 6 karakter!');
      setIsLoading(false);
      return; 
    }

    // password maksimal 10 karakter
    if (password.length > 10) {
      toast.error('Password maksimal 10 karakter!');
      setIsLoading(false);
      return;
    }

    try {
      // API Backend
      const data = await loginUser(username, password);

      if (data.status === 'success') {
        // Toast Sukses
        toast.success('Login berhasil! Mengalihkan...');
        
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // jeda 1 detik 
        setTimeout(() => {
          navigate('/dashboard'); 
        }, 1000);
      }
    } catch (error) {
      // Toast Error
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parkovka-100 flex flex-col justify-center items-center p-6 relative">
      
      {/* Komponen Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Button Back */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-parkovka-500 font-semibold hover:text-parkovka-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:inline">Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-pure-white rounded-3xl p-8 md:p-10 shadow-lg border border-parkovka-200/40 mt-10 md:mt-0">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Parkovka Logo" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-parkovka-500">Welcome Back</h1>
          <p className="text-parkovka-400 font-medium mt-1">Please login to your account</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Input Username */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-parkovka-500 block">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-parkovka-400" />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                maxLength={15}
                className="w-full pl-11 pr-4 py-3 bg-parkovka-100/50 border border-parkovka-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 transition-all text-pure-black"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-parkovka-500 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-parkovka-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                maxLength={15}
                className="w-full pl-11 pr-12 py-3 bg-parkovka-100/50 border border-parkovka-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 transition-all text-pure-black"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-parkovka-400 hover:text-parkovka-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Tombol Submit */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-parkovka-500 text-pure-white font-bold text-lg py-3.5 rounded-xl hover:bg-parkovka-400 transition-all shadow-md mt-4 disabled:bg-parkovka-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;