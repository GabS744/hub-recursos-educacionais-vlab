from sqlalchemy import Column, Integer, String, Text, JSON
from core.database import Base

class Recurso(Base):
    __tablename__ = "recursos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    descricao = Column(Text, nullable=True)
    tipo = Column(String(50), nullable=False)
    url = Column(String(500), nullable=False)
    tags = Column(JSON, nullable=True)