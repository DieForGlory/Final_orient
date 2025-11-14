import React, { useEffect, useState } from 'react';
import { CollectionCard } from './CollectionCard';
import { publicApi } from '../services/publicApi';
interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  watchCount: number;
  number: string;
}
export function CollectionShowcase() {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  useEffect(() => {
    fetchCollections();
  }, []);
  const fetchCollections = async () => {
    try {
      const data = await publicApi.getCollections();
      setCollections(data.slice(0, 3)); // Show only first 3 collections
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>;
  }
  if (collections.length === 0) return null;
  return <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
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
            {collections.map(collection => <div key={collection.id} className="flex-shrink-0 w-[85vw] snap-start">
                <CollectionCard {...collection} />
              </div>)}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {collections.map((_, index) => <div key={index} className="w-2 h-2 rounded-full bg-black/20"></div>)}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-12">
          {collections[0] && <div className="lg:col-span-2">
              <CollectionCard {...collections[0]} />
            </div>}

          {collections.slice(1).map(collection => <CollectionCard key={collection.id} {...collection} />)}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>;
}