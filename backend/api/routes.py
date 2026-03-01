from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from schemas import schemas
from services.service import RecursoService

from services.ai_service import SmartAssistService

router = APIRouter(prefix="/recursos", tags=["Recursos"])

@router.post("/", response_model=schemas.RecursoResponse)
def criar_recurso(recurso: schemas.RecursoCreate, db: Session = Depends(get_db)):
    service = RecursoService(db)
    return service.criar_recurso(recurso)

@router.get("/", response_model=List[schemas.RecursoResponse])
def listar_recursos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    service = RecursoService(db)
    return service.listar_recursos(skip, limit)

@router.put("/{recurso_id}", response_model=schemas.RecursoResponse)
def atualizar_recurso(recurso_id: int, recurso_atualizado: schemas.RecursoCreate, db: Session = Depends(get_db)):
    service = RecursoService(db)
    return service.atualizar_recurso(recurso_id, recurso_atualizado)

@router.delete("/{recurso_id}")
def deletar_recurso(recurso_id: int, db: Session = Depends(get_db)):
    service = RecursoService(db)
    return service.deletar_recurso(recurso_id)

@router.post("/smart-assist", response_model=schemas.SmartAssistResponse)
def gerar_sugestoes_ia(request: schemas.SmartAssistRequest):

    ai_service = SmartAssistService()
    
    resultado = ai_service.gerar_sugestoes(titulo=request.titulo, tipo=request.tipo)
    
    return resultado