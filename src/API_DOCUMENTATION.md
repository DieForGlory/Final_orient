# Orient Watch - API Documentation

## Базовая информация

**Base URL:** `https://api.orient.uz` (замените на ваш домен)

**Аутентификация:** JWT Bearer Token

**Формат данных:** JSON

**Кодировка:** UTF-8

---

## Аутентификация

### POST /api/admin/login
Вход администратора в систему

**Request Body:**
```json
{
  "email": "admin@orient.uz",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@orient.uz",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Errors:**
- `401 Unauthorized` - Неверный email или пароль
- `400 Bad Request` - Отсутствуют обязательные поля

---

## Dashboard

### GET /api/admin/stats
Получить общую статистику

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "totalProducts": 12,
  "totalOrders": 156,
  "totalRevenue": 7890000,
  "totalUsers": 342,
  "pendingOrders": 8,
  "completedOrders": 15
}
```

### GET /api/admin/orders/recent
Получить последние заказы

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (optional, default: 10) - Количество заказов

**Response (200 OK):**
```json
[
  {
    "id": "ORD-001",
    "customerName": "Иван Иванов",
    "total": 45900,
    "status": "pending",
    "date": "2025-01-15"
  },
  {
    "id": "ORD-002",
    "customerName": "Петр Петров",
    "total": 67900,
    "status": "completed",
    "date": "2025-01-14"
  }
]
```

---

## Товары (Products)

### GET /api/admin/products
Получить список всех товаров

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional, default: 1) - Номер страницы
- `limit` (optional, default: 20) - Количество на странице
- `search` (optional) - Поиск по названию
- `collection` (optional) - Фильтр по коллекции
- `inStock` (optional) - Фильтр по наличию (true/false)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Kamasu Automatic Diver",
      "collection": "SPORTS",
      "price": 45900,
      "image": "https://cdn.orient.uz/products/kamasu.jpg",
      "images": [
        "https://cdn.orient.uz/products/kamasu-1.jpg",
        "https://cdn.orient.uz/products/kamasu-2.jpg"
      ],
      "description": "Профессиональные дайверские часы...",
      "features": [
        "Автоматический механизм Orient F6922",
        "Водонепроницаемость 200 метров"
      ],
      "specs": {
        "movement": "Автоматический Orient F6922",
        "case": "Нержавеющая сталь 316L",
        "diameter": "41.8 мм",
        "waterResistance": "200 метров"
      },
      "inStock": true,
      "stockQuantity": 15,
      "sku": "RA-AA0004E19B",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-15T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

### GET /api/admin/products/:id
Получить товар по ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Kamasu Automatic Diver",
  "collection": "SPORTS",
  "price": 45900,
  "image": "https://cdn.orient.uz/products/kamasu.jpg",
  "images": [
    "https://cdn.orient.uz/products/kamasu-1.jpg",
    "https://cdn.orient.uz/products/kamasu-2.jpg",
    "https://cdn.orient.uz/products/kamasu-3.jpg"
  ],
  "description": "Профессиональные дайверские часы с непревзойденной надежностью...",
  "features": [
    "Автоматический механизм Orient F6922",
    "Водонепроницаемость 200 метров (ISO 6425)",
    "Односторонний вращающийся безель"
  ],
  "specs": {
    "movement": "Автоматический Orient F6922",
    "case": "Нержавеющая сталь 316L",
    "diameter": "41.8 мм",
    "thickness": "13 мм",
    "glass": "Сапфировое с AR покрытием",
    "waterResistance": "200 метров (20 ATM)",
    "powerReserve": "40 часов",
    "bracelet": "Нержавеющая сталь 316L",
    "weight": "185 грамм",
    "warranty": "2 года международная",
    "madeIn": "Япония"
  },
  "inStock": true,
  "stockQuantity": 15,
  "sku": "RA-AA0004E19B",
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-15T14:30:00Z"
}
```

**Errors:**
- `404 Not Found` - Товар не найден

### POST /api/admin/products
Создать новый товар

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Kamasu Automatic Diver",
  "collection": "SPORTS",
  "price": 45900,
  "image": "https://cdn.orient.uz/products/kamasu.jpg",
  "images": [
    "https://cdn.orient.uz/products/kamasu-1.jpg",
    "https://cdn.orient.uz/products/kamasu-2.jpg"
  ],
  "description": "Профессиональные дайверские часы...",
  "features": [
    "Автоматический механизм Orient F6922",
    "Водонепроницаемость 200 метров"
  ],
  "specs": {
    "movement": "Автоматический Orient F6922",
    "case": "Нержавеющая сталь 316L",
    "diameter": "41.8 мм"
  },
  "inStock": true,
  "stockQuantity": 15,
  "sku": "RA-AA0004E19B"
}
```

