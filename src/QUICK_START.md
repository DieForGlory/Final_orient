#⚡ Quick Start Guide

## 🚀 Быстрый запуск за 5 минут

### 1️⃣ Установка зависимостей (1 мин)

```bash
# Frontend
npm install

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
# или
venv\Scripts\activate     # Windows
pip install -r requirements.txt
cd ..
```

### 2️⃣ Проверка .env файлов (30 сек)

**Frontend (.env)** - уже создан ✅
```env
VITE_API_URL=http://localhost:8000
```

**Backend (backend/.env)** - уже создан ✅
```env
SECRET_KEY=orient-watch-secret-key-change-in-production-2024
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
DATABASE_URL=sqlite:///./orient.db
```

### 3️⃣ Инициализация БД (30 сек)

```bash
cd backend
python init_db.py
```

Вы увидите:
```
✅ Database initialized successfully!
✅ 6 products created
✅ 3 collections created
```

### 4️⃣ Запуск (1 мин)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # или venv\Scripts\activate

# Способ 1: С автоперезагрузкой (РЕКОМЕНДУЕТСЯ для разработки)
uvicorn main:app --reload --port 8000

# Способ 2: Через python
python main.py
```

Ожидайте:
```
🌐 CORS enabled for origins: ['http://localhost:5173', 'http://localhost:3000']
🚀 Starting server on http://0.0.0.0:8000
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Ожидайте:
```
➜  Local:   http://localhost:5173/
```

### 5️⃣ Откройте сайт (10 сек)

- **Сайт:** http://localhost:5173
- **Админка:** http://localhost:5173/admin/login
  - Email: `admin@orient.uz`
  - Password: `admin123`
- **API Docs:** http://localhost:8000/docs

---

## ✅ Проверка работоспособности

### Тест 1: Главная страница
1. Откройте http://localhost:5173
2. Должны загрузиться товары и коллекции
3. Проверьте DevTools → Console (не должно быть ошибок)

### Тест 2: Каталог
1. Откройте http://localhost:5173/catalog
2. Должны отображаться 6 товаров
3. Попробуйте фильтры и поиск

### Тест 3: Админка
1. Откройте http://localhost:5173/admin/login
2. Войдите: `admin@orient.uz` / `admin123`
3. Должна открыться Dashboard со статистикой

### Тест 4: API
1. Откройте http://localhost:8000/docs
2. Swagger документация должна загрузиться
3. Попробуйте GET /api/products

### Тест 5: Backend логи
В терминале backend должны быть:
```
INFO: 127.0.0.1:xxxxx - "OPTIONS /api/products HTTP/1.1" 200 OK ✅
INFO: 127.0.0.1:xxxxx - "GET /api/products HTTP/1.1" 200 OK ✅
```

**НЕ должно быть 400 Bad Request!**

---

## 🚀 Команды запуска Backend

### **Development (разработка):**
```bash
# С автоперезагрузкой (РЕКОМЕНДУЕТСЯ)
uvicorn main:app --reload --port 8000

# Или через python
python main.py
```

### **Production (продакшн):**
```bash
# Простой запуск
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# С Gunicorn (BEST для production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**📚 Подробнее:** См. [backend/START_COMMANDS.md](./backend/START_COMMANDS.md)

---

## 🐛 Troubleshooting

### Backend не запускается
```bash
# Проверьте виртуальное окружение
which python  # должен показать путь к venv

# Переустановите зависимости
pip install -r requirements.txt
```

### Frontend не видит Backend
```bash
# Проверьте .env
cat .env
# Должно быть: VITE_API_URL=http://localhost:8000

# Перезапустите dev server
npm run dev
```

### CORS ошибки (400 Bad Request)
```bash
# Перезапустите backend с обновленным main.py
cd backend
uvicorn main:app --reload --port 8000

# Проверьте логи - должно быть 200 OK, не 400
```

См. [CORS_FIX_GUIDE.md](./CORS_FIX_GUIDE.md)

### База данных пустая или ошибка "NOT NULL constraint"
```bash
cd backend
rm orient.db
python init_db.py
```

См. [backend/INIT_DB_GUIDE.md](./backend/INIT_DB_GUIDE.md)

---

## 📚 Дополнительная документация

- **[README.md](./README.md)** - Полная документация
- **[backend/README.md](./backend/README.md)** - Backend документация
- **[backend/START_COMMANDS.md](./backend/START_COMMANDS.md)** - Команды запуска
- **[backend/INIT_DB_GUIDE.md](./backend/INIT_DB_GUIDE.md)** - Руководство по БД
- **[CORS_FIX_GUIDE.md](./CORS_FIX_GUIDE.md)** - Исправление CORS
- **[RESTART_GUIDE.md](./RESTART_GUIDE.md)** - Быстрый перезапуск
- **[INTEGRATION_TEST_REPORT.md](./INTEGRATION_TEST_REPORT.md)** - Отчет интеграции

---

## 🎯 Что дальше?

1. **Добавьте товары** через админку
2. **Настройте контент** на главной странице
3. **Протестируйте заказы** и записи в бутик
4. **Измените дизайн** под свой бренд
5. **Подготовьте к production** (см. PRODUCTION_READINESS_CHECKLIST.md)

---

## 📊 Что создается в БД

### **Товары (6):**
- Kamasu Automatic Diver (45,900₽) - SPORTS
- Bambino Classic (32,900₽) - CLASSIC
- Mako III Automatic (41,900₽) - SPORTS
- Sun & Moon Classic (67,900₽) - CLASSIC
- Ray II Automatic (38,900₽) - SPORTS
- Defender Chronograph (52,900₽) - CONTEMPORARY

### **Коллекции (3):**
- SPORTS - Дайверские часы
- CLASSIC - Классические часы
- CONTEMPORARY - Современные часы

### **Контент:**
- Hero секция
- Промо баннер (скидка 15%)
- Heritage секция

---

## 🎉 Готово!

Проект запущен и работает!

**Сайт:** http://localhost:5173  
**API Docs:** http://localhost:8000/docs  
**Админка:** http://localhost:5173/admin/login

**Оба способа запуска backend работают:**
- ✅ `uvicorn main:app --reload` (для разработки)
- ✅ `python main.py` (тоже работает)

Приятной работы! 🚀