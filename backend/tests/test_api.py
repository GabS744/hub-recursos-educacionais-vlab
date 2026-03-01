from fastapi.testclient import TestClient
from main import app


client = TestClient(app)

def test_listar_recursos_retorna_200():

    response = client.get("/recursos/")

    assert response.status_code == 200
    
    assert isinstance(response.json(), list)

def test_criar_recurso_sem_titulo_retorna_erro_422():

    payload_incompleto = {
        "url": "https://reactjs.org",
        "tipo": "Artigo"
    }
    
    response = client.post("/recursos/", json=payload_incompleto)

    assert response.status_code == 422