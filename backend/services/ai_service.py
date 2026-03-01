import os
import json
from dotenv import load_dotenv
from google import genai

# Carrega as variáveis de ambiente
load_dotenv()

class SmartAssistService:
    def __init__(self):
        # A biblioteca nova é muito mais inteligente. 
        # Ela acha o seu GEMINI_API_KEY no .env automaticamente!
        self.client = genai.Client()

    def gerar_sugestoes(self, titulo: str, tipo: str) -> dict:
        prompt = f"""
        Você é um curador especialista em recursos educacionais.
        Eu vou cadastrar um material com as seguintes informações:
        - Título: "{titulo}"
        - Tipo de Material: "{tipo}"

        Sua tarefa é analisar esse contexto e gerar:
        1. Uma breve descrição engajadora (máximo de 3 linhas) explicando o que o aluno vai aprender com isso.
        2. Exatamente 3 tags curtas e relevantes.

        ATENÇÃO: Retorne EXCLUSIVAMENTE um objeto JSON válido, sem usar blocos de código markdown (```json). 
        O formato DEVE ser exatamente este:
        {{
            "descricao": "Escreva a descrição aqui",
            "tags": ["tag1", "tag2", "tag3"]
        }}
        """

        try:
            # Novo padrão de chamada da API do Google
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            
            # Limpa e transforma o texto em JSON
            texto_limpo = response.text.replace('```json', '').replace('```', '').strip()
            resultado_json = json.loads(texto_limpo)
            return resultado_json
            
        except Exception as e:
            print(f"Erro ao consultar Gemini (Nova API): {e}")
            return {
                "descricao": "Não foi possível gerar uma descrição automática neste momento.",
                "tags": ["educação", "geral", "recurso"]
            }