from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from models import models
from schemas import schemas
from core.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hub Inteligente de Recursos Educacionais")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API rodando perfeitamente!"}


@app.post("/recursos", response_model=schemas.RecursoResponse)
def criar_recurso(recurso: schemas.RecursoCreate, db: Session = Depends(get_db)):

    novo_recurso = models.Recurso(**recurso.model_dump())
    
    db.add(novo_recurso)  
    db.commit()           
    db.refresh(novo_recurso) 
    
    return novo_recurso

@app.get("/recursos", response_model=list[schemas.RecursoResponse])
def listar_recursos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    
    recursos = db.query(models.Recurso).offset(skip).limit(limit).all()
    return recursos


@app.put("/recursos/{recurso_id}", response_model=schemas.RecursoResponse)
def atualizar_recurso(recurso_id: int, recurso_atualizado: schemas.

RecursoCreate, db: Session = Depends(get_db)):

    recurso_banco = db.query(models.Recurso).filter(models.Recurso.id == recurso_id).first()
    if not recurso_banco:
        raise HTTPException(status_code=404, detail="Recurso não encontrado")

    for key, value in recurso_atualizado.model_dump().items():
        setattr(recurso_banco, key, value)

    db.commit()
    db.refresh(recurso_banco)
    return recurso_banco

@app.delete("/recursos/{recurso_id}")
def deletar_recurso(recurso_id: int, db: Session = Depends(get_db)):

    recurso_banco = db.query(models.Recurso).filter(models.Recurso.id == recurso_id).first()
    if not recurso_banco:
        raise HTTPException(status_code=404, detail="Recurso não encontrado")

    db.delete(recurso_banco)
    db.commit()
    return {"message": "Recurso deletado com sucesso!"}