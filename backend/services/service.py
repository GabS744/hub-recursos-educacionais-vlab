from sqlalchemy.orm import Session
from fastapi import HTTPException
from schemas import schemas
from repositories.repository import RecursoRepository

class RecursoService:
    def __init__(self, db: Session):

        self.repository = RecursoRepository(db)

    def criar_recurso(self, recurso: schemas.RecursoCreate):

        return self.repository.criar(recurso)

    def listar_recursos(self, skip: int = 0, limit: int = 10):
        return self.repository.listar(skip, limit)

    def atualizar_recurso(self, recurso_id: int, recurso_atualizado: schemas.RecursoCreate):
        recurso_banco = self.repository.buscar_por_id(recurso_id)
        if not recurso_banco:

            raise HTTPException(status_code=404, detail="Recurso não encontrado")
        
        return self.repository.atualizar(recurso_banco, recurso_atualizado)

    def deletar_recurso(self, recurso_id: int):
        recurso_banco = self.repository.buscar_por_id(recurso_id)
        if not recurso_banco:
            raise HTTPException(status_code=404, detail="Recurso não encontrado")
        
        self.repository.deletar(recurso_banco)
        return {"message": "Recurso deletado com sucesso!"}