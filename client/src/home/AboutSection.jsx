import React from 'react';
import aboutIllustration from '../assets/about-illustration.svg';

const AboutSection = () => {
  return (
    <section id="about" className="bg-parkovka-100 min-h-screen flex items-center w-full py-16 lg:py-0">
      <div className="max-w-[1920px] w-full mx-auto px-6 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Teks About */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-1">
          <h2 className="text-3xl md:text-5xl font-bold text-parkovka-500 leading-tight">
            About Parkovka
          </h2>
          
          <div className="space-y-4 md:space-y-6 text-base md:text-xl text-pure-black font-normal leading-relaxed">
            <p>
              Parkovka is a digital solution rethinking urban mobility
              by simplifying parking management in high-traffic
              commercial areas. By connecting building managers
              and visitors through real-time data, we maximize
              parking efficiency while significantly reducing
              congestion and eliminating payment bottlenecks.
            </p>
            <p>
              Our mission is to transform the parking experience into
              a seamless digital journey. Through a streamlined
              workflow of searching, locating, and instant cashless
              payments, we ensure every visit is convenient and
              stress-free.
            </p>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center w-full order-1 lg:order-2">
          <img 
            src={aboutIllustration} 
            alt="Parkovka Digital Parking Solution Monitor" 
            className="w-full h-auto object-contain max-w-md lg:max-w-2xl mx-auto" 
          />
        </div>
        
      </div>
    </section>
  );
};

export default AboutSection;