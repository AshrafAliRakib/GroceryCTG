# Quick Start Guide - CTGGrocery

## 1-Step Startup

```bash
/Users/rxbt/GroceryCTG/start.sh
```

This script will:
- ✅ Check Docker is running
- ✅ Start all services (Backend, Frontend, Database)
- ✅ Wait for initialization
- ✅ Verify all services started correctly
- ✅ Display access credentials

## Manual Startup (if script doesn't work)

### Step 1: Unpause Docker
Click the whale icon (🐋) in macOS menu bar → Select "Unpause"

### Step 2: Start Services
```bash
cd /Users/rxbt/GroceryCTG
docker compose up -d
```

### Step 3: Wait 15 seconds
Let services initialize

### Step 4: Access System
- **Frontend:** http://localhost:3000
- **Admin:** admin / admin123
- **Customer:** testuser / testpass123

## What You'll See

### Admin Login
1. Go to http://localhost:3000
2. Enter: admin / admin123
3. You'll see the Admin Dashboard with:
   - 📦 Orders tab
   - 🛍️ Products tab
   - 📊 Analytics tab

### Customer Login
1. Go to http://localhost:3000
2. Enter: testuser / testpass123
3. You'll see the Shop with 164 products

## Documentation

- **ADMIN_SETUP.md** - Complete setup instructions
- **DEPLOYMENT_CHECKLIST.md** - Verification steps
- **IMPLEMENTATION_SUMMARY.md** - Technical overview
- **CODE_VALIDATION_REPORT.md** - Testing results

## Troubleshooting

**Docker says "paused"**
→ Click whale icon → Unpause

**localhost:3000 won't load**
→ Wait 15 seconds, refresh browser

**Services won't start**
→ Check: `docker ps`
→ Check logs: `docker compose logs`

**Forgot passwords**
- Admin: admin / admin123
- Customer: testuser / testpass123

## Stop the System

```bash
docker compose down
```

## View Logs

```bash
# All services
docker compose logs -f

# Just backend
docker compose logs -f backend

# Just frontend
docker compose logs -f frontend
```

---

**Everything is ready. Just run the script!**
