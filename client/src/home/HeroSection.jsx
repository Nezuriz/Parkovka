// src/home/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link di sini
import heroIllustration from '../assets/hero-illustration.svg';

const HeroSection = () => {
  return (
    <section id="home" className="bg-parkovka-100 min-h-[calc(100vh-80px)] flex items-center w-full">
      <div className="max-w-[1920px] w-full mx-auto px-6 md:px-24 py-12 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
        
        {/* Left Content */}
        <div className="flex flex-col justify-center space-y-4 md:space-y-6 items-center lg:items-start">
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold text-parkovka-500 leading-tight lg:leading-[1.1] lg:whitespace-nowrap">
            Find & Secure Parking <br className="hidden md:block" /> In Seconds
          </h1>
          
          <div className="w-full lg:w-fit flex flex-col pt-2 space-y-6 items-center lg:items-start">
            <p className="text-lg md:text-2xl text-pure-black font-medium">
              Your Space, Found Instantly.
            </p>
            {/* Ubah button menjadi Link */}
            <Link 
              to="/login" 
              className="bg-parkovka-300 text-pure-white text-center block text-xl md:text-2xl font-bold py-3 md:py-4 w-full max-w-[300px] lg:max-w-none rounded-full hover:bg-parkovka-400 transition-colors shadow-md"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center w-full mt-8 lg:mt-0">
          <div className="w-full max-w-md lg:max-w-2xl aspect-[4/3] flex flex-col items-center justify-center">
             <img src={heroIllustration} alt="Parkovka Map Tracking" className="w-full h-auto object-contain drop-shadow-xl" />
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;