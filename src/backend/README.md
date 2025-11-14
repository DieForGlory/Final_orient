# Orient Watch - Backend API

## 🐍 Python + FastAPI + SQLite

Backend API для сайта Orient Watch с полным функционалом управления товарами, заказами и контентом.

---

## 📦 Установка и запуск

### 1. Установите Python

Убедитесь что у вас установлен Python 3.9 или выше:

```bash
python --version
# или
python3 --version
```

### 2. Создайте виртуальное окружение

```bash
# Перейдите в папку backend
cd backend

# Создайте виртуальное окружение
python -m venv venv

# Активируйте его
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate
```

### 3. Установите зависимости

```bash
pip install -r requirements.txt
```

### 4. Инициализируйте базу данных

```bash
python init_db.py
```

Это создаст:
- ✅ SQLite базу данных `orient.db`
- ✅ Все необходимые таблицы
- ✅ Админ пользователя
- ✅ Тестовые товары и коллекции
- ✅ Дефолтный контент

**Credentials:**
- Email: `admin@orient.uz`
- Password: `admin123`

### 5. Запустите сервер

```bash
python main.py
```

Или с помощью uvicorn:

```bash
uvicorn main:app --reload --port 8000
```

### 6. Проверьте работу

Откройте в браузере:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## 🔌 Подключение Frontend

### Шаг 1: Настройте .env в frontend

Создайте файл `.env` в корне frontend проекта:

```env
VITE_API_URL=http://localhost:8000
```

### Шаг 2: Убедитесь что backend запущен

```bash
# В папке backend
python main.py
```

Должно появиться:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Шаг 3: Запустите frontend

```bash
# В корне проекта (не в папке backend!)
npm run dev
```

### Шаг 4: Проверьте интеграцию

1. Откройте http://localhost:5173
2. Главная страница должна загрузить данные из API
3. Откройте DevTools → Network → XHR
4. Должны быть запросы к http://localhost:8000

### Шаг 5: Войдите в админку

1. Откройте http://localhost:5173/admin/login
2. Введите:
   - Email: `admin@orient.uz`
   - Password: `admin123`
3. Вы должны попасть в админ панель

---

## 📁 Структура проекта

```
backend/
├── main.py                 # Главный файл приложения
├── database.py             # Модели БД и подключение
├── auth.py                 # JWT аутентификация
├── schemas.py              # Pydantic схемы
├── init_db.py              # Инициализация БД
├── requirements.txt        # Зависимости Python
├── routes/                 # API роуты
│   ├── admin.py           # Админ endpoints
│   ├── products.py        # Товары
│   ├── collections.py     # Коллекции
│   ├── orders.py          # Заказы
│   ├── content.py         # Контент
│   └── upload.py          # Загрузка файлов
├── uploads/               # Загруженные изображения
└── orient.db              # SQLite база данных
```

---

## 🔑 API Endpoints

### Публичные (без авторизации)

**Products:**
- `GET /api/products` - Список товаров
- `GET /api/products/{id}` - Товар по ID

**Collections:**
- `GET /api/collections` - Список коллекций
- `GET /api/collections/{id}` - Коллекция по ID
- `GET /api/collections/{id}/products` - Товары коллекции

**Content:**
- `GET /api/content/hero` - Hero секция
- `GET /api/content/promo-banner` - Промо баннер
- `GET /api/content/featured-watches` - Избранные часы
- `GET /api/content/heritage` - Heritage секция

**Orders:**
- `POST /api/orders` - Создать заказ

### Админские (требуют авторизации)

**Auth:**
- `POST /api/admin/login` - Вход

**Dashboard:**
- `GET /api/admin/stats` - Статистика
- `GET /api/admin/orders/recent` - Последние заказы

**Products:**
- `POST /api/admin/products` - Создать товар
- `PUT /api/admin/products/{id}` - Обновить товар
- `DELETE /api/admin/products/{id}` - Удалить товар

**Collections:**
- `POST /api/admin/collections` - Создать коллекцию
- `PUT /api/admin/collections/{id}` - Обновить коллекцию
- `DELETE /api/admin/collections/{id}` - Удалить коллекцию

**Orders:**
- `GET /api/admin/orders` - Список заказов
- `GET /api/admin/orders/{id}` - Заказ по ID
- `PUT /api/admin/orders/{id}/status` - Обновить статус

**Content:**
- `PUT /api/admin/content/hero` - Обновить Hero
- `PUT /api/admin/content/promo-banner` - Обновить баннер
- `PUT /api/admin/content/featured-watches` - Обновить избранные
- `PUT /api/admin/content/heritage` - Обновить Heritage