**Response (201 Created):**
```json
{
  "id": "13",
  "name": "Kamasu Automatic Diver",
  "collection": "SPORTS",
  "price": 45900,
  "createdAt": "2025-01-15T15:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Отсутствуют обязательные поля
- `409 Conflict` - SKU уже существует

### PUT /api/admin/products/:id
Обновить товар

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (все поля optional)
```json
{
  "name": "Kamasu Automatic Diver Updated",
  "price": 49900,
  "inStock": false,
  "stockQuantity": 0
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Kamasu Automatic Diver Updated",
  "price": 49900,
  "updatedAt": "2025-01-15T15:30:00Z"
}
```

**Errors:**
- `404 Not Found` - Товар не найден
- `400 Bad Request` - Некорректные данные

### DELETE /api/admin/products/:id
Удалить товар

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Товар успешно удален",
  "id": "1"
}
```

**Errors:**
- `404 Not Found` - Товар не найден
- `409 Conflict` - Товар используется в заказах

---

## Коллекции (Collections)

### GET /api/admin/collections
Получить список коллекций

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": "sports",
    "name": "SPORTS",
    "description": "Профессиональные дайверские часы с непревзойденной надежностью...",
    "image": "https://cdn.orient.uz/collections/sports.jpg",
    "watchCount": 24,
    "number": "01",
    "active": true,
    "createdAt": "2025-01-01T10:00:00Z"
  },
  {
    "id": "classic",
    "name": "CLASSIC",
    "description": "Элегантные часы для особых случаев...",
    "image": "https://cdn.orient.uz/collections/classic.jpg",
    "watchCount": 18,
    "number": "02",
    "active": true,
    "createdAt": "2025-01-01T10:00:00Z"
  }
]
```

### POST /api/admin/collections
Создать коллекцию

**Request Body:**
```json
{
  "id": "limited",
  "name": "LIMITED EDITION",
  "description": "Лимитированные модели...",
  "image": "https://cdn.orient.uz/collections/limited.jpg",
  "number": "04",
  "active": true
}
```

**Response (201 Created):**
```json
{
  "id": "limited",
  "name": "LIMITED EDITION",
  "createdAt": "2025-01-15T15:00:00Z"
}
```

### PUT /api/admin/collections/:id
Обновить коллекцию

**Request Body:**
```json
{
  "description": "Обновленное описание...",
  "active": false
}
```

### DELETE /api/admin/collections/:id
Удалить коллекцию

---

## Заказы (Orders)

### GET /api/admin/orders
Получить список заказов

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `status` (optional) - pending, processing, completed, cancelled
- `dateFrom` (optional) - YYYY-MM-DD
- `dateTo` (optional) - YYYY-MM-DD

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "ORD-001",
      "orderNumber": "ORD-2025-001",
      "customer": {
        "id": "user-123",
        "name": "Иван Иванов",
        "email": "ivan@example.com",
        "phone": "+998901234567"
      },
      "items": [
        {
          "productId": "1",
          "productName": "Kamasu Automatic Diver",
          "quantity": 1,
          "price": 45900,
          "total": 45900
        }
      ],
      "subtotal": 45900,
      "shipping": 0,
      "total": 45900,
      "status": "pending",
      "paymentMethod": "payme",
      "deliveryMethod": "standard",
      "deliveryAddress": {
        "fullName": "Иван Иванов",
        "address": "ул. Амира Темура, 107",
        "city": "Ташкент",
        "postalCode": "100084",
        "country": "Узбекистан",
        "phone": "+998901234567"
      },
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

### GET /api/admin/orders/:id
Получить заказ по ID

**Response (200 OK):**
```json
{
  "id": "ORD-001",
  "orderNumber": "ORD-2025-001",
  "customer": {
    "id": "user-123",
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+998901234567"
  },
  "items": [
    {
      "productId": "1",
      "productName": "Kamasu Automatic Diver",
      "productImage": "https://cdn.orient.uz/products/kamasu.jpg",
      "quantity": 1,
      "price": 45900,
      "total": 45900
    }
  ],
  "subtotal": 45900,
  "shipping": 0,
  "total": 45900,
  "status": "pending",
  "paymentMethod": "payme",
  "paymentStatus": "pending",
  "deliveryMethod": "standard",
  "deliveryAddress": {
    "fullName": "Иван Иванов",
    "address": "ул. Амира Темура, 107",
    "city": "Ташкент",
    "postalCode": "100084",
    "country": "Узбекистан",
    "phone": "+998901234567"
  },
  "notes": "Позвонить за час до доставки",
  "statusHistory": [
    {
      "status": "pending",
      "timestamp": "2025-01-15T10:00:00Z",
      "note": "Заказ создан"
    }
  ],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### PUT /api/admin/orders/:id/status
Обновить статус заказа

**Request Body:**
```json
{
  "status": "processing",
  "note": "Заказ принят в обработку"
}
```

**Response (200 OK):**
```json
{
  "id": "ORD-001",
  "status": "processing",
  "updatedAt": "2025-01-15T11:00:00Z"
}
```

**Статусы:**
- `pending` - Ожидает обработки
- `processing` - В обработке
- `completed` - Завершен
- `cancelled` - Отменен

---

## Пользователи (Users)

### GET /api/admin/users
Получить список пользователей

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `search` (optional) - Поиск по имени/email
- `role` (optional) - admin, user

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "user-123",
      "name": "Иван Иванов",
      "email": "ivan@example.com",
      "phone": "+998901234567",
      "role": "user",
      "ordersCount": 5,
      "totalSpent": 234500,
      "createdAt": "2024-06-15T10:00:00Z",
      "lastLogin": "2025-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 342,
    "totalPages": 18
  }
}
```

### GET /api/admin/users/:id
Получить пользователя по ID

**Response (200 OK):**
```json
{
  "id": "user-123",
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+998901234567",
  "role": "user",
  "addresses": [
    {
      "id": "addr-1",
      "fullName": "Иван Иванов",
      "address": "ул. Амира Темура, 107",
      "city": "Ташкент",
      "postalCode": "100084",
      "country": "Узбекистан",
      "isDefault": true
    }
  ],
  "orders": [
    {
      "id": "ORD-001",
      "total": 45900,
      "status": "completed",
      "date": "2025-01-15"
    }
  ],
  "ordersCount": 5,
  "totalSpent": 234500,
  "createdAt": "2024-06-15T10:00:00Z",
  "lastLogin": "2025-01-15T09:00:00Z"
}
```

---

## Контент (Content)

### GET /api/admin/content/hero
Получить контент Hero секции

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "title": "НАЙДИТЕ\nИДЕАЛЬНЫЕ\nЧАСЫ.",
  "subtitle": "Японское мастерство и точность в каждой детали",
  "image": "https://cdn.orient.uz/hero/main-watch.jpg",
  "ctaText": "Смотреть коллекцию",
  "ctaLink": "/catalog"
}
```

