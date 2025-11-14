# 🔧 Admin Panel Fixes

## ✅ Исправленные проблемы

### **1. Upload endpoint - 404 Not Found** ✅

**Исправление:** Добавлен префикс `/api`

### **2. Коллекции захардкожены в ProductForm** ✅

**Исправление:** Динамическая загрузка из API

### **3. Admin collections endpoint - 405 Method Not Allowed** ✅

**Исправление:** Добавлен `GET /api/admin/collections`

### **4. Admin products endpoint - 405 Method Not Allowed** ✅

**Исправление:** Добавлен `GET /api/admin/products`

### **5. Изображения не отображаются** ✅

**Исправление:** Возвращается полный URL вместо относительного

### **6. Список товаров не загружается** ✅

**Исправление:** Используется `api.getProducts()`

### **7. Admin content endpoints - 405 Method Not Allowed** ✅

**Проблема:**
```
GET /api/admin/content/hero HTTP/1.1" 405 Method Not Allowed
GET /api/admin/content/promo-banner HTTP/1.1" 405 Method Not Allowed
GET /api/admin/content/featured-watches HTTP/1.1" 405 Method Not Allowed
GET /api/admin/content/heritage HTTP/1.1" 405 Method Not Allowed
```

**Причина:**
В `backend/routes/content.py` были только публичные GET endpoints (`/api/content/*`), но не было админских (`/api/admin/content/*`)

**Исправление:**
Добавлены отдельные админские GET endpoints:

```python
@router.get("/api/admin/content/hero")
async def get_hero_content_admin(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get hero content (admin)"""
    # ...

@router.get("/api/admin/content/promo-banner")
async def get_promo_banner_admin(...)

@router.get("/api/admin/content/featured-watches")
async def get_featured_watches_admin(...)

@router.get("/api/admin/content/heritage")
async def get_heritage_section_admin(...)
```

**Разница между публичным и админским:**
- **Публичный** (`/api/content/*`): без авторизации
- **Админский** (`/api/admin/content/*`): требует JWT токен

✅ **Теперь работает:** Все админские content endpoints

---

## 📊 Полный список API Endpoints

### **Публичные (без авторизации):**
```
GET /api/products                      - Товары (limit 20)
GET /api/products/{id}                 - Товар по ID
GET /api/collections                   - Активные коллекции
GET /api/collections/{id}              - Коллекция по ID
GET /api/content/hero                  - Hero контент
GET /api/content/promo-banner          - Промо баннер
GET /api/content/featured-watches      - Избранные товары
GET /api/content/heritage              - Heritage секция
```

### **Админские (требуют JWT):**
```
# Auth
POST   /api/admin/login                - Вход в админку

# Products
GET    /api/admin/products             - Все товары (limit 100)
GET    /api/admin/products/{id}        - Товар по ID
POST   /api/admin/products             - Создать товар
PUT    /api/admin/products/{id}        - Обновить товар
DELETE /api/admin/products/{id}        - Удалить товар

# Collections
GET    /api/admin/collections          - Все коллекции
GET    /api/admin/collections/{id}     - Коллекция по ID
POST   /api/admin/collections          - Создать коллекцию
PUT    /api/admin/collections/{id}     - Обновить коллекцию
DELETE /api/admin/collections/{id}     - Удалить коллекцию

# Content
GET    /api/admin/content/hero         - Hero контент
PUT    /api/admin/content/hero         - Обновить hero
GET    /api/admin/content/promo-banner - Промо баннер
PUT    /api/admin/content/promo-banner - Обновить баннер
GET    /api/admin/content/featured-watches - Избранные товары
PUT    /api/admin/content/featured-watches - Обновить избранные
GET    /api/admin/content/heritage     - Heritage секция
PUT    /api/admin/content/heritage     - Обновить heritage

# Upload
POST   /api/admin/upload               - Загрузить изображение

# Orders
GET    /api/admin/orders               - Все заказы
GET    /api/admin/orders/{id}          - Заказ по ID
PUT    /api/admin/orders/{id}          - Обновить статус

# Bookings
GET    /api/admin/bookings             - Все записи в бутик
GET    /api/admin/bookings/{id}        - Запись по ID
PUT    /api/admin/bookings/{id}        - Обновить статус

# Stats
GET    /api/admin/stats                - Статистика
GET    /api/admin/orders/recent        - Последние заказы
```

---

## ✅ Результат

### **Все проблемы исправлены:**
- ✅ Upload: 200 OK + полный URL
- ✅ Коллекции: динамические из БД
- ✅ Admin collections: 200 OK
- ✅ Admin products: 200 OK
- ✅ Admin content: 200 OK ← **Новое!**
- ✅ Изображения: отображаются
- ✅ Список товаров: загружается
- ✅ Централизованный API service

---

## 🎉 Готово!

Все админские endpoints работают! Админка полностью функциональна.