#🗄️ Database Initialization Guide

## ✅ Исправлена ошибка с Product ID

### **Проблема:**
```
NOT NULL constraint failed: products.id
```

### **Причина:**
В модели `Product` поле `id` имеет тип `String` (не Integer с autoincrement), поэтому нужно явно указывать ID при создании продуктов.

### **Решение:**
Добавлены явные ID для всех продуктов в формате `kebab-case`:
- `kamasu-automatic-diver`
- `bambino-classic`
- `mako-iii-automatic`
- `sun-moon-classic`
- `ray-ii-automatic`
- `defender-chronograph`

---

## 🚀 Как инициализировать БД

### **Шаг 1: Удалите старую БД (если есть)**
```bash
cd backend
rm orient.db
```

### **Шаг 2: Запустите init_db.py**
```bash
python init_db.py
```

### **Ожидаемый вывод:**
```
Initializing database...

Creating default data...
Creating admin user...
Creating collections...
Creating products...
Creating default content...
✅ Database initialized successfully!

==================================================
DEFAULT CREDENTIALS:
==================================================
Email:    admin@orient.uz
Password: admin123
==================================================

✅ 6 products created
✅ 3 collections created
✅ Default content created

You can now start the server with: python main.py
```

---

## 📊 Что создается в БД

### **1. Admin User**
- Email: `admin@orient.uz`
- Password: `admin123`
- Role: `admin`

### **2. Collections (3)**
| ID | Name | Description |
|----|------|-------------|
| `sports` | SPORTS | Профессиональные дайверские часы |
| `classic` | CLASSIC | Элегантные классические часы |
| `contemporary` | CONTEMPORARY | Современные часы |

### **3. Products (6)**
| ID | Name | Collection | Price | Featured |
|----|------|------------|-------|----------|
| `kamasu-automatic-diver` | Kamasu Automatic Diver | SPORTS | 45,900₽ | ✅ |
| `bambino-classic` | Bambino Classic | CLASSIC | 32,900₽ | ✅ |
| `mako-iii-automatic` | Mako III Automatic | SPORTS | 41,900₽ | ✅ |
| `sun-moon-classic` | Sun & Moon Classic | CLASSIC | 67,900₽ | ✅ |
| `ray-ii-automatic` | Ray II Automatic | SPORTS | 38,900₽ | ❌ |
| `defender-chronograph` | Defender Chronograph | CONTEMPORARY | 52,900₽ | ✅ |

### **4. Content**
- Hero section (главная страница)
- Promo banner (скидка 15%)
- Heritage section (история бренда)

---

## 🔍 Проверка БД

### **Проверка через SQLite CLI:**
```bash
sqlite3 orient.db

# Проверить пользователей
SELECT * FROM users;

# Проверить товары
SELECT id, name, collection, price FROM products;

# Проверить коллекции
SELECT * FROM collections;

# Выход
.quit
```

### **Проверка через API:**
```bash
# Запустите сервер
python main.py

# В другом терминале
curl http://localhost:8000/api/products
curl http://localhost:8000/api/collections
```

---

## 🐛 Troubleshooting

### **Ошибка: "table already exists"**
```bash
# Удалите БД и пересоздайте
rm orient.db
python init_db.py
```

### **Ошибка: "NOT NULL constraint failed"**
Убедитесь, что используете обновленный `init_db.py` с явными ID для продуктов.

### **Ошибка: "No module named 'database'"**
```bash
# Убедитесь что вы в папке backend
cd backend
python init_db.py
```

### **Ошибка: "password_hash not found"**
```bash
# Установите зависимости
pip install passlib[bcrypt]
```

---

## 📝 Структура ID продуктов

ID генерируются в формате `kebab-case` из названия:

```python
"Kamasu Automatic Diver" → "kamasu-automatic-diver"
"Bambino Classic" → "bambino-classic"
"Sun & Moon Classic" → "sun-moon-classic"
```

Это обеспечивает:
- ✅ Читаемые URL: `/product/kamasu-automatic-diver`
- ✅ SEO-friendly
- ✅ Уникальность
- ✅ Простоту отладки

---

## ✅ После инициализации

1. **Запустите сервер:**
   ```bash
   python main.py
   ```

2. **Откройте Swagger:**
   http://localhost:8000/docs

3. **Проверьте товары:**
   http://localhost:8000/api/products

4. **Войдите в админку:**
   - URL: http://localhost:5173/admin/login
   - Email: `admin@orient.uz`
   - Password: `admin123`

---

## 🎉 Готово!

База данных инициализирована и готова к использованию!
