import React from 'react';
import { CollectionCard } from './CollectionCard';
const COLLECTIONS = [{
  id: 'sports',
  name: 'SPORTS',
  description: 'Профессиональные дайверские часы с непревзойденной надежностью и водонепроницаемостью до 200 метров. Созданы для экстремальных условий.',
  image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1600&q=80',
  watchCount: 24,
  number: '01'
}, {
  id: 'classic',
  name: 'CLASSIC',
  description: 'Элегантные часы для особых случаев, воплощающие традиции японского часового искусства. Вневременной дизайн и безупречное качество.',
  image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=80',
  watchCount: 18,
  number: '02'
}, {
  id: 'contemporary',
  name: 'CONTEMPORARY',
  description: 'Современный дизайн и инновационные технологии для активного городского образа жизни. Стиль и функциональность в одном.',
  image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80',
  watchCount: 16,
  number: '03'
}];
export function CollectionShowcase() {
  return <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Top decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 lg:mb-24 animate-fade-in">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
            <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
              КОЛЛЕКЦИИ
            </p>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black">
            Наследие
          </h2>
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {COLLECTIONS.map(collection => <div key={collection.id} className="flex-shrink-0 w-[85vw] snap-start">
                <CollectionCard {...collection} />
              </div>)}
          </div>

          {/* Scroll indicator dots */}
          <div className="flex justify-center gap-2 mt-4">
            {COLLECTIONS.map((_, index) => <div key={index} className="w-2 h-2 rounded-full bg-black/20"></div>)}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* First collection - spans full width */}
          <div className="lg:col-span-2">
            <CollectionCard {...COLLECTIONS[0]} />
          </div>

          {/* Two collections side by side */}
          {COLLECTIONS.slice(1).map(collection => <CollectionCard key={collection.id} {...collection} />)}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>;
}