### PUT /api/admin/content/hero
Обновить Hero секцию

**Request Body:**
```json
{
  "title": "НОВЫЙ\nТЕКСТ\nЗАГОЛОВКА",
  "subtitle": "Обновленный подзаголовок",
  "image": "https://cdn.orient.uz/hero/new-watch.jpg"
}
```

### GET /api/admin/content/promo-banner
Получить промо баннер

**Response (200 OK):**
```json
{
  "text": "СКИДКА 15% НА ВСЕ ЧАСЫ С КОДОМ PRE2025",
  "active": true,
  "backgroundColor": "#000000",
  "textColor": "#FFFFFF",
  "highlightColor": "#C8102E"
}
```

### PUT /api/admin/content/promo-banner
Обновить промо баннер

**Request Body:**
```json
{
  "text": "НОВАЯ АКЦИЯ 20% СКИДКА",
  "active": true
}
```

---

## Настройки (Settings)

### GET /api/admin/settings
Получить настройки сайта

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "site": {
    "name": "Orient Watch",
    "email": "info@orient.uz",
    "phone": "+998 71 123 45 67",
    "address": "ул. Амира Темура, 107Б, Ташкент, 100084"
  },
  "shipping": {
    "freeShippingThreshold": 50000,
    "standardCost": 500,
    "expressCost": 1500
  },
  "currency": {
    "code": "UZS",
    "symbol": "₽"
  },
  "social": {
    "facebook": "https://facebook.com/orient",
    "instagram": "https://instagram.com/orient",
    "twitter": "https://twitter.com/orient"
  }
}
```

### PUT /api/admin/settings
Обновить настройки

**Request Body:**
```json
{
  "site": {
    "phone": "+998 71 999 88 77"
  },
  "shipping": {
    "freeShippingThreshold": 60000
  }
}
```

---

## Загрузка файлов (File Upload)

### POST /api/admin/upload
Загрузить изображение

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
```

