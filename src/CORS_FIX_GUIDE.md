#🔧 CORS Fix Guide

## ❌ Проблема

```
OPTIONS /api/content/hero HTTP/1.1" 400 Bad Request
OPTIONS /api/collections HTTP/1.1" 400 Bad Request
```

Frontend не может достучаться до Backend из-за CORS preflight запросов.

---

## ✅ Решение

### **Что было исправлено в `backend/main.py`:**

1. ✅ **Добавлен явный список методов** (включая OPTIONS)
2. ✅ **Добавлен expose_headers и max_age**
3. ✅ **Изменен порядок**: CORS → Routes → Static Files
4. ✅ **Добавлен тестовый endpoint** `/api/test`
5. ✅ **Добавлен debug вывод** CORS origins при старте

---

## 🚀 Как применить исправление

### **Шаг 1: Перезапустите Backend**

```bash
# Остановите backend (Ctrl+C)

# Запустите заново
cd backend
source venv/bin/activate  # или venv\Scripts\activate
python main.py
```

**Ожидаемый вывод:**
```
🌐 CORS enabled for origins: ['http://localhost:5173', 'http://localhost:3000']
🚀 Starting server on http://0.0.0.0:8000
📚 API docs: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### **Шаг 2: Проверьте CORS**

Откройте в браузере:
```
http://localhost:8000/
```

Вы должны увидеть:
```json
{
  "message": "Orient Watch API",
  "version": "1.0.0",
  "status": "running",
  "cors_origins": ["http://localhost:5173", "http://localhost:3000"]
}
```

### **Шаг 3: Тест API endpoint**

```
http://localhost:8000/api/test
```

Должно вернуть:
```json
{
  "message": "API is working!",
  "cors": "enabled"
}
```

### **Шаг 4: Перезапустите Frontend**

```bash
# Остановите frontend (Ctrl+C)

# Запустите заново
npm run dev
```

### **Шаг 5: Проверьте в браузере**

1. Откройте http://localhost:5173
2. Откройте DevTools (F12) → Console
3. Не должно быть CORS ошибок
4. Товары и коллекции должны загрузиться

---

## 🔍 Диагностика

### **Проверка 1: Backend логи**

При запуске должно быть:
```
🌐 CORS enabled for origins: ['http://localhost:5173', 'http://localhost:3000']
```

При запросах с frontend должно быть:
```
INFO: 127.0.0.1:xxxxx - "OPTIONS /api/products HTTP/1.1" 200 OK
INFO: 127.0.0.1:xxxxx - "GET /api/products HTTP/1.1" 200 OK
```

**НЕ должно быть:**
```
INFO: 127.0.0.1:xxxxx - "OPTIONS /api/products HTTP/1.1" 400 Bad Request
```

### **Проверка 2: Browser DevTools**

**Console** - не должно быть:
```
Access to fetch at 'http://localhost:8000/api/products' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Network** - OPTIONS запросы должны быть 200 OK:
```
OPTIONS /api/products    200 OK
GET     /api/products    200 OK
```

### **Проверка 3: Curl тест**

```bash
# Тест OPTIONS запроса
curl -X OPTIONS http://localhost:8000/api/products \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Должно вернуть:
# < HTTP/1.1 200 OK
# < access-control-allow-origin: http://localhost:5173
# < access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
```

---

## 🐛 Troubleshooting

### **Проблема: Все еще 400 Bad Request**

```bash
# 1. Проверьте .env файл
cat backend/.env
# Должно быть: CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# 2. Убедитесь что нет лишних пробелов
# Правильно:   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
# Неправильно: CORS_ORIGINS=http://localhost:5173, http://localhost:3000

# 3. Перезапустите backend
cd backend
python main.py
```

### **Проблема: Frontend на другом порту**

Если ваш frontend запустился на другом порту (например, 5174):

```bash
# Обновите backend/.env
CORS_ORIGINS=http://localhost:5174,http://localhost:5173,http://localhost:3000

# Перезапустите backend
python main.py
```

### **Проблема: CORS origins не выводятся**

```bash
# Проверьте что python-dotenv установлен
pip install python-dotenv

# Проверьте что .env файл существует
ls -la backend/.env

# Перезапустите backend
python main.py
```

### **Проблема: 404 Not Found**

Если получаете 404 вместо 400:

```bash
# Проверьте что все роуты имеют /api префикс
# Откройте http://localhost:8000/docs
# Все endpoints должны начинаться с /api/
```

---

## ✅ Что изменилось в main.py

### **До:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **После:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],  # ← Добавлено
    max_age=3600,          # ← Добавлено
)
```

### **Порядок:**
```python
# 1. CORS middleware
app.add_middleware(CORSMiddleware, ...)

# 2. Routes
app.include_router(products.router)
app.include_router(collections.router)
...

# 3. Static files (ПОСЛЕ routes!)
app.mount("/uploads", StaticFiles(...))
```

---

## 📊 Проверка успешного исправления

### **✅ Backend запущен:**
```
🌐 CORS enabled for origins: ['http://localhost:5173', 'http://localhost:3000']
🚀 Starting server on http://0.0.0.0:8000
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### **✅ OPTIONS запросы успешны:**
```
INFO: 127.0.0.1:xxxxx - "OPTIONS /api/products HTTP/1.1" 200 OK
INFO: 127.0.0.1:xxxxx - "GET /api/products HTTP/1.1" 200 OK
```

### **✅ Frontend загружается:**
- Главная страница показывает товары ✅
- Каталог работает ✅
- Нет CORS ошибок в консоли ✅

---

## 🎉 Готово!

После применения исправлений:
1. ✅ OPTIONS запросы возвращают 200 OK
2. ✅ CORS preflight работает
3. ✅ Frontend успешно обращается к Backend
4. ✅ Все API endpoints доступны

**Проблема решена!** 🚀
