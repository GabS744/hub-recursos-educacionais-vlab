from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "API operacional"}

@router.get("/recursos/", response_model=list[schemas.RecursoResponse])
def listar_recursos(skip: int = Query(0, ge=0), limit: int = Query(10, le=100), db: Session = Depends(get_db)):

    recursos = db.query(models.Recurso).offset(skip).limit(limit).all()
    return recursos

@router.put("/recursos/{recurso_id}", response_model=schemas.RecursoResponse)
def atualizar_recurso(recurso_id: int, recurso: schemas.RecursoCreate, db: Session = Depends(get_db)):
    db_recurso = db.query(models.Recurso).filter(models.Recurso.id == recurso_id).first()
    if not db_recurso:
        raise HTTPException(status_code=404, detail="Recurso não encontrado")

    for key, value in recurso.model_dump().items():
        setattr(db_recurso, key, value)
        
    db.commit()
    db.refresh(db_recurso)
    return db_recurso

@router.delete("/recursos/{recurso_id}")
def excluir_recurso(recurso_id: int, db: Session = Depends(get_db)):
    db_recurso = db.query(models.Recurso).filter(models.Recurso.id == recurso_id).first()
    if not db_recurso:
        raise HTTPException(status_code=404, detail="Recurso não encontrado")
        
    db.delete(db_recurso)
    db.commit()
    return {"mensagem": "Recurso excluído com sucesso"}
