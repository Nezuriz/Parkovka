import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="bg-parkovka-100 min-h-screen flex items-center w-full py-16 lg:py-0">
      <div className="max-w-[1920px] w-full mx-auto px-6 md:px-24 flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-24">
        
        <div className="flex flex-col justify-center space-y-8 w-full max-w-xl text-center lg:text-left">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-parkovka-500 leading-tight mb-4">
              Get in Touch
            </h2>
            <p className="text-base md:text-xl text-pure-black font-normal leading-relaxed">
              Have questions about how Parkovka can optimize your parking management? Send us a message and our team will get back to you shortly.
            </p>
          </div>

          <div className="space-y-6 flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-parkovka-300 rounded-full flex items-center justify-center shrink-0">
                <Mail className="text-pure-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-base md:text-lg font-semibold text-parkovka-500 break-all">irregularlaziness@gmail.com</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-parkovka-300 rounded-full flex items-center justify-center shrink-0">
                <Phone className="text-pure-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-base md:text-lg font-semibold text-parkovka-500">+62 851-7977-1458</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-parkovka-300 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="text-pure-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-base md:text-lg font-semibold text-parkovka-500">Jakarta, Indonesia</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg">
          <div className="bg-pure-white w-full rounded-3xl p-6 md:p-10 shadow-sm border border-parkovka-200/50">
            <h3 className="text-xl md:text-2xl font-bold text-parkovka-500 mb-6 text-center lg:text-left">Send us a Message</h3>
            
            <form action="https://formsubmit.co/irregularlaziness@gmail.com" method="POST" className="space-y-5">
              <input type="hidden" name="_subject" value="Pesan Baru dari Landing Page Parkovka!" />
              <input type="hidden" name="_captcha" value="false" />

              <div>
                <label className="block text-sm font-semibold text-parkovka-500 mb-2">Full Name</label>
                <input type="text" name="name" required placeholder="John Doe" className="w-full bg-parkovka-100 text-pure-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-parkovka-500 mb-2">Email Address</label>
                <input type="email" name="email" required placeholder="john@example.com" className="w-full bg-parkovka-100 text-pure-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-parkovka-500 mb-2">Your Message</label>
                <textarea name="message" required rows="4" placeholder="How can we help you?" className="w-full bg-parkovka-100 text-pure-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-parkovka-300 resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-parkovka-500 text-pure-white font-bold text-base md:text-lg py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-parkovka-400 transition-colors mt-2">
                <span>Send Message</span>
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default ContactSection;