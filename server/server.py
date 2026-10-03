"""
ALTRON FASTAPI BACKEND SERVER (server.py)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
from typing import Optional, List, Any

try:
    from server.altron_engine import AltronPyEngine
except ImportError:
    from altron_engine import AltronPyEngine

app = FastAPI(title="Altron Mathematical AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AltronPyEngine()

class EquationRequest(BaseModel):
    equation: str
    variable: Optional[str] = "x"

class DiffRequest(BaseModel):
    expression: str
    variable: Optional[str] = "x"
    order: Optional[int] = 1

class IntegralRequest(BaseModel):
    expression: str
    variable: Optional[str] = "x"
    a: Optional[str] = None
    b: Optional[str] = None

class MatrixRequest(BaseModel):
    matrix: List[List[float]]

@app.get("/api/health")
def health():
    return {"status": "online", "engine": "Altron Quantum Math Core"}

@app.post("/api/solve")
def solve(req: EquationRequest):
    try:
        return engine.solve_equation(req.equation, req.variable)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/diff")
def diff(req: DiffRequest):
    try:
        return engine.differentiate(req.expression, req.variable, req.order)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integrate")
def integrate(req: IntegralRequest):
    try:
        return engine.integrate(req.expression, req.variable, req.a, req.b)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/matrix")
def matrix(req: MatrixRequest):
    try:
        return engine.matrix_operations(req.matrix)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Статические файлы (веб-интерфейс)
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
