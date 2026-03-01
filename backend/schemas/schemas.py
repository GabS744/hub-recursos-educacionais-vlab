from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class RecursoBase(BaseModel):
    titulo: str
    tipo: str
    url: str
    descricao: Optional[str] = None
    tags: Optional[List[str]] = None

class RecursoCreate(RecursoBase):
    pass

class RecursoResponse(RecursoBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class SmartAssistRequest(BaseModel):
    titulo: str
    tipo: str

class SmartAssistResponse(BaseModel):
    descricao: str
    tags: List[str]