# 🔐 Quick Fix: Can't Login to Admin

## ⚡ Fast Solution

```bash
# 1. Go to backend folder
cd backend

# 2. Reset admin password
python reset_admin.py

# 3. Try login again
# Email: admin@orient.uz
# Password: admin123
```

---

## 🔍 If still not working

### **Check backend is running:**
```bash
curl http://localhost:8000/health
```

### **Check admin user:**
```bash
python check_admin.py
```

### **Full reset:**
```bash
rm orient.db
python init_db.py
```

---

## 📋 Credentials

```
Email:    admin@orient.uz
Password: admin123
```

---

## 📚 Detailed Guide

See [backend/LOGIN_TROUBLESHOOTING.md](./backend/LOGIN_TROUBLESHOOTING.md)
