'use client';

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButtons from '@/components/AuthButtons';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  useEffect(() => {
    AOS.init({ 
      once: true, 
      duration: 700, 
      easing: 'ease-out-quart',
      offset: 100
    });
  }, []);

  const cards = [
    { name: 'Notes', href: '/notes', icon: '📚' },
    { name: 'Events', href: '/events', icon: '🎯' },
    { name: 'Jobs', href: '/jobs', icon: '💼' },
    { name: 'Community', href: '/community', icon: '🤝' },
    { name: 'Quizzes', href: '/quizzes', icon: '🧠' },
    { name: 'Resume Checker', href: '/resume-checker', icon: '📋' }
  ];

  return (
    <main className="min-h-screen bg-tygn-bg text-tygn-blue font-poppins">
      {/* <Header /> */}
      
      {/* Hero Section */}
      <section className="w-full bg-tygn-blue text-white text-center py-20 px-6 shadow-lg" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide uppercase mb-6" data-aos="fade-up" data-aos-delay="200">
            TechYoGeek Nirvana
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="400">
            Notes, events, jobs, community, quizzes, and career tools — all in one place for tech enthusiasts.
          </p>
          
          <div className="mt-8 space-y-4" data-aos="fade-up" data-aos-delay="600">
            <AuthButtons />
            
            <div className="mt-6">
              <a
                href="https://chat.whatsapp.com/GVwxFiceNyuKr2a3OuQFHN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-tygn-yellow text-tygn-blue font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg uppercase tracking-wide"
                data-aos="zoom-in" 
                data-aos-delay="800"
              >
                Join WhatsApp Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-tygn-blue uppercase tracking-wide mb-4">
            Explore Our Platform
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to excel in your tech journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <Link
              key={card.name}
              to={card.href}
              className="bg-white rounded-xl shadow-lg p-8 text-center border hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-tygn-blue uppercase tracking-wide group-hover:text-tygn-yellow transition-colors duration-300">
                {card.name}
              </h3>
              <div className="w-16 h-1 bg-tygn-yellow mx-auto mt-3 rounded group-hover:w-24 transition-all duration-300"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div data-aos="zoom-in" data-aos-delay="100">
              <div className="text-3xl font-bold text-tygn-blue">1000+</div>
              <div className="text-gray-600 uppercase tracking-wide">Students</div>
            </div>
            <div data-aos="zoom-in" data-aos-delay="200">
              <div className="text-3xl font-bold text-tygn-blue">500+</div>
              <div className="text-gray-600 uppercase tracking-wide">Notes</div>
            </div>
            <div data-aos="zoom-in" data-aos-delay="300">
              <div className="text-3xl font-bold text-tygn-blue">50+</div>
              <div className="text-gray-600 uppercase tracking-wide">Events</div>
            </div>
            <div data-aos="zoom-in" data-aos-delay="400">
              <div className="text-3xl font-bold text-tygn-blue">100+</div>
              <div className="text-gray-600 uppercase tracking-wide">Job Opportunities</div>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  );
}
