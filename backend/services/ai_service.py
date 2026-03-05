import os
import time
import logging
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

class SmartAssistService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def gerar_sugestoes(self, titulo: str, tipo: str):
        start_time = time.time()
        
        prompt = f"""
        Atue como um Assistente Pedagógico para gerar descrições úteis para alunos.
        Gere uma descrição curta e 3 tags recomendadas.
        Título: {titulo}
        Tipo: {tipo}
        
        Responda estritamente no formato JSON:
        {{
            "descricao": "string",
            "tags": ["tag1", "tag2", "tag3"]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)

            latency = round(time.time() - start_time, 2)
            tokens = response.usage_metadata.total_token_count if hasattr(response, 'usage_metadata') else 0

            logger.info(f'AI Request: Title="{titulo}", TokenUsage={tokens}, Latency={latency}s')
            
            content = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(content)
            
        except Exception as e:
            logger.error(f"Erro na interação com a IA: {str(e)}")
            raise e