# 🚀 Orient Watch - Backend API

FastAPI backend для интернет-магазина часов Orient.

## 📋 Требования

- Python 3.10+
- pip

## 🔧 Установка

### 1. Создайте виртуальное окружение

```bash
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. Установите зависимости

```bash
pip install -r requirements.txt
```

### 3. Настройте переменные окружения

```bash
# Скопируйте пример
cp .env.example .env

# Отредактируйте .env файл
nano .env  # или любой другой редактор
```

**Важные переменные:**

```env
# Секретный ключ для JWT (ОБЯЗАТЕЛЬНО измените в production!)
SECRET_KEY=your-super-secret-key-change-this-in-production

# CORS - укажите URL вашего frontend (можно несколько через запятую)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# База данных
DATABASE_URL=sqlite:///./orient.db

# Админ по умолчанию
ADMIN_EMAIL=admin@orient.uz
ADMIN_PASSWORD=admin123
```

### 4. Инициализируйте базу данных

```bash
python init_db.py
```

Это создаст:
- ✅ Все таблицы БД
- ✅ Админ пользователя (admin@orient.uz / admin123)
- ✅ Тестовые товары и коллекции
- ✅ Контент для главной страницы

## 🚀 Запуск

### **Development (разработка):**

```bash
# Способ 1: С автоперезагрузкой (РЕКОМЕНДУЕТСЯ)
uvicorn main:app --reload --port 8000

# Способ 2: Через python
python main.py
```

### **Production (продакшн):**

```bash
# Простой запуск
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# С Gunicorn (РЕКОМЕНДУЕТСЯ для production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**📚 Подробнее:** См. [START_COMMANDS.md](./START_COMMANDS.md)

Backend запустится на `http://localhost:8000`

**API документация:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📁 Структура проекта

```
backend/
├── routes/              # API endpoints
│   ├── admin.py        # Авторизация и статистика
│   ├── products.py     # CRUD товаров
│   ├── collections.py  # CRUD коллекций
│   ├── orders.py       # Управление заказами
│   ├── bookings.py     # Записи в бутик
│   ├── content.py      # Управление контентом
│   └── upload.py       # Загрузка изображений
├── database.py         # SQLAlchemy модели
├── schemas.py          # Pydantic схемы
├── auth.py             # JWT авторизация
├── main.py             # Главный файл приложения
├── init_db.py          # Инициализация БД
├── .env                # Переменные окружения (НЕ коммитить!)
├── .env.example        # Пример переменных окружения
└── requirements.txt    # Python зависимости
```

## 🔐 Переменные окружения

### **Обязательные:**

| Переменная | Описание | Пример |
|------------|----------|--------|
| `SECRET_KEY` | Секретный ключ для JWT | `your-secret-key-here` |
| `CORS_ORIGINS` | Разрешенные frontend URLs | `http://localhost:5173,https://yourdomain.com` |

### **Опциональные:**

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DATABASE_URL` | URL базы данных | `sqlite:///./orient.db` |
| `ALGORITHM` | Алгоритм JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Время жизни токена | `30` |
| `UPLOAD_DIR` | Папка для загрузок | `uploads` |
| `MAX_UPLOAD_SIZE` | Макс. размер файла | `5242880` (5MB) |
| `PORT` | Порт сервера | `8000` |

### **Для production:**

```env
# Используйте PostgreSQL вместо SQLite
DATABASE_URL=postgresql://user:password@localhost/orient_db

# Укажите реальный домен frontend
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Сгенерируйте сильный секретный ключ
SECRET_KEY=$(openssl rand -hex 32)
```

## 📚 API Endpoints

### **Public (без авторизации):**

```
GET    /api/products                    - Список товаров
GET    /api/products/{id}               - Товар по ID
GET    /api/collections                 - Список коллекций
GET    /api/collections/{id}            - Коллекция по ID
POST   /api/orders                      - Создать заказ
POST   /api/bookings                    - Создать запись в бутик
GET    /api/content/hero                - Hero контент
GET    /api/test                        - Тестовый endpoint
```

### **Admin (требуют JWT токен):**

```
POST   /api/admin/login                 - Вход в админку
GET    /api/admin/stats                 - Статистика
GET    /api/admin/products              - Управление товарами
GET    /api/admin/orders                - Управление заказами
GET    /api/admin/bookings              - Управление записями
POST   /api/admin/upload                - Загрузка изображений
```

Полная документация: http://localhost:8000/docs

## 🔧 Разработка

### Создание миграций

```bash
# После изменения моделей в database.py
python migrate_bookings.py
```

### Тестирование API

```bash
# Используйте Swagger UI
open http://localhost:8000/docs

# Или curl
curl http://localhost:8000/api/products
curl http://localhost:8000/api/test
```

## 🐛 Troubleshooting

### Backend не запускается

```bash
# Проверьте виртуальное окружение
which python  # должен показать путь к venv

# Переустановите зависимости
pip install -r requirements.txt
```

### CORS ошибки

Проверьте `.env` файл:
```env
# Убедитесь, что URL frontend указан правильно
CORS_ORIGINS=http://localhost:5173
```

См. [CORS_FIX_GUIDE.md](../CORS_FIX_GUIDE.md)

### База данных пустая

```bash
# Пересоздайте БД
rm orient.db
python init_db.py
```

См. [INIT_DB_GUIDE.md](./INIT_DB_GUIDE.md)

## 📝 Логи

Backend выводит логи в консоль:
```
🌐 CORS enabled for origins: ['http://localhost:5173', 'http://localhost:3000']
🚀 Starting server on http://0.0.0.0:8000
📚 API docs: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     127.0.0.1:xxxxx - "GET /api/products HTTP/1.1" 200 OK
```

## 🚀 Production Deployment

### 1. Измените переменные окружения

```env
SECRET_KEY=$(openssl rand -hex 32)
DATABASE_URL=postgresql://user:password@host/db
CORS_ORIGINS=https://yourdomain.com
```

### 2. Используйте production сервер

```bash
# Gunicorn + Uvicorn workers (РЕКОМЕНДУЕТСЯ)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Или uvicorn с несколькими workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 3. Настройте HTTPS

Используйте Nginx или Caddy как reverse proxy.

**Подробнее:** См. [START_COMMANDS.md](./START_COMMANDS.md)

## 📞 Поддержка

Если возникли вопросы:
1. Проверьте логи backend
2. Проверьте `.env` файл
3. Проверьте Swagger документацию: http://localhost:8000/docs
4. См. [CORS_FIX_GUIDE.md](../CORS_FIX_GUIDE.md)
5. См. [START_COMMANDS.md](./START_COMMANDS.md)

---

**Создано с ❤️ для Orient Watch**