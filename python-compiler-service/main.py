"""
FastAPI microservice for Python to EVM bytecode compilation.
Uses the avax_cli transpiler to compile Python smart contracts directly to EVM bytecode.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import sys
from pathlib import Path

# Import avax_cli from local directory (for Railway deployment)
try:
    from zerothan_cli.transpiler import transpile_python_contract
except ImportError as e:
    print(f"Error importing avax_cli: {e}")
    print(f"Python path: {sys.path}")
    print(f"Current directory: {Path(__file__).parent}")
    raise

app = FastAPI(
    title="zerothon Python Compiler Service",
    description="Compile Python smart contracts directly to EVM bytecode using zerothon",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Next.js domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CompileRequest(BaseModel):
    """Request model for compilation."""
    code: str
    contractName: Optional[str] = "Contract"
    optimize: Optional[bool] = True


class CompileResponse(BaseModel):
    """Response model for successful compilation."""
    success: bool
    bytecode: str
    abi: list
    metadata: Dict[str, Any]
    compiler: str
    version: str


class ErrorResponse(BaseModel):
    """Response model for errors."""
    success: bool
    error: str
    details: Optional[str] = None


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "zerothon Python Compiler",
        "status": "running",
        "version": "1.0.0",
        "compiler": "zerothon-evm-transpiler"
    }


@app.get("/health")
async def health_check():
    """Health check for container orchestration."""
    return {"status": "healthy"}


@app.post("/compile", response_model=CompileResponse)
async def compile_python_contract(request: CompileRequest):
    """
    Compile Python smart contract to EVM bytecode.
    
    Args:
        request: CompileRequest with Python source code
        
    Returns:
        CompileResponse with bytecode, ABI, and metadata
        
    Raises:
        HTTPException: If compilation fails
    """
    try:
        # Validate input
        if not request.code or not request.code.strip():
            raise HTTPException(
                status_code=400,
                detail="No source code provided"
            )
        
        # Compile using avax_cli transpiler
        result = transpile_python_contract(request.code)
        
        return CompileResponse(
            success=True,
            bytecode=result["bytecode"],
            abi=result["abi"],
            metadata=result["metadata"],
            compiler="python-evm-transpiler",
            version="0.1.0"
        )
        
    except SyntaxError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Python syntax error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Compilation failed: {str(e)}"
        )


@app.post("/validate")
async def validate_python_contract(request: CompileRequest):
    """
    Validate Python smart contract syntax without full compilation.
    
    Args:
        request: CompileRequest with Python source code
        
    Returns:
        Validation result
    """
    try:
        import ast
        
        # Try to parse the Python code
        ast.parse(request.code)
        
        return {
            "success": True,
            "valid": True,
            "message": "Python syntax is valid"
        }
        
    except SyntaxError as e:
        return {
            "success": True,
            "valid": False,
            "message": f"Syntax error: {str(e)}",
            "line": e.lineno,
            "offset": e.offset
        }
    except Exception as e:
        return {
            "success": True,
            "valid": False,
            "message": f"Validation error: {str(e)}"
        }


if __name__ == "__main__":
    import uvicorn
    import os
    
    # Use PORT from environment variable (for Railway/Render) or default to 8000
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    print(f"PORT env var: {os.getenv('PORT', 'NOT SET')}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
