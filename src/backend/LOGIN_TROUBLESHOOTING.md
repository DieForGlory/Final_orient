#🔐 Login Troubleshooting Guide

## ❌ Проблема: Не могу войти в админку

### **Симптомы:**
- Ввожу `admin@orient.uz` / `admin123`
- Получаю ошибку "Неверный email или пароль"
- Или ошибку сети/CORS

---

## ✅ Решение

### **Шаг 1: Проверьте что Backend запущен**

```bash
# Проверьте что backend работает
curl http://localhost:8000/health

# Должно вернуть:
# {"status":"healthy"}
```

Если не работает:
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

---

### **Шаг 2: Проверьте админ пользователя**

```bash
cd backend
python check_admin.py
```

**Ожидаемый вывод:**
```
✅ Password 'admin123' is CORRECT
```

**Если видите:**
```
❌ Admin user NOT FOUND!
```

Запустите:
```bash
python reset_admin.py
```

---

### **Шаг 3: Сбросьте пароль админа**

```bash
cd backend
python reset_admin.py
```

**Вывод:**
```
✅ Admin password reset!

==================================================
ADMIN CREDENTIALS:
==================================================
Email:    admin@orient.uz
Password: admin123
==================================================
✅ Password verification: OK
```

---

### **Шаг 4: Проверьте API endpoint**

```bash
# Тест login endpoint
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orient.uz","password":"admin123"}'
```

**Должно вернуть:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "email": "admin@orient.uz",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Если ошибка 401:**
```json
{
  "detail": "Invalid email or password"
}
```

→ Запустите `python reset_admin.py`

---

### **Шаг 5: Проверьте Frontend**

Откройте DevTools (F12) → Console

**При попытке входа должно быть:**
```
POST http://localhost:8000/api/admin/login 200 OK
```

**Если видите:**
```
POST http://localhost:8000/api/admin/login 401 Unauthorized
```

→ Неверный пароль, запустите `python reset_admin.py`

**Если видите:**
```
POST http://localhost:8000/api/admin/login net::ERR_CONNECTION_REFUSED
```

→ Backend не запущен

**Если видите:**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

→ Проблема с CORS, см. [CORS_FIX_GUIDE.md](../CORS_FIX_GUIDE.md)

---

## 🔍 Диагностика

### **Проверка 1: База данных**

```bash
cd backend
sqlite3 orient.db

SELECT * FROM users WHERE role='admin';

.quit
```

Должен быть пользователь с email `admin@orient.uz`

### **Проверка 2: Хеш пароля**

```bash
cd backend
python check_admin.py
```

Проверит что пароль хешируется и верифицируется правильно.

### **Проверка 3: Frontend .env**

```bash
cat .env
```

Должно быть:
```env
VITE_API_URL=http://localhost:8000
```

### **Проверка 4: Backend логи**

При попытке входа в backend логах должно быть:
```
INFO: 127.0.0.1:xxxxx - "POST /api/admin/login HTTP/1.1" 200 OK
```

**Если 401:**
```
INFO: 127.0.0.1:xxxxx - "POST /api/admin/login HTTP/1.1" 401 Unauthorized
```

→ Неверный пароль

**Если 404:**
```
INFO: 127.0.0.1:xxxxx - "POST /api/admin/login HTTP/1.1" 404 Not Found
```

→ Неправильный URL, проверьте что endpoint `/api/admin/login` существует

---

## 🛠️ Быстрое исправление

### **Полный сброс:**

```bash
# 1. Остановите backend (Ctrl+C)

# 2. Удалите БД
cd backend
rm orient.db

# 3. Пересоздайте БД
python init_db.py

# 4. Запустите backend
uvicorn main:app --reload --port 8000

# 5. Попробуйте войти
# Email: admin@orient.uz
# Password: admin123
```

---

## 📋 Чеклист

- [ ] Backend запущен на http://localhost:8000
- [ ] Frontend запущен на http://localhost:5173
- [ ] База данных существует (orient.db)
- [ ] Админ пользователь создан
- [ ] Пароль правильный (admin123)
- [ ] CORS настроен
- [ ] Frontend использует правильный API URL

---

## 🎯 Тестовые учетные данные

```
Email:    admin@orient.uz
Password: admin123
```

**После входа:**
- Токен сохраняется в localStorage
- Перенаправление на /admin/dashboard
- Токен используется для всех API запросов

---

## 📞 Дополнительная помощь

Если проблема не решена:

1. Запустите `python check_admin.py` - полная диагностика
2. Запустите `python reset_admin.py` - сброс пароля
3. Проверьте backend логи
4. Проверьте browser console (F12)
5. Проверьте Network tab в DevTools

---

## 🔧 Скрипты для диагностики

```bash
# Проверить админа
python check_admin.py

# Сбросить пароль
python reset_admin.py

# Пересоздать БД
rm orient.db
python init_db.py

# Проверить API
curl http://localhost:8000/api/admin/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orient.uz","password":"admin123"}'
```

---

**Проблема должна быть решена!** 🎉
