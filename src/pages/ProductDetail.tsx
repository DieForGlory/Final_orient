import React, { useState, useRef } from 'react';
import { ShoppingBagIcon, ShareIcon, CheckCircleIcon, TruckIcon, ShieldCheckIcon, RotateCcwIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
const PRODUCT = {
  id: '1',
  name: 'Kamasu Automatic Diver',
  collection: 'SPORTS COLLECTION',
  price: 45900,
  inStock: true,
  sku: 'RA-AA0004E19B',
  description: 'Профессиональные дайверские часы Kamasu сочетают японское мастерство с современными технологиями. Автоматический механизм собственного производства Orient обеспечивает точность и надежность, а водонепроницаемость 200 метров делает эти часы идеальным выбором для дайвинга и активного образа жизни.',
  features: ['Автоматический механизм Orient F6922', 'Водонепроницаемость 200 метров (ISO 6425)', 'Односторонний вращающийся безель', 'Сапфировое стекло с AR покрытием', 'SuperLuminova на стрелках и индексах', 'Завинчивающаяся головка', 'Стальной браслет с раскладывающейся застежкой'],
  images: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1600&q=80', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1600&q=80', 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=1600&q=80', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1600&q=80'],
  specs: [{
    label: 'Механизм',
    value: 'Автоматический Orient F6922'
  }, {
    label: 'Корпус',
    value: 'Нержавеющая сталь 316L'
  }, {
    label: 'Диаметр корпуса',
    value: '41.8 мм'
  }, {
    label: 'Толщина',
    value: '13 мм'
  }, {
    label: 'Стекло',
    value: 'Сапфировое с AR покрытием'
  }, {
    label: 'Водонепроницаемость',
    value: '200 метров (20 ATM)'
  }, {
    label: 'Запас хода',
    value: '40 часов'
  }, {
    label: 'Браслет',
    value: 'Нержавеющая сталь 316L'
  }, {
    label: 'Застежка',
    value: 'Раскладывающаяся с кнопкой'
  }, {
    label: 'Вес',
    value: '185 грамм'
  }, {
    label: 'Гарантия',
    value: '2 года международная'
  }, {
    label: 'Производство',
    value: 'Япония'
  }]
};
const RELATED_PRODUCTS = [{
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
}];
export function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 0,
    y: 0
  });
  const [imagePosition, setImagePosition] = useState({
    x: 0,
    y: 0
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFlyingImage, setShowFlyingImage] = useState(false);
  const [flyingImagePosition, setFlyingImagePosition] = useState({
    x: 0,
    y: 0
  });
  const [showToast, setShowToast] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const nextImage = () => {
    setSelectedImage(prev => (prev + 1) % PRODUCT.images.length);
  };
  const prevImage = () => {
    setSelectedImage(prev => (prev - 1 + PRODUCT.images.length) % PRODUCT.images.length);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = imageRef.current;
    if (!elem) return;
    const {
      top,
      left,
      width,
      height
    } = elem.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const xPercent = x / width * 100;
    const yPercent = y / height * 100;
    setMagnifierPosition({
      x: e.clientX,
      y: e.clientY
    });
    setImagePosition({
      x: xPercent,
      y: yPercent
    });
  };
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setShowMagnifier(true);
    }
  };
  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };
  const handleAddToCart = () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    const button = addToCartButtonRef.current;
    const image = imageRef.current;
    if (button && image) {
      const imageRect = image.getBoundingClientRect();
      setFlyingImagePosition({
        x: imageRect.left + imageRect.width / 2,
        y: imageRect.top + imageRect.height / 2
      });
      setShowFlyingImage(true);
      setTimeout(() => {
        setFlyingImagePosition({
          x: window.innerWidth - 100,
          y: 50
        });
      }, 50);
      setTimeout(() => {
        setShowFlyingImage(false);
        setShowSuccess(true);
        setShowToast(true);
      }, 800);
      setTimeout(() => {
        setIsAddingToCart(false);
        setShowSuccess(false);
      }, 2500);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    }
  };
  return <div className="w-full bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-4 sm:py-6">
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] text-black/50 font-medium overflow-x-auto">
            <Link to="/" className="hover:text-[#C8102E] transition-colors whitespace-nowrap">
              ГЛАВНАЯ
            </Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-[#C8102E] transition-colors whitespace-nowrap">
              КАТАЛОГ
            </Link>
            <span>/</span>
            <Link to="/collection/sports" className="hover:text-[#C8102E] transition-colors whitespace-nowrap">
              {PRODUCT.collection}
            </Link>
            <span className="hidden sm:inline">/</span>
            <span className="text-black truncate hidden sm:inline">
              {PRODUCT.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 sm:gap-12 lg:gap-16 xl:gap-24">
          {/* Image Gallery */}
          <div className="space-y-4 sm:space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 group">
              <div ref={imageRef} className="relative w-full h-full overflow-hidden cursor-crosshair" onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img src={PRODUCT.images[selectedImage]} alt={`${PRODUCT.name} - изображение ${selectedImage + 1}`} className="w-full h-full object-contain p-6 sm:p-12" />

                {/* Magnifier Lens - Desktop only */}
                {showMagnifier && <div className="fixed pointer-events-none z-50 border-4 border-white shadow-2xl rounded-full overflow-hidden hidden lg:block" style={{
                width: '200px',
                height: '200px',
                left: `${magnifierPosition.x - 100}px`,
                top: `${magnifierPosition.y - 100}px`,
                backgroundImage: `url(${PRODUCT.images[selectedImage]})`,
                backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat'
              }}>
                    <div className="absolute inset-0 border-2 border-black/10 rounded-full"></div>
                  </div>}
              </div>

              {/* Navigation Arrows */}
              <button onClick={prevImage} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 backdrop-blur-sm border border-black/10 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all duration-500 z-10" aria-label="Предыдущее изображение">
                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              </button>
              <button onClick={nextImage} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 backdrop-blur-sm border border-black/10 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all duration-500 z-10" aria-label="Следующее изображение">
                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 bg-black/80 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-wider">
                {selectedImage + 1} / {PRODUCT.images.length}
              </div>

              {/* Magnifier Hint - Desktop only */}
              <div className="hidden lg:block absolute top-6 right-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Наведите для увеличения
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {PRODUCT.images.map((image, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`aspect-square bg-gray-50 transition-all duration-300 border-2 ${selectedImage === index ? 'border-[#C8102E]' : 'border-transparent hover:border-black/20'}`}>
                  <img src={image} alt={`${PRODUCT.name} миниатюра ${index + 1}`} className="w-full h-full object-contain p-2 sm:p-3" />
                </button>)}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 sm:w-8 h-px bg-[#C8102E]"></div>
                <p className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] text-[#C8102E] font-medium uppercase">
                  {PRODUCT.collection}
                </p>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
                {PRODUCT.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-black/50 font-medium">
                  SKU: {PRODUCT.sku}
                </p>
                {PRODUCT.inStock && <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2} />
                    <span className="text-xs sm:text-sm font-medium">
                      В наличии
                    </span>
                  </div>}
              </div>
            </div>

            {/* Price */}
            <div className="py-4 sm:py-6 border-y border-black/10">
              <div className="flex items-baseline space-x-2 sm:space-x-3">
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
                  {PRODUCT.price.toLocaleString('ru-RU')}
                </p>
                <span className="text-lg sm:text-xl font-medium text-black/60">
                  ₽
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base font-normal text-black/70 leading-relaxed">
              {PRODUCT.description}
            </p>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm tracking-[0.15em] font-semibold uppercase text-black">
                Основные характеристики
              </h3>
              <ul className="space-y-2">
                {PRODUCT.features.slice(0, 4).map((feature, index) => <li key={index} className="flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm text-black/70">
                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8102E] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>{feature}</span>
                  </li>)}
              </ul>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <label className="text-xs sm:text-sm tracking-[0.15em] font-medium uppercase text-black whitespace-nowrap">
                  Количество
                </label>
                <div className="flex items-center border-2 border-black">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-black hover:text-white transition-colors" disabled={isAddingToCart}>
                    −
                  </button>
                  <span className="px-4 sm:px-8 py-2 sm:py-3 border-x-2 border-black text-sm sm:text-base font-semibold min-w-[50px] sm:min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-black hover:text-white transition-colors" disabled={isAddingToCart}>
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button ref={addToCartButtonRef} onClick={handleAddToCart} disabled={isAddingToCart || showSuccess} className={`flex-1 py-4 sm:py-5 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-semibold transition-all duration-500 flex items-center justify-center space-x-2 sm:space-x-3 uppercase ${showSuccess ? 'bg-green-600 text-white' : 'bg-[#C8102E] hover:bg-[#A00D24] text-white'} ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  {showSuccess ? <>
                      <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                      <span className="hidden sm:inline">
                        Добавлено в корзину
                      </span>
                      <span className="sm:hidden">Добавлено</span>
                    </> : isAddingToCart ? <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Добавление...</span>
                    </> : <>
                      <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                      <span className="hidden sm:inline">
                        Добавить в корзину
                      </span>
                      <span className="sm:hidden">В корзину</span>
                    </>}
                </button>

                <button className="hidden sm:block p-5 border-2 border-black hover:bg-black hover:text-white transition-all duration-500" aria-label="Поделиться" disabled={isAddingToCart}>
                  <ShareIcon className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-black/10">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-50 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] font-semibold uppercase text-black">
                    Доставка
                  </p>
                  <p className="text-[10px] sm:text-xs text-black/60 mt-1 hidden sm:block">
                    По всей России
                  </p>
                </div>
              </div>
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-50 flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] font-semibold uppercase text-black">
                    Гарантия
                  </p>
                  <p className="text-[10px] sm:text-xs text-black/60 mt-1 hidden sm:block">
                    2 года
                  </p>
                </div>
              </div>
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-50 flex items-center justify-center">
                  <RotateCcwIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] font-semibold uppercase text-black">
                    Возврат
                  </p>
                  <p className="text-[10px] sm:text-xs text-black/60 mt-1 hidden sm:block">
                    14 дней
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16 sm:mt-24 lg:mt-32 pt-12 sm:pt-16 border-t border-black/10">
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div className="w-8 sm:w-12 h-0.5 bg-[#C8102E]"></div>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                Технические характеристики
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
              Спецификации
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-4 sm:gap-y-6">
            {PRODUCT.specs.map((spec, index) => <div key={index} className="flex justify-between items-center py-4 sm:py-5 border-b border-black/10 gap-4">
                <span className="text-xs sm:text-sm font-medium text-black/60">
                  {spec.label}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-black text-right">
                  {spec.value}
                </span>
              </div>)}
          </div>
        </div>

        {/* Related Products - Carousel on Mobile */}
        <div className="mt-16 sm:mt-24 lg:mt-32 pt-12 sm:pt-16 border-t border-black/10">
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div className="w-8 sm:w-12 h-0.5 bg-[#C8102E]"></div>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                Похожие модели
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
              Вам может понравиться
            </h2>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {RELATED_PRODUCTS.map(product => <Link key={product.id} to={`/product/${product.id}`} className="flex-shrink-0 w-[160px] snap-start">
                <div className="relative aspect-[4/5] bg-gray-50 mb-3 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-px bg-[#C8102E]"></div>
                    <p className="text-[8px] tracking-[0.2em] text-black/50 font-medium uppercase">
                      {product.collection}
                    </p>
                  </div>
                  <h3 className="text-xs font-semibold text-black line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-black">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </Link>)}
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {RELATED_PRODUCTS.map(product => <Link key={product.id} to={`/product/${product.id}`} className="group block">
                <div className="relative aspect-[4/5] bg-gray-50 mb-4 sm:mb-6 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 sm:w-6 h-px bg-[#C8102E]"></div>
                    <p className="text-[10px] tracking-[0.2em] text-black/50 font-medium uppercase">
                      {product.collection}
                    </p>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-black group-hover:text-[#C8102E] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-black">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </Link>)}
          </div>
        </div>
      </div>

      {/* Flying Image Animation */}
      {showFlyingImage && <div className="fixed pointer-events-none z-50 transition-all duration-700 ease-out" style={{
      left: `${flyingImagePosition.x}px`,
      top: `${flyingImagePosition.y}px`,
      transform: 'translate(-50%, -50%) scale(0.3)',
      opacity: showFlyingImage ? 1 : 0
    }}>
          <img src={PRODUCT.images[selectedImage]} alt="Flying product" className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg shadow-2xl" />
        </div>}

      {/* Toast Notification */}
      {showToast && <div className="fixed top-20 sm:top-24 right-4 sm:right-8 z-50 animate-slide-in-right">
          <div className="bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center space-x-3 sm:space-x-4 min-w-[280px] sm:min-w-[320px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs sm:text-sm tracking-wide">
                Добавлено в корзину
              </p>
              <p className="text-[10px] sm:text-xs text-white/80 mt-1 truncate">
                {PRODUCT.name} × {quantity}
              </p>
            </div>
            <Link to="/cart" className="text-[10px] sm:text-xs tracking-wider font-semibold hover:underline uppercase whitespace-nowrap">
              В корзину
            </Link>
          </div>
        </div>}
    </div>;
}