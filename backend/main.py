from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine
from models import models
from api.routes import router as recursos_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hub Inteligente de Recursos Educacionais - API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando perfeitamente!"}

app.include_router(recursos_router)