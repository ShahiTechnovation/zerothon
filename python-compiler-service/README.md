# PyVax Python Compiler Microservice

FastAPI-based microservice that compiles Python smart contracts directly to EVM bytecode using the `avax_cli` transpiler.

## Features

- ✅ Python → EVM bytecode compilation (no Solidity/Vyper)
- ✅ ABI generation
- ✅ Syntax validation
- ✅ RESTful API
- ✅ Docker support
- ✅ Health checks
- ✅ CORS enabled

## Quick Start

### Option 1: Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the service
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --port 8000
```

### Option 2: Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t pyvax-compiler .
docker run -p 8000:8000 pyvax-compiler
```

## API Endpoints

### `POST /compile`

Compile Python smart contract to EVM bytecode.

**Request:**
```json
{
  "code": "class MyContract(PySmartContract):\n    def __init__(self):\n        self.value = 0",
  "contractName": "MyContract",
  "optimize": true
}
```

**Response:**
```json
{
  "success": true,
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "abi": [
    {
      "type": "constructor",
      "inputs": [],
      "stateMutability": "nonpayable"
    }
  ],
  "metadata": {
    "compiler": "python-evm-transpiler",
    "version": "0.1.0",
    "gas_estimate": 12345
  },
  "compiler": "python-evm-transpiler",
  "version": "0.1.0"
}
```

### `POST /validate`

Validate Python syntax without full compilation.

**Request:**
```json
{
  "code": "class MyContract(PySmartContract):\n    pass"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "message": "Python syntax is valid"
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Environment Variables

- `PORT` - Service port (default: 8000)
- `HOST` - Service host (default: 0.0.0.0)
- `ALLOWED_ORIGINS` - CORS allowed origins

## Integration with Next.js

The Next.js app should call this service via the API route:

```typescript
// app/api/python-native-compile/route.ts
const response = await fetch('http://localhost:8000/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: pythonCode })
})
```

## Deployment

### Railway

```bash
railway login
railway init
railway up
```

### Render

1. Connect your GitHub repo
2. Select "Web Service"
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Docker Hub

```bash
docker build -t yourusername/pyvax-compiler .
docker push yourusername/pyvax-compiler
```

## Testing

```bash
# Test compilation endpoint
curl -X POST http://localhost:8000/compile \
  -H "Content-Type: application/json" \
  -d '{
    "code": "class SimpleStorage(PySmartContract):\n    def __init__(self):\n        self.value = 0\n    \n    @public_function\n    def set(self, val: int):\n        self.value = val\n    \n    @view_function\n    def get(self) -> int:\n        return self.value"
  }'
```

## License

MIT
