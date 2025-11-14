import React, { useState } from 'react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontalIcon, XIcon, GridIcon, ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
const CATALOG_WATCHES = [{
  id: '1',
  name: 'Kamasu Automatic Diver',
  collection: 'SPORTS',
  price: 45900,
  image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80'
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
  image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80'
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
}, {
  id: '7',
  name: 'Maestro Moon Phase',
  collection: 'CLASSIC',
  price: 89900,
  image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80'
}, {
  id: '8',
  name: 'Triton Neptune',
  collection: 'SPORTS',
  price: 71900,
  image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80'
}, {
  id: '9',
  name: 'Sentinel Automatic',
  collection: 'CLASSIC',
  price: 43900,
  image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&q=80'
}, {
  id: '10',
  name: 'Aviator Chronograph',
  collection: 'CONTEMPORARY',
  price: 58900,
  image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80'
}, {
  id: '11',
  name: 'Diver King',
  collection: 'SPORTS',
  price: 76900,
  image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=600&q=80'
}, {
  id: '12',
  name: 'Heritage Dress',
  collection: 'CLASSIC',
  price: 54900,
  image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&q=80'
}];
const ITEMS_PER_LOAD = 6;
export function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_LOAD);
  const currentWatches = CATALOG_WATCHES.slice(0, itemsToShow);
  const hasMore = itemsToShow < CATALOG_WATCHES.length;
  const loadMore = () => {
    setItemsToShow(prev => Math.min(prev + ITEMS_PER_LOAD, CATALOG_WATCHES.length));
  };
  return <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] text-white/50 font-medium mb-8 sm:mb-12">
            <Link to="/" className="hover:text-white transition-colors">
              ГЛАВНАЯ
            </Link>
            <span>/</span>
            <span className="text-white">КАТАЛОГ</span>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                ВСЕ МОДЕЛИ
              </p>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              КАТАЛОГ
              <br />
              ЧАСОВ
            </h1>

            <p className="text-base sm:text-lg lg:text-xl font-normal text-white/70 max-w-2xl">
              Откройте для себя полную коллекцию часов Orient — от классических
              моделей до современных дайверских часов
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-black/10">
              <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center space-x-2 border-2 border-black px-4 sm:px-6 py-2 sm:py-3 hover:bg-black hover:text-white transition-all duration-500 flex-1 sm:flex-initial justify-center">
                  <SlidersHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                  <span className="text-xs sm:text-sm tracking-[0.15em] font-medium uppercase">
                    Фильтры
                  </span>
                </button>

                {/* Results Count */}
                <div className="hidden sm:flex items-center space-x-3">
                  <p className="text-sm font-medium text-black">
                    {CATALOG_WATCHES.length} моделей
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                {/* View Mode Toggle - Desktop only */}
                <div className="hidden md:flex items-center border border-black/20">
                  <button onClick={() => setViewMode('grid')} className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-black text-white' : 'hover:bg-gray-50'}`} aria-label="Сетка">
                    <GridIcon className="w-5 h-5" strokeWidth={2} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-black text-white' : 'hover:bg-gray-50'}`} aria-label="Список">
                    <ListIcon className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs sm:text-sm tracking-[0.1em] font-medium border-2 border-black px-3 sm:px-6 py-2 sm:py-3 focus:outline-none focus:border-[#C8102E] bg-white cursor-pointer uppercase flex-1 sm:flex-initial">
                  <option value="popular">Популярные</option>
                  <option value="price-asc">Цена ↑</option>
                  <option value="price-desc">Цена ↓</option>
                  <option value="newest">Новинки</option>
                  <option value="name">А-Я</option>
                </select>
              </div>
            </div>

            {/* Active Filters Chips */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              <button className="flex items-center space-x-2 bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-[0.15em] font-medium hover:bg-[#C8102E] transition-colors">
                <span>SPORTS</span>
                <XIcon className="w-3 h-3" strokeWidth={2} />
              </button>
              <button className="flex items-center space-x-2 bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-[0.15em] font-medium hover:bg-[#C8102E] transition-colors">
                <span>30,000 - 50,000 ₽</span>
                <XIcon className="w-3 h-3" strokeWidth={2} />
              </button>
              <button className="text-[10px] sm:text-xs tracking-[0.15em] font-medium text-[#C8102E] hover:underline uppercase">
                Очистить все
              </button>
            </div>

            {/* Products Grid - 2 columns on mobile, 3 on desktop */}
            <div className={`grid gap-6 sm:gap-8 lg:gap-12 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {currentWatches.map((watch, index) => <ProductCard key={watch.id} {...watch} index={index} />)}
            </div>

            {/* Load More Button */}
            {hasMore && <div className="mt-12 sm:mt-20 text-center">
                <button onClick={loadMore} className="inline-flex items-center space-x-4 border-2 border-black px-8 sm:px-12 py-4 sm:py-5 text-xs sm:text-sm tracking-[0.2em] font-medium hover:bg-black hover:text-white transition-all duration-700 uppercase">
                  <span>Загрузить ещё</span>
                </button>
                <p className="text-xs sm:text-sm text-black/60 mt-4">
                  Показано {itemsToShow} из {CATALOG_WATCHES.length} моделей
                </p>
              </div>}

            {/* All Loaded Message */}
            {!hasMore && <div className="mt-12 sm:mt-20 text-center">
                <p className="text-sm text-black/60">
                  Показаны все {CATALOG_WATCHES.length} моделей
                </p>
              </div>}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight uppercase">
                Фильтры
              </h2>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 transition-colors">
                <XIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <FilterSidebar />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-black/10 p-6 sm:p-8">
              <button onClick={() => setShowFilters(false)} className="w-full bg-[#C8102E] hover:bg-[#A00D24] text-white py-3 sm:py-4 text-xs sm:text-sm tracking-[0.2em] font-semibold transition-all duration-500 uppercase">
                Применить фильтры
              </button>
            </div>
          </div>
        </div>}
    </div>;
}