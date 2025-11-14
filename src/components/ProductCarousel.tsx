import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ProductCard } from './ProductCard';
interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  isNew?: boolean;
}
interface ProductCarouselProps {
  products: Product[];
}
export function ProductCarousel({
  products
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  };
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.85;
    const targetScroll = direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 400);
  };
  return <div className="relative">
      {/* Navigation Buttons */}
      <div className="flex items-center justify-end space-x-4 mb-12">
        <button onClick={() => scroll('left')} disabled={!canScrollLeft} className={`p-4 border-2 border-black transition-all duration-500 ${canScrollLeft ? 'hover:bg-black hover:text-white cursor-pointer' : 'opacity-20 cursor-not-allowed'}`} aria-label="Предыдущий">
          <ChevronLeftIcon className="w-6 h-6" strokeWidth={2} />
        </button>
        <button onClick={() => scroll('right')} disabled={!canScrollRight} className={`p-4 border-2 border-black transition-all duration-500 ${canScrollRight ? 'hover:bg-black hover:text-white cursor-pointer' : 'opacity-20 cursor-not-allowed'}`} aria-label="Следующий">
          <ChevronRightIcon className="w-6 h-6" strokeWidth={2} />
        </button>
      </div>

      {/* Carousel Container */}
      <div ref={scrollContainerRef} onScroll={checkScroll} className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch'
    }}>
        {products.map((product, index) => <div key={product.id} className="flex-none w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] snap-start">
            <ProductCard {...product} index={index} />
          </div>)}
      </div>

      {/* Scroll Indicators */}
      <div className="flex justify-center space-x-3 mt-12">
        {Array.from({
        length: Math.ceil(products.length / 3)
      }).map((_, index) => <div key={index} className="w-2 h-2 rounded-full bg-black/30 transition-all duration-300" />)}
      </div>
    </div>;
}