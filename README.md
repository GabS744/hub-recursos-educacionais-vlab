# 🧠 Hub Inteligente de Recursos Educacionais

Uma aplicação Fullstack desenvolvida para o gerenciamento de materiais didáticos, contando com integração de Inteligência Artificial para otimização do fluxo de trabalho de conteudistas.

Este projeto foi desenvolvido como resposta ao desafio técnico para a equipe do V-lab.

## ✨ Funcionalidades

* **CRUD Completo de Recursos:** Listagem (com paginação otimizada), Cadastro, Edição e Exclusão de materiais (Vídeo, PDF, Link).
* **Smart Assist (IA):** Integração com o modelo **Google Gemini 2.5 Flash**. Atuando com um prompt de sistema configurado como um *Assistente Pedagógico*, a IA sugere descrições úteis e categorizações automáticas (Tags) baseadas no título e tipo do material.
* **Interface Reativa e Amigável:** SPA desenvolvida em React com feedback visual em tempo real (Loading states, Toasts de notificação e modais de confirmação customizados).
* **DevOps & Observabilidade:**
    * Infraestrutura 100% containerizada via **Docker Compose**.
    * Integração Contínua (CI) configurada com **GitHub Actions** rodando linter (flake8) a cada Push/PR.
    * Logs estruturados registrando a latência e o consumo de tokens (TokenUsage) em cada requisição para a IA.
    * Endpoint dedicado para verificação de disponibilidade (/health).

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* React 18 + Vite (Node 22)
* Tailwind CSS (Estilização)
* Lucide React (Ícones)
* React Hot Toast (Notificações)
* Axios (Consumo da API)

**Backend:**
* Python 3.10
* FastAPI (Framework RESTful de alta performance)
* Pydantic (Validação de dados rigorosa)
* SQLAlchemy (ORM) + PyMySQL
* Google Generative AI SDK (Integração LLM)

**Banco de Dados & Infraestrutura:**
* MySQL 8.0
* Docker & Docker Compose
* GitHub Actions (CI Pipeline)

---

## 🚀 Como Executar o Projeto Localmente

O projeto foi configurado com Docker para garantir que o ambiente rode perfeitamente em qualquer máquina de forma isolada, sem a necessidade de instalar e configurar as dependências e o banco de dados manualmente.

### Pré-requisitos
* Docker e Docker Compose instalados.
* Git instalado.
* Uma chave de API válida do Google Gemini (obtida no Google AI Studio).

### Passo a Passo

**1. Clone o repositório**
git clone https://github.com/GabS744/hub-recursos-educacionais-vlab.git
cd hub-recursos-educacionais-vlab

**2. Configure as Variáveis de Ambiente do Backend**
Por questões de segurança, os arquivos .env não são versionados. Você deve criá-los a partir dos arquivos de exemplo disponíveis no projeto.

Navegue até a pasta backend e crie uma cópia do arquivo .env.example:
cd backend
cp .env.example .env

Abra o arquivo backend/.env recém-criado em seu editor de texto e insira a sua chave de API na variável GEMINI_API_KEY. 
Nota: A string de conexão com o banco de dados (DATABASE_URL) já está pré-configurada para funcionar perfeitamente com o container do MySQL. Não é necessário alterá-la.

**3. Configure as Variáveis de Ambiente do Frontend**
Volte para a raiz e faça o mesmo processo na pasta frontend:
cd ../frontend
cp .env.example .env
cd ..

O arquivo frontend/.env já vem com a URL padrão configurada (VITE_API_URL=http://localhost:8000). Se não houver necessidade de rodar em outra porta, basta mantê-lo assim.

**4. Suba a Infraestrutura com Docker**
Com os arquivos .env devidamente criados, garanta que você está na raiz do projeto (onde está localizado o arquivo docker-compose.yml) e execute o comando:
docker compose up --build

Na primeira execução, o Docker irá baixar as imagens do Node, Python e MySQL, o que pode levar alguns minutos dependendo da sua conexão.

**5. Acesse a Aplicação**
Assim que o terminal indicar que as aplicações estão prontas, acesse nos links abaixo:
* **Interface Web (Frontend):** http://localhost:5173
* **Documentação da API (Swagger UI):** http://localhost:8000/docs
* **Health Check do Backend:** http://localhost:8000/health

---

## 📊 Observabilidade e Logs

A aplicação registra logs estruturados no backend durante as chamadas da IA. Ao utilizar o botão "Gerar Descrição com IA" no frontend, o terminal do Docker exibirá registros no formato abaixo, cumprindo os requisitos de observabilidade:

[INFO] AI Request: Title="Curso de Python", TokenUsage=142, Latency=1.85s

## 🔒 Segurança Aplicada

* Nenhuma chave sensível (API Keys, credenciais de banco) está exposta no código-fonte.
* O repositório utiliza configurações rigorosas no .gitignore, protegendo os arquivos .env originais.
* A API e a aplicação comunicam-se de forma estruturada, com tratamento de erros tanto no backend quanto na interface em caso de falhas da IA.