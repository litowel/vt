import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Welcome to Vitala AI",
    description: "Your 24/7 AI Medical Assistant powered by Upfrica.africa.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "Instant Symptom Analysis",
    description: "Describe how you feel and get instant, AI-driven preliminary insights.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    title: "Image-Based Diagnosis",
    description: "Upload photos of skin conditions or injuries for advanced AI review.",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 4,
    title: "First Aid & Emergencies",
    description: "Access critical, offline-ready guides for common medical emergencies.",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 5,
    title: "Listen to Your Results",
    description: "Text-to-speech audio for accessibility and convenience on the go.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 6,
    title: "Find Nearby Clinics",
    description: "Instantly locate hospitals and healthcare facilities near you.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 7,
    title: "Secure Medical History",
    description: "Keep track of your past analyses safely and privately.",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 8,
    title: "Upgrade to Vitala Plus",
    description: "Unlock unlimited checks, image diagnostics, and priority support for just $4.99/mo.",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 9,
    title: "Become an Affiliate Partner",
    description: "Join our Health Analyzers program and earn 50% recurring commissions.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 10,
    title: "Powered by Upfrica",
    description: "Bringing advanced healthcare technology to Africa and beyond.",
    image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1200",
  }
];

export default function HomeSlider({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-8">
      <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold mb-4"
              >
                {slides[currentIndex].title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-gray-200 max-w-2xl"
              >
                {slides[currentIndex].description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => onNavigate('symptoms')}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all text-left group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">Check Symptoms</h3>
          <p className="text-gray-500 text-sm mt-2">Get an instant AI preliminary analysis.</p>
        </button>
        <button 
          onClick={() => onNavigate('premium')}
          className="bg-teal-900 p-6 rounded-2xl border border-teal-800 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">Upgrade to Premium</h3>
          <p className="text-teal-100 text-sm mt-2">Unlock image diagnosis and audio results.</p>
        </button>
        <button 
          onClick={() => onNavigate('affiliate')}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all text-left group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">Become an Affiliate</h3>
          <p className="text-gray-500 text-sm mt-2">Earn 50% recurring commissions.</p>
        </button>
      </div>
    </div>
  );
}