**Response (200 OK):**
```json
{
  "url": "https://cdn.orient.uz/uploads/image-123.jpg",
  "filename": "image-123.jpg",
  "size": 245678,
  "mimeType": "image/jpeg"
}
```

**Errors:**
- `400 Bad Request` - Файл не выбран или неверный формат
- `413 Payload Too Large` - Файл слишком большой (макс 5MB)

**Поддерживаемые форматы:**
- image/jpeg
- image/png
- image/webp

---

## Коды ошибок

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Отсутствуют обязательные поля",
  "fields": ["name", "price"]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Неверный или истекший токен"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Недостаточно прав для выполнения операции"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Ресурс не найден"
}
```

### 409 Conflict
```json
{
  "error": "Conflict",
  "message": "SKU уже существует"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Внутренняя ошибка сервера"
}
```

---

## Примеры использования

### JavaScript (Fetch API)

```javascript
// Login
const login = async () => {
  const response = await fetch('https://api.orient.uz/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@orient.uz',
      password: 'admin123'
    }),
  });
  
  const data = await response.json();
  localStorage.setItem('adminToken', data.token);
  return data;
};

// Get Products
const getProducts = async () => {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch('https://api.orient.uz/api/admin/products', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};

// Create Product
const createProduct = async (productData) => {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch('https://api.orient.uz/api/admin/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  return await response.json();
};
```

### cURL

```bash
# Login
curl -X POST https://api.orient.uz/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orient.uz","password":"admin123"}'

# Get Products
curl -X GET https://api.orient.uz/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Product
curl -X POST https://api.orient.uz/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Watch",
    "collection": "SPORTS",
    "price": 45900,
    "inStock": true
  }'
```

---

## Рекомендации по безопасности

1. **HTTPS только** - Все запросы должны идти через HTTPS
2. **Токены** - JWT токены должны храниться безопасно (httpOnly cookies предпочтительнее localStorage)
3. **Срок действия** - Токены должны иметь ограниченный срок действия (например, 24 часа)
4. **Rate Limiting** - Ограничьте количество запросов с одного IP
5. **CORS** - Настройте правильные CORS политики
6. **Валидация** - Всегда валидируйте входные данные на backend
7. **SQL Injection** - Используйте параметризованные запросы
8. **XSS Protection** - Санитизируйте пользовательский ввод

---

## Changelog

### v1.0.0 (2025-01-15)
- Начальная версия API
- Аутентификация администратора
- CRUD операции для товаров, коллекций, заказов
- Управление контентом
- Загрузка изображений