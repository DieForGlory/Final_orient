import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCarousel } from '../components/ProductCarousel';
import { ArrowRightIcon } from 'lucide-react';
const COLLECTION_DATA = {
  sports: {
    name: 'SPORTS',
    tagline: 'Созданы для глубины',
    description: 'Профессиональные дайверские часы с непревзойденной надежностью и водонепроницаемостью до 200 метров. Каждая модель проходит строгие испытания и соответствует международным стандартам ISO 6425.',
    heroImage: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1600&q=80',
    story: 'С момента создания первых дайверских часов Orient в 1960-х годах, мы постоянно совершенствуем технологии водонепроницаемости и надежности. Каждые часы Sports Collection проходят испытания в экстремальных условиях, чтобы гарантировать безупречную работу на глубине.',
    watches: [{
      id: '1',
      name: 'Kamasu Automatic Diver',
      collection: 'SPORTS',
      price: 45900,
      image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80',
      isNew: true
    }, {
      id: '3',
      name: 'Mako III Automatic',
      collection: 'SPORTS',
      price: 41900,
      image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80'
    }, {
      id: '5',
      name: 'Ray II Automatic',
      collection: 'SPORTS',
      price: 38900,
      image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&q=80'
    }, {
      id: '8',
      name: 'Triton Neptune',
      collection: 'SPORTS',
      price: 71900,
      image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80'
    }, {
      id: '11',
      name: 'Diver King',
      collection: 'SPORTS',
      price: 76900,
      image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=600&q=80'
    }, {
      id: '13',
      name: 'Ocean Master',
      collection: 'SPORTS',
      price: 82900,
      image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80'
    }]
  }
};
export function CollectionDetail() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const collection = COLLECTION_DATA[id as keyof typeof COLLECTION_DATA];
  if (!collection) {
    return <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            КОЛЛЕКЦИЯ НЕ НАЙДЕНА
          </h1>
          <Link to="/catalog" className="inline-block text-[#C8102E] hover:underline">
            Вернуться в каталог
          </Link>
        </div>
      </div>;
  }
  return <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={collection.heroImage} alt={collection.name} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 w-full py-20">
          <div className="max-w-3xl space-y-10">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-3 text-sm text-white/60">
              <Link to="/" className="hover:text-white transition-colors">
                Главная
              </Link>
              <span>/</span>
              <Link to="/catalog" className="hover:text-white transition-colors">
                Коллекции
              </Link>
              <span>/</span>
              <span className="text-white">{collection.name}</span>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-0.5 bg-[#C8102E]"></div>
                <p className="text-xs tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                  Коллекция
                </p>
              </div>

              <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-none">
                {collection.name}
              </h1>

              <p className="text-3xl font-normal text-white/80">
                {collection.tagline}
              </p>
            </div>

            <p className="text-xl font-normal text-white/70 leading-relaxed">
              {collection.description}
            </p>

            <Link to="/catalog" className="inline-flex items-center space-x-3 border-2 border-white px-10 py-4 text-sm tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-all duration-500 uppercase">
              <span>Смотреть все модели</span>
              <ArrowRightIcon className="w-5 h-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* Collection Story */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-0.5 bg-[#C8102E]"></div>
                  <p className="text-xs tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                    История
                  </p>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Наследие
                  <br />
                  мастерства
                </h2>
              </div>
              <p className="text-lg font-normal text-black/70 leading-relaxed">
                {collection.story}
              </p>
            </div>

            <div className="relative aspect-square">
              <img src={collection.heroImage} alt="Collection Story" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Carousel */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="mb-16">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-0.5 bg-[#C8102E]"></div>
              <p className="text-xs tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                {collection.watches.length} избранных моделей
              </p>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                Модели коллекции
              </h2>
              <Link to="/catalog" className="hidden md:inline-flex items-center space-x-3 text-sm tracking-[0.15em] font-medium hover:text-[#C8102E] transition-colors duration-500 uppercase">
                <span>Все модели</span>
                <ArrowRightIcon className="w-5 h-5" strokeWidth={2} />
              </Link>
            </div>
          </div>

          <ProductCarousel products={collection.watches} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-32">
        <div className="max-w-4xl mx-auto px-8 lg:px-16 text-center space-y-10">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Примерьте в бутике
          </h2>
          <p className="text-xl font-normal text-white/70 max-w-2xl mx-auto">
            Запишитесь на персональную консультацию и оцените качество наших
            часов вживую
          </p>
          <Link to="/boutique" className="inline-flex items-center space-x-4 bg-[#C8102E] hover:bg-[#A00D24] text-white px-12 py-5 text-sm tracking-[0.2em] font-medium transition-all duration-500 uppercase">
            <span>Записаться на визит</span>
            <ArrowRightIcon className="w-5 h-5" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>;
}