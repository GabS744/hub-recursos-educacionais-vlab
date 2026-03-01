from fastapi import FastAPI
from core.database import engine
from models import models
from api.routes import router as recursos_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hub Inteligente de Recursos Educacionais - API")

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando perfeitamente!"}

app.include_router(recursos_router)