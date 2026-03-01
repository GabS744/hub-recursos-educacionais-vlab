from sqlalchemy.orm import Session
from models.models import Recurso
from schemas.schemas import RecursoCreate

class RecursoRepository:
    def __init__(self, db: Session):
        self.db = db

    def criar(self, recurso: RecursoCreate):
        novo_recurso = Recurso(**recurso.model_dump())
        self.db.add(novo_recurso)
        self.db.commit()
        self.db.refresh(novo_recurso)
        return novo_recurso

    def listar(self, skip: int = 0, limit: int = 10):
        return self.db.query(Recurso).offset(skip).limit(limit).all()

    def buscar_por_id(self, recurso_id: int):
        return self.db.query(Recurso).filter(Recurso.id == recurso_id).first()

    def atualizar(self, recurso_banco: Recurso, recurso_atualizado: RecursoCreate):
        for key, value in recurso_atualizado.model_dump().items():
            setattr(recurso_banco, key, value)
        self.db.commit()
        self.db.refresh(recurso_banco)
        return recurso_banco

    def deletar(self, recurso_banco: Recurso):
        self.db.delete(recurso_banco)
        self.db.commit()