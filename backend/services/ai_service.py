import os
import json
import time
import logging
from dotenv import load_dotenv
from google import genai

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

class SmartAssistService:
    def __init__(self):
        self.client = genai.Client()

    def gerar_sugestoes(self, titulo: str, tipo: str) -> dict:
        prompt = f"""
        Você é um curador especialista em recursos educacionais.
        Material - Título: "{titulo}" | Tipo: "{tipo}"
        Gere:
        1. Breve descrição engajadora (máx 3 linhas).
        2. 3 tags curtas.
        Retorne EXCLUSIVAMENTE um JSON válido: {{"descricao": "...", "tags": ["...", "..."]}}
        """
        
        start_time = time.time()
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            latency = time.time() - start_time

            logger.info(f'[INFO] AI Request: Title="{titulo}", Latency={latency:.2f}s, Status="Success"')
            
            texto_limpo = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(texto_limpo)
            
        except Exception as e:
            latency = time.time() - start_time
            logger.error(f'[ERROR] AI Request: Title="{titulo}", Latency={latency:.2f}s, Error="{str(e)}"')
            return {
                "descricao": "Não foi possível gerar uma descrição automática neste momento.",
                "tags": ["educação", "geral", "recurso"]
            }