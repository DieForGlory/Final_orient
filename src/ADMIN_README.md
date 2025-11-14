# Orient Watch - Admin Panel

## 📋 Обзор

Frontend админ-панель для управления сайтом Orient Watch. Панель готова к подключению к Python backend с SQLite базой данных.

## 🎯 Что реализовано

### ✅ Страницы админки:

1. **Login** (`/admin/login`)
   - Форма входа с email/password
   - Валидация
   - Сохранение JWT токена

2. **Dashboard** (`/admin/dashboard`)
   - Статистика (товары, заказы, выручка, пользователи)
   - Последние заказы
   - Быстрые действия

3. **Products** (`/admin/products`)
   - Список всех товаров
   - Поиск и фильтры
   - CRUD операции
   - Pagination

4. **Content** (`/admin/content`)
   - **Hero секция** - главный баннер с изображением часов
   - **Промо баннер** - акционный баннер в шапке
   - **Избранные часы** - карусель с 6 товарами
   - **Heritage секция** - баннер с историей бренда
   - Предпросмотр изменений в реальном времени

5. **Layout**
   - Sidebar навигация
   - Мобильное меню
   - Header с logout
   - Responsive дизайн

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
# или
yarn install
```

### 2. Настройка переменных окружения

Создайте `.env` файл:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Запуск dev сервера

```bash
npm run dev
# или
yarn dev
```

### 4. Доступ к админке

Откройте в браузере: `http://localhost:5173/admin/login`

**Демо credentials:**
- Email: `admin@orient.uz`
- Password: `admin123`

## 🐍 Backend Setup (Python + SQLite)

### Рекомендуемый стек:

- **Framework:** FastAPI или Flask
- **Database:** SQLite3
- **ORM:** SQLAlchemy
- **Auth:** JWT (PyJWT)
- **CORS:** fastapi-cors или flask-cors

### Структура базы данных SQLite:

```sql
-- users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    collection TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    images TEXT, -- JSON array
    description TEXT,
    features TEXT, -- JSON array
    specs TEXT, -- JSON object
    in_stock BOOLEAN DEFAULT 1,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- collections table
CREATE TABLE collections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    watch_count INTEGER DEFAULT 0,
    number TEXT,
    active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- orders table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    customer_data TEXT, -- JSON object
    items TEXT, -- JSON array
    subtotal REAL NOT NULL,
    shipping REAL DEFAULT 0,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    delivery_method TEXT,
    delivery_address TEXT, -- JSON object
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- content_hero table
CREATE TABLE content_hero (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    cta_link TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- content_promo_banner table
CREATE TABLE content_promo_banner (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    text TEXT NOT NULL,
    code TEXT NOT NULL,
    active BOOLEAN DEFAULT 1,
    background_color TEXT DEFAULT '#000000',
    text_color TEXT DEFAULT '#FFFFFF',
    highlight_color TEXT DEFAULT '#C8102E',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- content_featured_watches table
CREATE TABLE content_featured_watches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    order_num INTEGER NOT NULL,
    is_new BOOLEAN DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- content_heritage table
CREATE TABLE content_heritage (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    cta_link TEXT NOT NULL,
    years_text TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Пример FastAPI Backend:

```python
# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import sqlite3
import jwt
from datetime import datetime, timedelta
from passlib.hash import bcrypt

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
DATABASE = "orient.db"
SECRET_KEY = "your-secret-key-change-in-production"
security = HTTPBearer()

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Models
class LoginRequest(BaseModel):
    email: str
    password: str

class HeroContent(BaseModel):
    title: str
    subtitle: str
    image: str
    ctaText: str
    ctaLink: str

