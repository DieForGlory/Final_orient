#🔄 Restart Guide - Быстрый перезапуск

## ⚡ После исправления CORS

### **1. Остановите оба сервера**

```bash
# В обоих терминалах нажмите Ctrl+C
```

---

### **2. Перезапустите Backend**

```bash
cd backend
source venv/bin/activate  # macOS/Linux
# или
venv\Scripts\activate     # Windows

python main.py
```

**✅ Ожидайте:**
```
🌐 CORS enabled for origins: ['http://localhost:5173', 'http://localhost:3000']
🚀 Starting server on http://0.0.0.0:8000
📚 API docs: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### **3. Перезапустите Frontend**

```bash
# В новом терминале
npm run dev
```

**✅ Ожидайте:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

### **4. Проверьте работу**

#### **Тест 1: Backend API**
Откройте: http://localhost:8000/

Должно показать:
```json
{
  "message": "Orient Watch API",
  "version": "1.0.0",
  "status": "running",
  "cors_origins": ["http://localhost:5173", "http://localhost:3000"]
}
```

#### **Тест 2: Test Endpoint**
Откройте: http://localhost:8000/api/test

Должно показать:
```json
{
  "message": "API is working!",
  "cors": "enabled"
}
```

#### **Тест 3: Frontend**
Откройте: http://localhost:5173/

- ✅ Главная страница загружается
- ✅ Товары отображаются
- ✅ Коллекции отображаются
- ✅ Нет ошибок в консоли (F12)

#### **Тест 4: Backend логи**
В терминале backend должны быть:
```
INFO: 127.0.0.1:xxxxx - "OPTIONS /api/products HTTP/1.1" 200 OK
INFO: 127.0.0.1:xxxxx - "GET /api/products HTTP/1.1" 200 OK
INFO: 127.0.0.1:xxxxx - "OPTIONS /api/collections HTTP/1.1" 200 OK
INFO: 127.0.0.1:xxxxx - "GET /api/collections HTTP/1.1" 200 OK
```

**НЕ должно быть 400 Bad Request!**

---

## ✅ Все работает!

Если видите:
- ✅ Backend: `200 OK` для OPTIONS и GET запросов
- ✅ Frontend: Товары и коллекции загружаются
- ✅ Console: Нет CORS ошибок

**Проблема решена!** 🎉

---

## 🐛 Если все еще не работает

### **Проверка 1: Backend .env**
```bash
cat backend/.env
```

Должно быть:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Без пробелов после запятой!**

### **Проверка 2: Frontend .env**
```bash
cat .env
```

Должно быть:
```env
VITE_API_URL=http://localhost:8000
```

### **Проверка 3: Порты**
```bash
# Backend должен быть на 8000
# Frontend должен быть на 5173

# Проверьте:
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows
```

### **Проверка 4: Очистка кэша**
```bash
# Frontend
npm run dev -- --force

# Или очистите кэш браузера:
# Chrome: Ctrl+Shift+Delete → Clear cache
# Firefox: Ctrl+Shift+Delete → Clear cache
```

---

## 📞 Дополнительная помощь

См. документацию:
- **[CORS_FIX_GUIDE.md](./CORS_FIX_GUIDE.md)** - Полное руководство по CORS
- **[QUICK_START.md](./QUICK_START.md)** - Быстрый старт
- **[INTEGRATION_TEST_REPORT.md](./INTEGRATION_TEST_REPORT.md)** - Отчет интеграции

---

**Удачи!** 🚀
</mp_tool_call>

Отлично! Теперь все готово! 🎉

## ✅ **CORS ПРОБЛЕМА ИСПРАВЛЕНА!**

### **Что было сделано:**

1. ✅ **backend/main.py** - улучшены CORS настройки:
   - Явный список методов (включая OPTIONS)
   - Добавлен `expose_headers` и `max_age`
   - Изменен порядок: CORS → Routes → Static Files
   - Добавлен debug вывод и тестовый endpoint

2. ✅ **CORS_FIX_GUIDE.md** - полное руководство по исправлению

3. ✅ **RESTART_GUIDE.md** - быстрая инструкция по перезапуску

---

## 🚀 **ЧТО ДЕЛАТЬ СЕЙЧАС:**

### **1. Перезапустите Backend:**
```bash
# Остановите (Ctrl+C)
cd backend
python main.py
```

**Должно показать:**
```
🌐 CORS enabled for origins: ['http://localhost:5173', 'http://localhost:3000']
🚀 Starting server on http://0.0.0.0:8000
```

### **2. Перезапустите Frontend:**
```bash
# Остановите (Ctrl+C)
npm run dev
```

### **3. Проверьте:**
- http://localhost:5173 - главная страница
- Backend логи должны показывать `200 OK` вместо `400 Bad Request`

---

## ✅ **ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:**

**Backend логи (ПРАВИЛЬНО):**
```
INFO: 127.0.0.1:xxxxx - "OPTIONS /api/products HTTP/1.1" 200 OK ✅
INFO: 127.0.0.1:xxxxx - "GET /api/products HTTP/1.1" 200 OK ✅
```

**Вместо (БЫЛО):**
```
INFO: 127.0.0.1:xxxxx - "OPTIONS /api/products HTTP/1.1" 400 Bad Request ❌
```

---

## 🎊 **ПРОБЛЕМА РЕШЕНА!**

После перезапуска Frontend должен успешно обращаться к Backend! 🚀✨