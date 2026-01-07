# Quick Start - Python Compiler Service

## ✅ Fixed for Python 3.13!

### Install Dependencies

```powershell
pip install -r requirements.txt
```

### Run the Service

```powershell
python main.py
```

The service will start on `http://localhost:8000`

### Test It

```powershell
curl http://localhost:8000/health
```

Should return: `{"status":"healthy"}`

---

## Troubleshooting

### If you still get pydantic errors:

```powershell
pip install --upgrade pip
pip install fastapi uvicorn pydantic pycryptodome rich --upgrade
```

### If you get "No module named 'avax_cli'":

The error message will show you:
- Where it's looking for avax_cli
- Whether the directory exists

Make sure `avax_cli` folder exists in the parent directory.

---

## Next Steps

After the service starts successfully:

1. Keep this terminal open (service running)
2. Open a new terminal
3. Run: `npm run dev`
4. Open: http://localhost:3000/playground
