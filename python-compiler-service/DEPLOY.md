# 🚀 Deploy Python Compiler Service

## Option A: Railway.app (Recommended - Easiest)

### **Step 1: Install Railway CLI**

```bash
npm install -g @railway/cli
```

### **Step 2: Login to Railway**

```bash
railway login
```

This will open a browser window to authenticate.

### **Step 3: Deploy from this directory**

```bash
cd python-compiler-service
railway init
railway up
```

### **Step 4: Get your deployment URL**

```bash
railway domain
```

You'll get a URL like: `https://your-service.up.railway.app`

### **Step 5: Update Frontend Environment**

Create `.env.local` in your Next.js project root:

```env
NEXT_PUBLIC_PYTHON_COMPILER_URL=https://your-service.up.railway.app
```

Or update `lib/python-native-compiler.ts`:

```ts
const PYTHON_COMPILER_URL = process.env.NEXT_PUBLIC_PYTHON_COMPILER_URL || 
                            'https://your-service.up.railway.app'
```

### **Cost:**
- Free tier: 500 hours/month + $5 credit
- After: ~$5-10/month

---

## Option B: Render.com (Also Easy)

### **Step 1: Create Account**

Go to https://render.com and sign up

### **Step 2: New Web Service**

1. Click "New +" → "Web Service"
2. Connect your GitHub repo (push this code first)
3. Or use "Public Git repository"

### **Step 3: Configure**

```
Name: pyvax-python-compiler
Environment: Python 3
Region: Oregon (US West)
Branch: main
Root Directory: python-compiler-service

Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### **Step 4: Deploy**

Click "Create Web Service"

Wait ~2 minutes for deployment

### **Step 5: Get URL**

You'll get: `https://pyvax-python-compiler.onrender.com`

### **Cost:**
- Free tier: Available (spins down after inactivity)
- Paid: $7/month (always on)

---

## Option C: Vercel + Docker (Advanced)

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Create vercel.json**

Already created - just deploy:

```bash
cd python-compiler-service
vercel --prod
```

**Note:** Vercel has limitations with Python services. Railway/Render recommended.

---

## Testing Deployment

### **Test Health Endpoint**

```bash
curl https://your-service-url.com/health
```

Should return:
```json
{"status":"healthy"}
```

### **Test Compilation**

```bash
curl -X POST https://your-service-url.com/compile \
  -H "Content-Type: application/json" \
  -d '{
    "code": "class Test:\n    def __init__(self):\n        self.value = 42",
    "contractName": "Test"
  }'
```

Should return bytecode and ABI.

---

## Environment Variables

Set these in Railway/Render dashboard:

```env
# Optional
LOG_LEVEL=info
CORS_ORIGINS=*
```

---

## Monitoring

### **Railway Dashboard**
- Logs: `railway logs`
- Metrics: Check dashboard
- Restarts: Automatic

### **Render Dashboard**
- Logs: View in dashboard
- Health checks: Automatic
- Alerts: Email notifications

---

## Update Deployment

### **Railway:**
```bash
railway up
```

### **Render:**
Just push to GitHub - auto-deploys

---

## Troubleshooting

### **Service won't start:**

```bash
# Check logs
railway logs  # Railway
# Or check Render dashboard
```

### **Import errors:**

Make sure `requirements.txt` includes all dependencies:
```
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.9.0
pycryptodome>=3.19.0
rich>=13.7.0
```

### **Port issues:**

Service automatically uses `$PORT` environment variable.

---

## Cost Summary

| Provider | Free Tier | Paid | Best For |
|----------|-----------|------|----------|
| **Railway** | $5 credit | $5-10/mo | Development |
| **Render** | Yes (sleeps) | $7/mo | Production |
| **Fly.io** | Limited | $5/mo | Global |

---

## Recommended: Railway.app

**Why:**
- ✅ Easiest setup
- ✅ Free $5 credit
- ✅ Automatic deployments
- ✅ Great developer experience
- ✅ Built-in monitoring

**Steps:**
```bash
npm install -g @railway/cli
cd python-compiler-service
railway login
railway init
railway up
railway domain
```

**Done!** 🎉

Your service is live at: `https://your-service.up.railway.app`
