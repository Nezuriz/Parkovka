import React from 'react';
import { Search, MapPin, CircleParking, Wallet } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { id: 1, title: '1. Check Slots', description: 'Check real-time capacity and available slots in the parking area.', icon: <Search className="w-10 h-10 text-pure-white" strokeWidth={2} /> },
    { id: 2, title: '2. Vehicle Entry', description: 'System records your license plate, vehicle type, and entry time.', icon: <MapPin className="w-10 h-10 text-pure-white" strokeWidth={2} /> },
    { id: 3, title: '3. Secure Park', description: 'Park your vehicle safely while the area occupancy updates.', icon: <CircleParking className="w-10 h-10 text-pure-white" strokeWidth={2} /> },
    { id: 4, title: '4. Pay & Exit', description: 'Total cost is calculated based on duration and vehicle rates.', icon: <Wallet className="w-10 h-10 text-pure-white" strokeWidth={2} /> },
  ];

  return (
    <section id="how-it-works" className="bg-parkovka-100 min-h-screen flex items-center w-full py-16 lg:py-0">
      <div className="max-w-[1920px] w-full mx-auto px-6 md:px-24">
        
        <div className="mb-10 lg:mb-12 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-parkovka-500">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step) => (
            <div key={step.id} className="bg-pure-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-parkovka-300 rounded-full flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-parkovka-500 mb-3 whitespace-nowrap">
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-parkovka-400 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;