**Upload:**
- `POST /api/admin/upload` - Загрузить изображение

---

## 🗄️ База данных

### Таблицы

**users** - Пользователи
- id, email, password_hash, name, role, created_at

**products** - Товары
- id, name, collection, price, image, images, description, features, specs, in_stock, stock_quantity, sku, created_at, updated_at

**collections** - Коллекции
- id, name, description, image, watch_count, number, active, created_at

**orders** - Заказы
- id, order_number, user_id, customer_data, items, subtotal, shipping, total, status, payment_method, delivery_method, delivery_address, notes, created_at, updated_at

**content_hero** - Hero секция
- id, title, subtitle, image, cta_text, cta_link, updated_at

**content_promo_banner** - Промо баннер
- id, text, code, active, background_color, text_color, highlight_color, updated_at

**content_featured_watches** - Избранные часы
- id, product_id, order_num, is_new

**content_heritage** - Heritage секция
- id, title, subtitle, description, cta_text, cta_link, years_text, updated_at

### Просмотр БД

Используйте любой SQLite клиент:
- DB Browser for SQLite (https://sqlitebrowser.org/)
- VS Code extension: SQLite Viewer
- Командная строка: `sqlite3 orient.db`

---

## 🔧 Настройка

### Изменить порт

В `main.py`:

```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    # Измените port=8000 на нужный
```

### Изменить SECRET_KEY

В `auth.py`:

```python
SECRET_KEY = "your-secret-key-change-in-production-use-env-variable"
# Замените на свой секретный ключ
```

**Для production используйте переменные окружения!**

### Добавить CORS origins

В `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://yourdomain.com",  # Добавьте свой домен
    ],
    # ...
)
```

---

## 🧪 Тестирование

### Тест через Swagger UI

1. Откройте http://localhost:8000/docs
2. Попробуйте любой endpoint
3. Для админских endpoints:
   - Сначала вызовите `POST /api/admin/login`
   - Скопируйте token из ответа
   - Нажмите "Authorize" вверху страницы
   - Вставьте token
   - Теперь можете вызывать админские endpoints

### Тест через curl

```bash
# Получить товары
curl http://localhost:8000/api/products

# Логин
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orient.uz","password":"admin123"}'

# Создать товар (замените YOUR_TOKEN)
curl -X POST http://localhost:8000/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Watch",
    "collection": "SPORTS",
    "price": 50000,
    "inStock": true,
    "stockQuantity": 10
  }'
```

---

## 🚀 Production Deployment

### 1. Используйте переменные окружения

Создайте `.env` файл:

```env
SECRET_KEY=your-super-secret-production-key
DATABASE_URL=sqlite:///./orient_production.db
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 2. Используйте Gunicorn

```bash
pip install gunicorn

gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

### 3. Настройте Nginx

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Используйте HTTPS

Установите SSL сертификат (Let's Encrypt):

```bash
sudo certbot --nginx -d api.yourdomain.com
```

---

## 🐛 Troubleshooting

### Ошибка: ModuleNotFoundError

```bash
# Убедитесь что виртуальное окружение активировано
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Переустановите зависимости
pip install -r requirements.txt
```

### Ошибка: Database is locked

SQLite не поддерживает много одновременных записей. Для production используйте PostgreSQL или MySQL.

### Ошибка: CORS

Добавьте ваш frontend URL в `allow_origins` в `main.py`

### Ошибка: 401 Unauthorized

- Проверьте что токен передается в заголовке `Authorization: Bearer TOKEN`
- Проверьте что токен не истек (24 часа)
- Попробуйте залогиниться заново

---

## 📚 Дополнительная документация

- FastAPI: https://fastapi.tiangolo.com/
- SQLAlchemy: https://www.sqlalchemy.org/
- Pydantic: https://docs.pydantic.dev/

---

## ✅ Чеклист запуска

- [ ] Python 3.9+ установлен
- [ ] Виртуальное окружение создано и активировано
- [ ] Зависимости установлены (`pip install -r requirements.txt`)
- [ ] База данных инициализирована (`python init_db.py`)
- [ ] Backend запущен (`python main.py`)
- [ ] Swagger UI открывается (http://localhost:8000/docs)
- [ ] Frontend `.env` настроен (`VITE_API_URL=http://localhost:8000`)
- [ ] Frontend запущен (`npm run dev`)
- [ ] Главная страница загружается
- [ ] Админка работает (логин: admin@orient.uz / admin123)

---

**Готово! Backend полностью настроен и готов к работе!** 🎉
