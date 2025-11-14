import React from 'react';
import { HeroCarousel } from './HeroCarousel';
const FEATURED_WATCHES = [{
  id: '1',
  name: 'Kamasu Automatic Diver',
  collection: 'SPORTS',
  price: 45900,
  image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80',
  isNew: true
}, {
  id: '2',
  name: 'Bambino Classic',
  collection: 'CLASSIC',
  price: 32900,
  image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80'
}, {
  id: '3',
  name: 'Mako III Automatic',
  collection: 'SPORTS',
  price: 41900,
  image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80'
}, {
  id: '4',
  name: 'Sun & Moon Classic',
  collection: 'CLASSIC',
  price: 67900,
  image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80',
  isNew: true
}, {
  id: '5',
  name: 'Ray II Automatic',
  collection: 'SPORTS',
  price: 38900,
  image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&q=80'
}, {
  id: '6',
  name: 'Defender Chronograph',
  collection: 'CONTEMPORARY',
  price: 52900,
  image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80'
}];
export function WatchShowcase() {
  return <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Top decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 lg:mb-24 animate-fade-in">
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 mb-4 sm:mb-6">
            <div className="w-8 sm:w-12 lg:w-16 h-0.5 bg-[#C8102E]"></div>
            <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
              ИЗБРАННОЕ
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-black">
            Коллекция
          </h2>
        </div>

        {/* Hero Carousel - 6 watches, 3 visible */}
        <HeroCarousel products={FEATURED_WATCHES} />
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>;
}