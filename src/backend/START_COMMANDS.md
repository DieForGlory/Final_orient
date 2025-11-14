# 🚀 Backend Start Commands

## 📋 Различные способы запуска

### **1. Development (разработка) - с автоперезагрузкой**

```bash
cd backend
source venv/bin/activate  # или venv\Scripts\activate

# Способ 1: Через uvicorn (РЕКОМЕНДУЕТСЯ для разработки)
uvicorn main:app --reload --port 8000

# Способ 2: Через python main.py
python main.py
```

**Оба способа работают одинаково!**

---

### **2. Production (продакшн) - без автоперезагрузки**

```bash
cd backend
source venv/bin/activate

# Базовый запуск
uvicorn main:app --host 0.0.0.0 --port 8000

# С несколькими workers (для высокой нагрузки)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# С Gunicorn + Uvicorn workers (BEST для production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 🔧 Параметры uvicorn

### **Основные параметры:**

```bash
uvicorn main:app \
  --host 0.0.0.0 \          # Слушать на всех интерфейсах
  --port 8000 \              # Порт
  --reload \                 # Автоперезагрузка при изменениях (только dev!)
  --workers 4 \              # Количество worker процессов (только prod!)
  --log-level info \         # Уровень логирования
  --access-log \             # Логировать все запросы
  --proxy-headers \          # Для работы за reverse proxy
  --forwarded-allow-ips '*'  # Доверять proxy headers
```

**⚠️ ВАЖНО:** `--reload` и `--workers` нельзя использовать вместе!

---

## 📝 Примеры для разных сценариев

### **Development (локальная разработка)**

```bash
# С автоперезагрузкой
uvicorn main:app --reload --port 8000

# С автоперезагрузкой + подробные логи
uvicorn main:app --reload --port 8000 --log-level debug
```

### **Staging (тестовый сервер)**

```bash
# Один worker, логи в файл
uvicorn main:app --host 0.0.0.0 --port 8000 --access-log > logs/access.log 2>&1
```

### **Production (боевой сервер)**

```bash
# С Gunicorn (РЕКОМЕНДУЕТСЯ)
gunicorn main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile logs/access.log \
  --error-logfile logs/error.log \
  --log-level info

# Или с uvicorn + несколько workers
uvicorn main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4 \
  --log-level info
```

---

## 🐳 Docker

```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Production запуск
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

---

## 🔄 Systemd Service (Linux)

```ini
# /etc/systemd/system/orient-api.service
[Unit]
Description=Orient Watch API
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/orient/backend
Environment="PATH=/var/www/orient/backend/venv/bin"
ExecStart=/var/www/orient/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Управление сервисом
sudo systemctl start orient-api
sudo systemctl enable orient-api
sudo systemctl status orient-api
sudo systemctl restart orient-api
```

---

## 🌐 За Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/orient
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        alias /var/www/orient/backend/uploads;
    }
}
```

```bash
# Запуск backend с proxy headers
uvicorn main:app \
  --host 127.0.0.1 \
  --port 8000 \
  --workers 4 \
  --proxy-headers \
  --forwarded-allow-ips '*'
```

---

## 📊 Мониторинг

### **Проверка работы:**

```bash
# Health check
curl http://localhost:8000/health

# Test endpoint
curl http://localhost:8000/api/test

# Полная информация
curl http://localhost:8000/
```

### **Логи:**

```bash
# Просмотр логов в реальном времени
tail -f logs/access.log
tail -f logs/error.log

# Поиск ошибок
grep ERROR logs/error.log
```

---

## 🔐 Production Checklist

Перед запуском в production:

- [ ] Измените `SECRET_KEY` в `.env`
- [ ] Используйте PostgreSQL вместо SQLite
- [ ] Настройте `CORS_ORIGINS` для вашего домена
- [ ] Используйте HTTPS (SSL/TLS)
- [ ] Настройте логирование в файлы
- [ ] Используйте несколько workers
- [ ] Настройте мониторинг (Sentry, Prometheus)
- [ ] Настройте автоматический restart (systemd, supervisor)
- [ ] Настройте backup базы данных

---

## 🚀 Быстрые команды

```bash
# Development
uvicorn main:app --reload

# Production (простой)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Production (с Gunicorn)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Docker
docker run -p 8000:8000 orient-api

# Systemd
sudo systemctl start orient-api
```

---

## 📚 Дополнительно

- **Uvicorn Docs:** https://www.uvicorn.org/
- **Gunicorn Docs:** https://docs.gunicorn.org/
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/

---

**Выбирайте команду в зависимости от сценария!** 🎯
