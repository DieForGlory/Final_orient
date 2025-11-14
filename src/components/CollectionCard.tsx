import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
interface CollectionCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  watchCount: number;
  number?: string;
}
export function CollectionCard({
  id,
  name,
  description,
  image,
  watchCount,
  number = '01'
}: CollectionCardProps) {
  return <Link to={`/collection/${id}`} className="group block bg-white overflow-hidden reveal-up">
      <div className="relative">
        {/* Large Number Overlay */}
        <div className="absolute top-8 left-8 z-20 text-[180px] md:text-[220px] font-bold leading-none text-white/10 group-hover:text-[#C8102E]/20 transition-all duration-1000 pointer-events-none">
          {number}
        </div>

        {/* Image Section - NO grayscale filter */}
        <div className="relative h-[500px] overflow-hidden bg-black">
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          {/* Collection Name on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <h3 className="text-7xl md:text-8xl font-bold tracking-tight text-white leading-none mb-4">
              {name}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-0.5 bg-[#C8102E] group-hover:w-32 transition-all duration-700"></div>
              <span className="text-sm tracking-[0.2em] text-white/80 font-medium">
                {watchCount} МОДЕЛЕЙ
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white p-12 border-l-4 border-transparent group-hover:border-[#C8102E] transition-all duration-500">
          <p className="text-lg leading-relaxed text-black/70 mb-8 font-normal">
            {description}
          </p>

          <div className="flex items-center space-x-3 text-black group-hover:text-[#C8102E] transition-all duration-500">
            <span className="text-sm tracking-[0.15em] font-medium">
              СМОТРЕТЬ КОЛЛЕКЦИЮ
            </span>
            <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-3 transition-transform duration-500" strokeWidth={2} />
          </div>
        </div>
      </div>
    </Link>;
}