import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './home/HeroSection';
import HowItWorks from './home/HowItWorks';
import About from './home/AboutSection';
import Contact from './home/ContactSection';
import Footer from './components/Footer';

function Home() {
  return (
    <div className="font-sans text-pure-black overflow-x-hidden bg-parkovka-100 min-h-screen">
      <Navbar />
      
      <main className="pt-[72px] pb-20 md:pb-16">
        <HeroSection />
        <HowItWorks />
        <About />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}

export default Home;