# Zerothan Python Compiler API

A Vercel-deployed serverless API that compiles Python smart contracts to EVM bytecode using Pyodide (Python in WebAssembly).

## Features

- ✅ Python to EVM bytecode compilation
- ✅ Runs entirely in serverless environment
- ✅ Powered by Pyodide WebAssembly
- ✅ CORS enabled for browser access
- ✅ Fast and scalable

## Deployment

### Prerequisites
- Vercel account
- Vercel CLI installed (`npm i -g vercel`)

### Deploy to Vercel

1. Install dependencies:
```bash
cd api-service
npm install
```

2. Deploy:
```bash
vercel --prod
```

3. Your API will be available at: `https://your-project.vercel.app`

## API Endpoints

### GET /
Health check endpoint

**Response:**
```json
{
  "service": "Zerothan Python Compiler",
  "status": "running",
  "version": "1.0.0",
  "compiler": "pyodide-transpiler"
}
```

### POST /compile
Compile Python smart contract

**Request:**
```json
{
  "code": "class MyContract:\\n    def __init__(self):\\n        self.value = 0",
  "contractName": "MyContract",
  "optimize": true
}
```

**Response:**
```json
{
  "success": true,
  "bytecode": "0x6080604052...",
  "abi": [...],
  "metadata": {
    "compiler": "pyodide-transpiler",
    "version": "0.1.0",
    "contractName": "MyContract"
  }
}
```

## Usage in Your App

Update your `route.ts` to point to your deployed URL:

```typescript
const PYTHON_COMPILER_URL = 'https://your-zerothan-compiler.vercel.app'
```

## Local Development

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Environment Variables

No environment variables required! The service is stateless and runs entirely in Pyodide.

## Tech Stack

- **Pyodide**: Python runtime in WebAssembly
- **Vercel**: Serverless deployment platform
- **Node.js**: Runtime environment

## License

MIT
