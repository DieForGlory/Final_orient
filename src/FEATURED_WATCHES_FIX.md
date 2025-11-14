# 🔧 Featured Watches Fix

## ✅ Исправленная проблема

### **Featured Watches - 422 Unprocessable Entity**

**Проблема:**
```
PUT /api/admin/content/featured-watches HTTP/1.1" 422 Unprocessable Entity
```

**Причина:**
- Backend ожидает: `list[str]` (массив ID товаров)
- Frontend отправлял: массив объектов `FeaturedWatch[]`

**Пример неправильного запроса:**
```json
[
  {
    "id": "1",
    "productId": "kamasu-blue",
    "order": 1,
    "isNew": true
  },
  ...
]
```

**Пример правильного запроса:**
```json
[
  "kamasu-blue",
  "mako-iii-black",
  "bambino-v4",
  ...
]
```

---

## 🔧 Исправление

### **1. pages/admin/Content.tsx:**

```tsx
// До:
const handleSaveFeatured = async () => {
  await api.updateFeaturedWatches(featuredWatches)
}

// После:
const handleSaveFeatured = async () => {
  // Extract only product IDs for backend
  const productIds = featuredWatches
    .filter(w => w.productId) // Only include watches with productId
    .map(w => w.productId)
  
  await api.updateFeaturedWatches(productIds)
}
```

### **2. services/api.ts:**

```tsx
// До:
updateFeaturedWatches(data: any) {
  return this.request('/api/admin/content/featured-watches', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// После:
updateFeaturedWatches(productIds: string[]) {
  return this.request('/api/admin/content/featured-watches', {
    method: 'PUT',
    body: JSON.stringify(productIds),
  })
}
```

✅ **Теперь работает!**

---

## 🚀 Как работает

### **Frontend (Content.tsx):**
1. Пользователь добавляет товары в список избранных
2. Указывает ID товара для каждого элемента
3. При сохранении извлекаются только ID товаров
4. Отправляется массив строк: `["kamasu-blue", "mako-iii-black", ...]`

### **Backend (content.py):**
1. Получает массив ID товаров
2. Снимает флаг `is_featured` со всех товаров
3. Устанавливает флаг `is_featured=True` для товаров из списка
4. Сохраняет изменения в БД

---

## 📋 Формат данных

### **Frontend State (FeaturedWatch):**
```tsx
interface FeaturedWatch {
  id: string           // Временный ID для UI
  productId: string    // ID товара из БД
  order: number        // Порядок отображения
  isNew: boolean       // Показывать бейдж "NEW"
}
```

### **API Request (string[]):**
```json
[
  "kamasu-blue",
  "mako-iii-black",
  "bambino-v4",
  "ray-ii-green",
  "sun-and-moon-v3",
  "star-classic"
]
```

### **Backend Processing:**
```python
@router.put("/api/admin/content/featured-watches")
async def update_featured_watches(
    product_ids: list[str],  # Массив ID товаров
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    # Unmark all products
    db.query(Product).update({"is_featured": False})
    
    # Mark selected products as featured
    for product_id in product_ids:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            product.is_featured = True
    
    db.commit()
    return {"message": "Featured watches updated"}
```

---

## ✅ Проверка

### **1. Откройте страницу контента:**
```
http://localhost:5173/admin/content
```

### **2. Прокрутите до секции "Избранные часы"**

### **3. Добавьте товары:**
- Нажмите "Добавить"
- Введите ID товара (например: `kamasu-blue`)
- Установите порядок
- Отметьте "Показать NEW" если нужно

### **4. Нажмите "Сохранить"**

**Backend логи должны показать:**
```
INFO: 127.0.0.1:xxxxx - "PUT /api/admin/content/featured-watches HTTP/1.1" 200 OK ✅
```

**Должно появиться:**
```
Избранные часы обновлены!
```

---

## 🎯 Результат

### **До:**
- ❌ 422 Unprocessable Entity
- ❌ Отправлялись объекты вместо ID
- ❌ Backend не мог обработать запрос

### **После:**
- ✅ 200 OK
- ✅ Отправляются только ID товаров
- ✅ Backend корректно обрабатывает запрос
- ✅ Товары помечаются как избранные

---

## 🎉 Готово!

Featured Watches теперь работает корректно!
