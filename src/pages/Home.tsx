import React from 'react';
import { Hero } from '../components/Hero';
import { WatchShowcase } from '../components/WatchShowcase';
import { CollectionShowcase } from '../components/CollectionShowcase';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
export function Home() {
  return <div className="w-full bg-white">
      <Hero />
      <WatchShowcase />
      <CollectionShowcase />

      {/* Heritage Banner */}
      <section className="bg-black text-white py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Animated background lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="line-draw absolute top-1/3 left-0 right-0"></div>
          <div className="line-draw absolute top-2/3 left-0 right-0" style={{
          animationDelay: '1.5s'
        }}></div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-16 text-center space-y-8 sm:space-y-12 relative z-10">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
              <p className="text-xs tracking-[0.25em] text-[#C8102E] font-medium animate-fade-in uppercase">
                С 1950 года
              </p>
              <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight animate-fade-in-up">
              75 лет
              <br />
              мастерства
            </h2>
          </div>
          <p className="text-base sm:text-lg lg:text-xl font-normal text-white/80 leading-relaxed max-w-xl mx-auto animate-slide-in-right">
            Orient создает механические часы высочайшего качества, объединяя
            традиционное японское мастерство с современными технологиями.
          </p>
          <Link to="/history" className="group inline-flex items-center space-x-3 sm:space-x-4 border-2 border-white px-8 sm:px-12 py-4 sm:py-5 text-xs sm:text-sm tracking-[0.2em] font-medium hover:bg-white hover:text-black hover:border-[#C8102E] transition-all duration-700 animate-fade-in uppercase">
            <span>Узнать историю</span>
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform duration-500" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>;
}