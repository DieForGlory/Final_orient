#🔌 Руководство по интеграции Frontend с Backend

## 📋 Содержание

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Настройка Backend API](#настройка-backend-api)
3. [Интеграция страниц сайта](#интеграция-страниц-сайта)
4. [Пошаговая интеграция каждой страницы](#пошаговая-интеграция-каждой-страницы)
5. [Тестирование интеграции](#тестирование-интеграции)
6. [Troubleshooting](#troubleshooting)

---

## Обзор архитектуры

### Текущее состояние

**Frontend (React + TypeScript):**
- Все страницы используют **моковые данные** (hardcoded)
- Данные хранятся прямо в компонентах
- Нет связи с backend

**Что нужно сделать:**
- Заменить моковые данные на API вызовы
- Подключить все страницы к Python backend
- Использовать SQLite базу данных

### Архитектура после интеграции

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│   React App     │ ───> │  Python Backend  │ ───> │   SQLite    │
│   (Frontend)    │ HTTP │   (FastAPI)      │ SQL  │  Database   │
│  Port: 5173     │ <─── │   Port: 8000     │ <─── │ orient.db   │
└─────────────────┘      └──────────────────┘      └─────────────┘
```

---

## Настройка Backend API

### 1. Создайте Python Backend

**Структура проекта:**

```
backend/
├── main.py              # FastAPI приложение
├── database.py          # Подключение к SQLite
├── models.py            # SQLAlchemy модели
├── schemas.py           # Pydantic схемы
├── auth.py              # JWT аутентификация
├── routers/
│   ├── products.py      # API для товаров
│   ├── collections.py   # API для коллекций
│   ├── orders.py        # API для заказов
│   ├── content.py       # API для контента
│   └── admin.py         # API для админки
├── init_db.py           # Инициализация БД
├── requirements.txt     # Зависимости
└── orient.db            # SQLite база данных
```

### 2. Установите зависимости

```bash
cd backend
pip install -r requirements.txt
```

**requirements.txt:**
```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

### 3. Инициализируйте базу данных

```bash
python init_db.py
```

### 4. Запустите backend

```bash
uvicorn main:app --reload --port 8000
```

Проверьте: `http://localhost:8000/docs` - должна открыться Swagger документация

---

## Интеграция страниц сайта

### Шаг 1: Настройте API Service

**Файл уже создан:** `services/api.ts`

**Обновите URL в `.env`:**

```env
VITE_API_URL=http://localhost:8000
```

### Шаг 2: Создайте публичный API сервис

Создайте новый файл `services/publicApi.ts` для публичных страниц:

```typescript
// services/publicApi.ts
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000';

class PublicApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || 'API Error');
      }

      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Products
  getProducts(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.collection) queryParams.append('collection', params.collection);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    
    const query = queryParams.toString();
    return this.request(`/api/products${query ? `?${query}` : ''}`);
  }

  getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  // Collections
  getCollections() {
    return this.request('/api/collections');
  }

  getCollection(id: string) {
    return this.request(`/api/collections/${id}`);
  }

  getCollectionProducts(id: string, params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.request(`/api/collections/${id}/products${query ? `?${query}` : ''}`);
  }

  // Content
  getHeroContent() {
    return this.request('/api/content/hero');
  }

  getPromoBanner() {
    return this.request('/api/content/promo-banner');
  }

  getFeaturedWatches() {
    return this.request('/api/content/featured-watches');
  }

  getHeritageSection() {
    return this.request('/api/content/heritage');
  }

  // Orders (public - создание заказа)
  createOrder(data: any) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const publicApi = new PublicApiService();
```

---

## Пошаговая интеграция каждой страницы

### 1. Главная страница (Home.tsx)

**Что нужно заменить:**
- Hero секцию
- Промо баннер
- Избранные часы (карусель)
- Heritage секцию

**ДО (моковые данные):**

```typescript
// pages/Home.tsx - СТАРЫЙ КОД
export function Home() {
  return (
    <div>
      <Hero /> {/* Hardcoded данные внутри */}
      <WatchShowcase /> {/* Hardcoded данные внутри */}
      {/* ... */}
    </div>
  );
}
```

**ПОСЛЕ (с API):**

```typescript
// pages/Home.tsx - НОВЫЙ КОД
import { useEffect, useState } from 'react';
import { publicApi } from '../services/publicApi';
import { Hero } from '../components/Hero';
import { WatchShowcase } from '../components/WatchShowcase';

interface HeroContent {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

interface FeaturedWatch {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  isNew: boolean;
}

export function Home() {
  const [loading, setLoading] = useState(true);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [featuredWatches, setFeaturedWatches] = useState<FeaturedWatch[]>([]);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    setLoading(true);
    try {
      const [hero, featured] = await Promise.all([
        publicApi.getHeroContent(),
        publicApi.getFeaturedWatches(),
      ]);
      
      setHeroContent(hero);
      setFeaturedWatches(featured);
    } catch (error) {
      console.error('Error fetching home content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {heroContent && <Hero content={heroContent} />}
      {featuredWatches.length > 0 && <WatchShowcase watches={featuredWatches} />}
      {/* ... остальные секции */}
    </div>
  );
}
```

**Обновите Hero.tsx:**

```typescript
// components/Hero.tsx
interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative bg-black text-white min-h-screen flex items-center overflow-hidden">
      {/* ... existing code ... */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight leading-[1.05]">
        {content.title.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < content.title.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </h1>
      <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-normal text-white/80 leading-relaxed max-w-md">
        {content.subtitle}
      </p>
      <Link to={content.ctaLink} className="...">
        <span>{content.ctaText}</span>
        <ArrowRightIcon className="..." />
      </Link>
      {/* Image */}
      <img src={content.image} alt="Orient Watch" className="..." />
    </section>
  );
}
```

**Обновите WatchShowcase.tsx:**

```typescript
// components/WatchShowcase.tsx
interface WatchShowcaseProps {
  watches: Array<{
    id: string;
    name: string;
    collection: string;
    price: number;
    image: string;
    isNew: boolean;
  }>;
}

export function WatchShowcase({ watches }: WatchShowcaseProps) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* ... existing code ... */}
      <HeroCarousel products={watches} />
    </section>
  );
}
```

---

### 2. Каталог (Catalog.tsx)

**Что нужно заменить:**
- Список товаров
- Фильтры
- Пагинация

**ПОСЛЕ (с API):**

```typescript
// pages/Catalog.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '../services/publicApi';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';

interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
}

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Фильтры из URL
  const filters = {
    collection: searchParams.get('collection') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await publicApi.getProducts({
        ...filters,
        limit: pagination.limit,
      });
      
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            КАТАЛОГ
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-4">
            Найдено товаров: {pagination.total}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-black/60">Товары не найдены</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} {...product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border-2 transition-all ${
                          pagination.page === page
                            ? 'bg-[#C8102E] text-white border-[#C8102E]'
                            : 'border-black/20 hover:border-black'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 3. Страница товара (ProductDetail.tsx)

**ПОСЛЕ (с API):**

```typescript
// pages/ProductDetail.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi } from '../services/publicApi';

interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  sku: string;
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const data = await publicApi.getProduct(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Товар не найден</h1>
          <Link to="/catalog" className="text-[#C8102E] hover:underline">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Product content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square border-2 ${
                      selectedImage === index ? 'border-[#C8102E]' : 'border-black/10'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#C8102E] font-medium uppercase mb-2">
                {product.collection}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-4xl font-bold">{product.price.toLocaleString('ru-RU')} ₽</p>
            </div>

            <div className="space-y-4">
              <p className="text-black/70 leading-relaxed">{product.description}</p>
              
              {product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Особенности:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-[#C8102E]">•</span>
                        <span className="text-sm text-black/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              disabled={!product.inStock}
              className={`w-full py-4 text-sm tracking-[0.2em] font-semibold uppercase transition-all ${
                product.inStock
                  ? 'bg-[#C8102E] hover:bg-[#A00D24] text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
            </button>

            {/* Specs */}
            {Object.keys(product.specs).length > 0 && (
              <div className="border-t-2 border-black/10 pt-6">
                <h3 className="font-semibold mb-4">Характеристики:</h3>
                <dl className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <dt className="text-black/60">{key}:</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 4. Коллекции (CollectionDetail.tsx)

**ПОСЛЕ (с API):**

```typescript
// pages/CollectionDetail.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi } from '../services/publicApi';
import { ProductCard } from '../components/ProductCard';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  watchCount: number;
}

interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
}

export function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchCollectionData(id);
    }
  }, [id]);

  const fetchCollectionData = async (collectionId: string) => {
    setLoading(true);
    try {
      const [collectionData, productsData] = await Promise.all([
        publicApi.getCollection(collectionId),
        publicApi.getCollectionProducts(collectionId, { limit: 50 }),
      ]);
      
      setCollection(collectionData);
      setProducts(productsData.data);
    } catch (error) {
      console.error('Error fetching collection:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Коллекция не найдена</h1>
          <Link to="/" className="text-[#C8102E] hover:underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Collection Header */}
      <div className="relative h-[500px] overflow-hidden bg-black">
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-white leading-none mb-4">
              {collection.name}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">{collection.description}</p>
            <div className="flex items-center space-x-4 mt-6">
              <div className="w-16 h-0.5 bg-[#C8102E]"></div>
              <span className="text-sm tracking-[0.2em] text-white/80 font-medium">
                {collection.watchCount} МОДЕЛЕЙ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-black/60">В этой коллекции пока нет товаров</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} {...product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 5. Корзина (Cart.tsx)

**Обновите создание заказа:**

```typescript
// pages/Cart.tsx - добавьте в существующий код

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setSaving(true);
  
  try {
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      deliveryAddress: formData.deliveryMethod !== 'pickup' ? {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      } : null,
      subtotal,
      shipping: deliveryCost,
      total,
    };

    const response = await publicApi.createOrder(orderData);
    
    // Очистить корзину
    setCartItems([]);
    
    // Показать успешное сообщение
    alert(`Заказ #${response.orderNumber} успешно создан!`);
    
    // Перенаправить на страницу успеха (создайте её)
    // navigate('/order-success', { state: { order: response } });
    
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Ошибка при создании заказа. Попробуйте снова.');
  } finally {
    setSaving(false);
  }
};
```

---

### 6. Header (Header.tsx)

**Обновите промо баннер:**

```typescript
// components/Header.tsx
import { useEffect, useState } from 'react';
import { publicApi } from '../services/publicApi';

interface PromoBanner {
  text: string;
  code: string;
  active: boolean;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
}

export function Header() {
  const [promoBanner, setPromoBanner] = useState<PromoBanner | null>(null);

  useEffect(() => {
    fetchPromoBanner();
  }, []);

  const fetchPromoBanner = async () => {
    try {
      const data = await publicApi.getPromoBanner();
      setPromoBanner(data);
    } catch (error) {
      console.error('Error fetching promo banner:', error);
    }
  };

  return (
    <>
      {/* Promo Banner */}
      {promoBanner?.active && (
        <div 
          className="text-center py-2 sm:py-3 px-4 overflow-hidden relative"
          style={{
            backgroundColor: promoBanner.backgroundColor,
            color: promoBanner.textColor,
          }}
        >
          <p className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] font-medium animate-fade-in">
            {promoBanner.text}{' '}
            <span style={{ color: promoBanner.highlightColor }}>
              {promoBanner.code}
            </span>
          </p>
        </div>
      )}

      {/* Main Header - existing code */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        {/* ... existing header code ... */}
      </header>
    </>
  );
}
```

---

## Тестирование интеграции

### 1. Проверьте Backend

```bash
# Запустите backend
cd backend
uvicorn main:app --reload --port 8000

# Откройте Swagger
# http://localhost:8000/docs
```

**Проверьте endpoints:**
- ✅ `GET /api/products` - возвращает список товаров
- ✅ `GET /api/products/{id}` - возвращает товар
- ✅ `GET /api/collections` - возвращает коллекции
- ✅ `GET /api/content/hero` - возвращает Hero контент
- ✅ `POST /api/orders` - создает заказ

### 2. Проверьте Frontend

```bash
# Запустите frontend
npm run dev

# Откройте браузер
# http://localhost:5173
```

**Проверьте страницы:**
- ✅ Главная - загружается Hero и карусель
- ✅ Каталог - загружается список товаров
- ✅ Товар - загружается детальная информация
- ✅ Коллекция - загружаются товары коллекции
- ✅ Корзина - создается заказ

### 3. Проверьте Network в DevTools

Откройте Chrome DevTools → Network:

- Все запросы идут на `http://localhost:8000`
- Статус ответов: `200 OK`
- Данные приходят в формате JSON

---

## Troubleshooting

### Проблема: CORS ошибка

**Ошибка:**
```
Access to fetch at 'http://localhost:8000/api/products' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Решение:**

В `backend/main.py` добавьте:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Проблема: 404 Not Found

**Ошибка:**
```
GET http://localhost:8000/api/products 404 (Not Found)
```

**Решение:**
- Проверьте что backend запущен
- Проверьте URL в `.env` файле
- Проверьте что endpoint существует в `main.py`

### Проблема: Данные не загружаются

**Решение:**
1. Откройте DevTools → Console
2. Проверьте ошибки JavaScript
3. Проверьте Network → XHR запросы
4. Проверьте что база данных инициализирована

### Проблема: Пустая база данных

**Решение:**

```bash
# Удалите старую БД
rm orient.db

# Инициализируйте заново
python init_db.py

# Добавьте тестовые данные
python seed_db.py  # Создайте этот скрипт
```

---

## Чеклист интеграции

### Backend
- [ ] Python backend установлен и запущен
- [ ] SQLite база данных создана
- [ ] Все таблицы созданы
- [ ] Тестовые данные добавлены
- [ ] CORS настроен
- [ ] Все endpoints работают

### Frontend
- [ ] `.env` файл создан с правильным API_URL
- [ ] `publicApi.ts` создан
- [ ] Home.tsx интегрирован
- [ ] Catalog.tsx интегрирован
- [ ] ProductDetail.tsx интегрирован
- [ ] CollectionDetail.tsx интегрирован
- [ ] Cart.tsx интегрирован (создание заказа)
- [ ] Header.tsx интегрирован (промо баннер)

### Тестирование
- [ ] Главная страница загружается
- [ ] Каталог показывает товары из БД
- [ ] Фильтры работают
- [ ] Пагинация работает
- [ ] Страница товара загружается
- [ ] Коллекции загружаются
- [ ] Заказ создается в БД
- [ ] Админка работает

---

## Следующие шаги

1. **Добавьте обработку ошибок** - покажите пользователю понятные сообщения
2. **Добавьте loading states** - индикаторы загрузки на всех страницах
3. **Оптимизируйте запросы** - кэширование, debounce для поиска
4. **Добавьте SEO** - meta теги, sitemap
5. **Настройте production** - environment variables, build optimization

---

**Готово!** Теперь ваш frontend полностью интегрирован с Python backend! 🎉