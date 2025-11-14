# 🖼️ Image Upload & Products List Fix

## ✅ Исправленные проблемы

### **1. Загруженные картинки не отображаются**

**Проблема:**
- Картинки загружаются успешно
- Но не отображаются на frontend
- URL возвращается как `/uploads/filename.jpg` (относительный путь)

**Причина:**
Backend возвращал относительный путь вместо полного URL

**Исправление в `backend/routes/upload.py`:**
```python
# До:
file_url = f"/uploads/{unique_filename}"

# После:
base_url = str(request.base_url).rstrip('/')
file_url = f"{base_url}/uploads/{unique_filename}"
```

**Теперь возвращается:**
```json
{
  "url": "http://localhost:8000/uploads/abc123.jpg",
  "filename": "abc123.jpg",
  "size": 12345,
  "mimeType": "image/jpeg"
}
```

✅ **Картинки теперь отображаются!**

---

### **2. Не отображается список товаров в админке**

**Проблема:**
- Страница `/admin/products` пустая
- Товары не загружаются
- Используется относительный путь `/api/admin/products`

**Причина:**
`Products.tsx` использовал `fetch` с относительным путем вместо `api.getProducts()`

**Исправление в `pages/admin/Products.tsx`:**
```tsx
// До:
const response = await fetch('/api/admin/products', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  },
})

// После:
const response = await api.getProducts()
```

**Также добавлено:**
- Обработка ошибок загрузки изображений
- Placeholder для отсутствующих изображений
- Использование `api.deleteProduct()` вместо прямого `fetch`

✅ **Список товаров теперь загружается!**

---

## 🚀 Как проверить исправления

### **1. Проверка загрузки изображений:**

```bash
# Перезапустите backend
cd backend
uvicorn main:app --reload --port 8000
```

1. Откройте админку → Товары → Создать товар
2. Загрузите изображение
3. Изображение должно отобразиться в preview

**Backend логи:**
```
INFO: 127.0.0.1:xxxxx - "POST /api/admin/upload HTTP/1.1" 200 OK
```

**Response:**
```json
{
  "url": "http://localhost:8000/uploads/abc-123-def.jpg",
  "filename": "abc-123-def.jpg",
  "size": 45678,
  "mimeType": "image/jpeg"
}
```

### **2. Проверка списка товаров:**

1. Откройте админку → Товары
2. Должен отобразиться список всех товаров
3. Изображения товаров должны загрузиться

**Backend логи:**
```
INFO: 127.0.0.1:xxxxx - "GET /api/admin/products HTTP/1.1" 200 OK
```

---

## 📋 Что изменилось

### **backend/routes/upload.py:**
```diff
  @router.post("/api/admin/upload")
  async def upload_file(
+     request: Request,
      file: UploadFile = File(...),
      current_user = Depends(require_admin)
  ):
      # ... save file ...
      
-     file_url = f"/uploads/{unique_filename}"
+     base_url = str(request.base_url).rstrip('/')
+     file_url = f"{base_url}/uploads/{unique_filename}"
      
      return {
          "url": file_url,
          # ...
      }
```

### **pages/admin/Products.tsx:**
```diff
+ import { api } from '../../services/api'

  const fetchProducts = async () => {
      try {
-         const response = await fetch('/api/admin/products', {
-             headers: {
-                 Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
-             },
-         })
-         const data = await response.json()
-         setProducts(data)
+         const response = await api.getProducts()
+         setProducts(response.data || [])
      } catch (error) {
          console.error('Error fetching products:', error)
      } finally {
          setLoading(false)
      }
  }

  const handleDelete = async (id: string) => {
      try {
-         await fetch(`/api/admin/products/${id}`, {
-             method: 'DELETE',
-             headers: {
-                 Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
-             },
-         })
+         await api.deleteProduct(id)
          setProducts(products.filter((p) => p.id !== id))
      } catch (error) {
          console.error('Error deleting product:', error)
      }
  }

+ // Добавлен fallback для изображений
  <img
      src={product.image}
      alt={product.name}
+     onError={(e) => {
+         e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Image'
+     }}
  />
```

---

## ✅ Результат

### **До:**
- ❌ Картинки не отображаются (относительный путь)
- ❌ Список товаров пустой (неправильный API call)

### **После:**
- ✅ Картинки отображаются (полный URL)
- ✅ Список товаров загружается
- ✅ Placeholder для отсутствующих изображений
- ✅ Используется централизованный API service

---

## 🔍 Проверка URL изображений

### **Правильный URL:**
```
http://localhost:8000/uploads/abc-123-def.jpg
```

### **Неправильный URL (старый):**
```
/uploads/abc-123-def.jpg
```

---

## 🎉 Готово!

Обе проблемы исправлены! Теперь:
- ✅ Изображения загружаются и отображаются
- ✅ Список товаров работает корректно
- ✅ Используется централизованный API service
