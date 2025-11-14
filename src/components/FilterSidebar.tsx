import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
interface FilterSection {
  title: string;
  options: {
    label: string;
    value: string;
    count?: number;
  }[];
}
const FILTERS: FilterSection[] = [{
  title: 'КОЛЛЕКЦИЯ',
  options: [{
    label: 'Sports',
    value: 'sports',
    count: 24
  }, {
    label: 'Classic',
    value: 'classic',
    count: 18
  }, {
    label: 'Contemporary',
    value: 'contemporary',
    count: 16
  }]
}, {
  title: 'МЕХАНИЗМ',
  options: [{
    label: 'Автоматический',
    value: 'automatic',
    count: 42
  }, {
    label: 'Механический',
    value: 'mechanical',
    count: 16
  }]
}, {
  title: 'МАТЕРИАЛ КОРПУСА',
  options: [{
    label: 'Нержавеющая сталь',
    value: 'steel',
    count: 48
  }, {
    label: 'Титан',
    value: 'titanium',
    count: 6
  }, {
    label: 'Позолота',
    value: 'gold',
    count: 4
  }]
}, {
  title: 'ЦВЕТ ЦИФЕРБЛАТА',
  options: [{
    label: 'Черный',
    value: 'black',
    count: 22
  }, {
    label: 'Синий',
    value: 'blue',
    count: 18
  }, {
    label: 'Белый',
    value: 'white',
    count: 12
  }, {
    label: 'Зеленый',
    value: 'green',
    count: 6
  }]
}, {
  title: 'ВОДОНЕПРОНИЦАЕМОСТЬ',
  options: [{
    label: '200м',
    value: '200m',
    count: 28
  }, {
    label: '100м',
    value: '100m',
    count: 18
  }, {
    label: '50м',
    value: '50m',
    count: 12
  }]
}];
export function FilterSidebar() {
  const [openSections, setOpenSections] = useState<string[]>(FILTERS.map(f => f.title));
  const toggleSection = (title: string) => {
    setOpenSections(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };
  return <aside className="w-full lg:w-64 bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold tracking-widest">ФИЛЬТРЫ</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {FILTERS.map(section => <div key={section.title} className="p-6">
            <button onClick={() => toggleSection(section.title)} className="flex items-center justify-between w-full mb-4">
              <h3 className="text-sm font-medium tracking-widest">
                {section.title}
              </h3>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.includes(section.title) ? 'rotate-180' : ''}`} />
            </button>

            {openSections.includes(section.title) && <div className="space-y-3">
                {section.options.map(option => <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-[#C8102E] focus:ring-[#C8102E]" />
                    <span className="text-sm text-gray-700 group-hover:text-black flex-1">
                      {option.label}
                    </span>
                    {option.count && <span className="text-xs text-gray-400">
                        ({option.count})
                      </span>}
                  </label>)}
              </div>}
          </div>)}
      </div>

      {/* Price Range */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-sm font-medium tracking-widest mb-4">ЦЕНА</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input type="number" placeholder="От" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" />
            <span className="text-gray-400">—</span>
            <input type="number" placeholder="До" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" />
          </div>
          <button className="w-full bg-black text-white py-2 text-sm tracking-widest hover:bg-gray-800 transition-colors">
            ПРИМЕНИТЬ
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="p-6">
        <button className="text-sm text-gray-600 hover:text-black transition-colors tracking-wide">
          Сбросить все фильтры
        </button>
      </div>
    </aside>;
}