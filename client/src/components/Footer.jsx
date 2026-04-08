import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-parkovka-400 text-pure-white py-3 md:py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
     
      <div className="max-w-[1920px] mx-auto px-6 flex justify-center items-center text-xs md:text-sm">
        
        <div className="tracking-wide text-center text-gray-100">
          &copy; 2026 Parkovka. All rights reserved.
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;