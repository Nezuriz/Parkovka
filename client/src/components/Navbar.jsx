// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // <-- Import Link di sini
import logo from '../assets/parkovka-logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'how-it-works', 'about', 'contact'];
      let current = '';

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = section;
          }
        }
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-pure-white shadow-md">
      <div className="px-6 md:px-16 py-4 flex justify-between items-center w-full max-w-[1920px] mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Parkovka Logo" className="h-8 w-8 md:h-10 md:w-10" />
          <span className="text-xl md:text-2xl font-bold text-parkovka-500 tracking-wide">
            Parkovka
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium text-pure-black">
          <a 
            href="#home" 
            className={`transition-all duration-300 ${activeSection === 'home' ? 'border-b-2 border-parkovka-500 pb-1 font-bold' : 'hover:text-parkovka-400 border-b-2 border-transparent pb-1'}`}
          >
            Home
          </a>
          <a 
            href="#how-it-works" 
            className={`transition-all duration-300 ${activeSection === 'how-it-works' ? 'border-b-2 border-parkovka-500 pb-1 font-bold' : 'hover:text-parkovka-400 border-b-2 border-transparent pb-1'}`}
          >
            How It Works
          </a>
          <a 
            href="#about" 
            className={`transition-all duration-300 ${activeSection === 'about' ? 'border-b-2 border-parkovka-500 pb-1 font-bold' : 'hover:text-parkovka-400 border-b-2 border-transparent pb-1'}`}
          >
            About
          </a>
          <a 
            href="#contact" 
            className={`transition-all duration-300 ${activeSection === 'contact' ? 'border-b-2 border-parkovka-500 pb-1 font-bold' : 'hover:text-parkovka-400 border-b-2 border-transparent pb-1'}`}
          >
            Contact Us
          </a>
          
          {/* Ubah button Login (Desktop) menjadi Link */}
          <Link 
            to="/login" 
            className="bg-parkovka-500 text-pure-white px-8 py-2.5 rounded-full hover:bg-parkovka-400 transition-colors font-semibold"
          >
            Login
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden flex items-center text-parkovka-500 focus:outline-none" 
          onClick={toggleMenu}
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`md:hidden absolute w-full bg-pure-white shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'top-[60px] opacity-100 visible' : 'top-[-200px] opacity-0 invisible'}`}>
        <div className="flex flex-col px-6 py-6 space-y-4 text-center font-medium text-pure-black border-t border-parkovka-100">
          <a 
            href="#home" 
            onClick={toggleMenu} 
            className={`${activeSection === 'home' ? 'text-parkovka-500 font-bold' : 'hover:text-parkovka-500'}`}
          >
            Home
          </a>
          <a 
            href="#how-it-works" 
            onClick={toggleMenu} 
            className={`${activeSection === 'how-it-works' ? 'text-parkovka-500 font-bold' : 'hover:text-parkovka-500'}`}
          >
            How It Works
          </a>
          <a 
            href="#about" 
            onClick={toggleMenu} 
            className={`${activeSection === 'about' ? 'text-parkovka-500 font-bold' : 'hover:text-parkovka-500'}`}
          >
            About
          </a>
          <a 
            href="#contact" 
            onClick={toggleMenu} 
            className={`${activeSection === 'contact' ? 'text-parkovka-500 font-bold' : 'hover:text-parkovka-500'}`}
          >
            Contact Us
          </a>

          {/* Ubah button Login (Mobile) menjadi Link */}
          <Link 
            to="/login" 
            onClick={toggleMenu} 
            className="bg-parkovka-500 text-pure-white block text-center px-8 py-3 rounded-full font-semibold mx-auto w-full max-w-[200px]"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;