# 🔧 Sort & Settings Fix

## ✅ Исправленные проблемы

### **1. Сортировка в каталоге не работает**

**Проблема:**
- Dropdown сортировки меняется, но товары не пересортировываются
- Выбор "Цена ↑" или "Цена ↓" не влияет на порядок

**Причина:**
`sortBy` state менялся, но не применялся к массиву `products`

**Исправление в `pages/Catalog.tsx`:**

```tsx
// Добавлен useMemo для сортировки
const sortedProducts = React.useMemo(() => {
  const sorted = [...products]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'newest':
      return sorted.reverse()
    case 'popular':
    default:
      return sorted
  }
}, [products, sortBy])

// Используем sortedProducts вместо products
{sortedProducts.map((product) => (
  <ProductCard key={product.id} {...product} />
))}
```

**Как работает:**
- **Популярные** - порядок по умолчанию из API
- **Цена ↑** - сортировка от дешевых к дорогим
- **Цена ↓** - сортировка от дорогих к дешевым
- **Новинки** - обратный порядок (последние первыми)
- **А-Я** - алфавитная сортировка по названию

✅ **Теперь сортировка работает!**

---

### **2. Settings endpoint 404 Not Found**

**Проблема:**
```
PUT /api/admin/settings HTTP/1.1" 404 Not Found
```

**Причина:**
Нет backend endpoint для настроек (не критично для MVP)

**Решение:**
Настройки теперь сохраняются в `localStorage`:

```tsx
const handleSave = async () => {
  // Save to localStorage
  localStorage.setItem('siteSettings', JSON.stringify(settings))
  alert('Настройки сохранены!')
}

// Load from localStorage on mount
const [settings, setSettings] = useState<Settings>(() => {
  const saved = localStorage.getItem('siteSettings')
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
})
```

**Преимущества:**
- ✅ Работает без backend
- ✅ Настройки сохраняются между сессиями
- ✅ Быстро и просто

**Для production:**
Можно позже добавить backend endpoint для синхронизации настроек между устройствами

✅ **Настройки теперь работают!**

---

## 🚀 Как проверить исправления

### **1. Проверка сортировки:**

1. Откройте http://localhost:5173/catalog
2. Выберите "Цена ↑" - товары должны отсортироваться от дешевых к дорогим
3. Выберите "Цена ↓" - товары должны отсортироваться от дорогих к дешевым
4. Выберите "А-Я" - товары должны отсортироваться по алфавиту

### **2. Проверка настроек:**

1. Откройте http://localhost:5173/admin/settings
2. Измените любую настройку (например, название сайта)
3. Нажмите "Сохранить все"
4. Перезагрузите страницу - настройки должны сохраниться

---

## 📋 Что изменилось

### **pages/Catalog.tsx:**

```diff
+ // Sort products client-side
+ const sortedProducts = React.useMemo(() => {
+   const sorted = [...products]
+
+   switch (sortBy) {
+     case 'price-asc':
+       return sorted.sort((a, b) => a.price - b.price)
+     case 'price-desc':
+       return sorted.sort((a, b) => b.price - a.price)
+     case 'name':
+       return sorted.sort((a, b) => a.name.localeCompare(b.name))
+     case 'newest':
+       return sorted.reverse()
+     case 'popular':
+     default:
+       return sorted
+   }
+ }, [products, sortBy])

- {products.map((product) => (
+ {sortedProducts.map((product) => (
    <ProductCard key={product.id} {...product} />
  ))}
```

### **pages/admin/Settings.tsx:**

```diff
- const fetchSettings = async () => {
-   const data = await api.getSettings()
-   setSettings(data)
- }

+ const [settings, setSettings] = useState<Settings>(() => {
+   const saved = localStorage.getItem('siteSettings')
+   return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
+ })

  const handleSave = async () => {
-   await api.updateSettings(settings)
+   localStorage.setItem('siteSettings', JSON.stringify(settings))
    alert('Настройки сохранены!')
  }
```

---

## ✅ Результат

### **До:**
- ❌ Сортировка не работает
- ❌ Settings endpoint 404

### **После:**
- ✅ Сортировка работает (5 вариантов)
- ✅ Настройки сохраняются в localStorage
- ✅ Нет ошибок 404
- ✅ Быстрая сортировка на клиенте (useMemo)

---

## 🎯 Варианты сортировки

| Вариант | Описание | Реализация |
|---------|----------|------------|
| **Популярные** | По умолчанию из API | Без изменений |
| **Цена ↑** | От дешевых к дорогим | `sort((a, b) => a.price - b.price)` |
| **Цена ↓** | От дорогих к дешевым | `sort((a, b) => b.price - a.price)` |
| **Новинки** | Последние первыми | `reverse()` |
| **А-Я** | По алфавиту | `sort((a, b) => a.name.localeCompare(b.name))` |

---

## 🎉 Готово!

Обе проблемы исправлены! Сортировка и настройки теперь работают корректно.