# Auth
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.post("/api/admin/login")
async def login(request: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    user = cursor.execute(
        "SELECT * FROM users WHERE email = ? AND role = 'admin'",
        (request.email,)
    ).fetchone()
    
    if not user or not bcrypt.verify(request.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt.encode(
        {
            "user_id": user['id'],
            "email": user['email'],
            "exp": datetime.utcnow() + timedelta(days=1)
        },
        SECRET_KEY,
        algorithm="HS256"
    )
    
    return {
        "token": token,
        "user": {
            "id": user['id'],
            "email": user['email'],
            "name": user['name'],
            "role": user['role']
        }
    }

@app.get("/api/admin/stats")
async def get_stats(user = Depends(verify_token)):
    conn = get_db()
    cursor = conn.cursor()
    
    total_products = cursor.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    total_orders = cursor.execute("SELECT COUNT(*) FROM orders").fetchone()[0]
    total_revenue = cursor.execute("SELECT SUM(total) FROM orders WHERE status = 'completed'").fetchone()[0] or 0
    total_users = cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'user'").fetchone()[0]
    
    return {
        "totalProducts": total_products,
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "totalUsers": total_users
    }

@app.get("/api/admin/content/hero")
async def get_hero_content(user = Depends(verify_token)):
    conn = get_db()
    cursor = conn.cursor()
    
    hero = cursor.execute("SELECT * FROM content_hero WHERE id = 1").fetchone()
    
    if not hero:
        raise HTTPException(status_code=404, detail="Hero content not found")
    
    return {
        "title": hero['title'],
        "subtitle": hero['subtitle'],
        "image": hero['image'],
        "ctaText": hero['cta_text'],
        "ctaLink": hero['cta_link']
    }

@app.put("/api/admin/content/hero")
async def update_hero_content(content: HeroContent, user = Depends(verify_token)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT OR REPLACE INTO content_hero (id, title, subtitle, image, cta_text, cta_link, updated_at)
        VALUES (1, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (content.title, content.subtitle, content.image, content.ctaText, content.ctaLink))
    
    conn.commit()
    
    return {"message": "Hero content updated"}

# ... other routes
```

### Инициализация базы данных:

```python
# init_db.py
import sqlite3
from passlib.hash import bcrypt

conn = sqlite3.connect('orient.db')
cursor = conn.cursor()

# Create tables (use SQL from above)

# Create admin user
admin_password = bcrypt.hash('admin123')
cursor.execute("""
    INSERT INTO users (email, password_hash, name, role)
    VALUES ('admin@orient.uz', ?, 'Admin User', 'admin')
""", (admin_password,))

# Insert default hero content
cursor.execute("""
    INSERT INTO content_hero (id, title, subtitle, image, cta_text, cta_link)
    VALUES (1, 'НАЙДИТЕ\nИДЕАЛЬНЫЕ\nЧАСЫ.', 'Японское мастерство и точность в каждой детали',
            'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
            'Смотреть коллекцию', '/catalog')
""")

# Insert default promo banner
cursor.execute("""
    INSERT INTO content_promo_banner (id, text, code, active)
    VALUES (1, 'СКИДКА 15% НА ВСЕ ЧАСЫ С КОДОМ', 'PRE2025', 1)
""")

# Insert default heritage content
cursor.execute("""
    INSERT INTO content_heritage (id, title, subtitle, description, cta_text, cta_link, years_text)
    VALUES (1, '75 лет\nмастерства', 'С 1950 года',
            'Orient создает механические часы высочайшего качества, объединяя традиционное японское мастерство с современными технологиями.',
            'Узнать историю', '/history', '75')
""")

conn.commit()
conn.close()

print("Database initialized!")
```

### Запуск backend:

```bash
# Установка зависимостей
pip install fastapi uvicorn sqlalchemy pyjwt passlib python-multipart

# Инициализация БД
python init_db.py

# Запуск сервера
uvicorn main:app --reload --port 8000
```

## 🔧 Настройка Frontend

### 1. Обновите API URL

В `.env` файле:

```env
VITE_API_URL=http://localhost:8000
```

### 2. API Service уже настроен

Файл `services/api.ts` уже содержит все необходимые методы для работы с backend.

## 📚 API Endpoints

Полная документация API находится в файле `API_DOCUMENTATION.md`

### Основные endpoints для контента:

- `GET /api/admin/content/hero` - Получить Hero секцию
- `PUT /api/admin/content/hero` - Обновить Hero секцию
- `GET /api/admin/content/promo-banner` - Получить промо баннер
- `PUT /api/admin/content/promo-banner` - Обновить промо баннер
- `GET /api/admin/content/featured-watches` - Получить избранные часы
- `PUT /api/admin/content/featured-watches` - Обновить избранные часы
- `GET /api/admin/content/heritage` - Получить Heritage секцию
- `PUT /api/admin/content/heritage` - Обновить Heritage секцию

[Смотреть полную документацию →](./API_DOCUMENTATION.md)

## 🎨 Управление контентом главной страницы

### Hero Секция
- Заголовок (с поддержкой переносов строк)
- Подзаголовок
- Изображение часов
- Текст и ссылка кнопки CTA

### Промо Баннер
- Текст акции
- Промокод
- Включение/выключение баннера
- Настройка цветов (фон, текст, промокод)
- Предпросмотр в реальном времени

### Избранные Часы (Карусель)
- Добавление/удаление товаров
- Порядок отображения
- Метка "NEW" для новинок
- Drag & drop для изменения порядка

### Heritage Секция
- Количество лет
- Заголовок и подзаголовок
- Описание бренда
- Текст и ссылка кнопки CTA

## 🔐 Безопасность

### Рекомендации для Python Backend:

1. **Используйте environment variables** для SECRET_KEY
2. **Хэшируйте пароли** с помощью bcrypt или argon2
3. **Валидируйте входные данные** с помощью Pydantic
4. **Используйте HTTPS** в production
5. **Настройте CORS** правильно
6. **Добавьте rate limiting** (slowapi)
7. **Логируйте все действия** администраторов

### Пример .env для backend:

```env
SECRET_KEY=your-super-secret-key-change-in-production
DATABASE_URL=sqlite:///./orient.db
CORS_ORIGINS=http://localhost:5173,https://orient.uz
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=5242880  # 5MB
```

## 📱 Responsive Design

Админка полностью адаптивна:
- ✅ Mobile sidebar (hamburger menu)
- ✅ Responsive tables
- ✅ Touch-friendly buttons
- ✅ Adaptive forms
- ✅ Предпросмотр контента на всех устройствах

## 🎯 Следующие шаги

1. **Создайте Python backend** с FastAPI/Flask
2. **Инициализируйте SQLite базу данных**
3. **Подключите frontend к backend**
4. **Добавьте загрузку изображений**
5. **Настройте production deployment**
6. **Добавьте логирование и мониторинг**

## 📞 Поддержка

Если у вас возникли вопросы:

1. Проверьте `API_DOCUMENTATION.md`
2. Убедитесь что backend возвращает правильный формат данных
3. Проверьте CORS настройки
4. Проверьте что JWT токены правильно генерируются

## 🚀 Production Deployment

### Frontend (Vercel/Netlify):

```bash
npm run build
```

### Backend (Python):

```bash
# Используйте gunicorn для production
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Environment Variables (Production):

```env
VITE_API_URL=https://api.orient.uz
SECRET_KEY=your-production-secret-key
DATABASE_URL=sqlite:///./orient_production.db
CORS_ORIGINS=https://orient.uz,https://www.orient.uz
```

---

**Готово!** Frontend админки полностью готов к подключению к Python backend с SQLite! 🎉