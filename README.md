# Industrial Brain AI
### *Unified Asset & Operations Intelligence Platform*

Industrial Brain AI is an enterprise-grade Operations Intelligence platform designed for asset-heavy industries (such as manufacturing, chemical processing, oil & gas, and utilities). By integrating digital document ingestion (OCR), natural language retrieval (RAG), and relationship modeling (Neo4j Knowledge Graph), the system equips engineers, safety officers, and auditors with instant access to actionable telemetry, predictive scheduling, and compliance scoring.

---

## 🚀 Key Capabilities

1. **AI OCR Ingestion Pipeline**: Auto-extract digital text, tables, and metadata from engineering drawings, Word files, spreadsheets, and scanned inspection forms using **Apache Tika**. It includes a simulated OCR template fallback if native Tesseract binaries are not loaded in the hosting sandbox.
2. **Conversational RAG Copilot**: Instant natural language Q&A using **LangChain4j** and **Google Gemini 1.5 Flash**. Provides precise answers regarding plant operations (e.g. *“What maintenance was performed on Pump P101?”*) complete with confidence ratings and highlighted source citations.
3. **Operations Knowledge Graph**: Constructed dynamically on **Neo4j Aura**. Maps assets, incidents, safety standards, departments, and employee logs, visualising structural dependencies.
4. **Maintenance Intelligence Engine**: Computes equipment Mean Time Between Failures (MTBF) and generates predictive maintenance forecasts.
5. **Compliance Intelligence Engine**: Scans plant logs against regulations (OSHA 1910.119 / ISO 45001) to compute safety compliance scores and identify gaps.
6. **Incident Intelligence Engine**: Clusters near-miss logs to identify recurring electrical or thermal hazards.

---

## 🛠️ Technology Stack (100% Free-Tier & Cloud-Hosted)

- **Backend**: Java 21, Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, Hibernate, OpenAPI/Swagger. Deployed on **Render / Railway Free Tier**.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Lucide, Vite. Deployed on **Vercel Free Tier**.
- **Database**: **Supabase Free PostgreSQL** (Primary Relational DB).
- **Graph Database**: **Neo4j Aura Free** (Cloud Graph Instance).
- **Storage**: **Cloudinary Free Tier** (Asset/PDF Uploads).
- **LLM/Embeddings**: **Google Gemini 1.5 Flash API** (Free Tier Key via AI Studio).

---

## 📂 Project Repository Directory

- [**Backend Service**](file:///d:/AntiGravity/Antigravity/industrial-brain-ai/backend/): Contains Spring Boot source code, pom.xml, and Docker configs.
- [**Frontend Client**](file:///d:/AntiGravity/Antigravity/industrial-brain-ai/frontend/): Contains React, TypeScript, Tailwind config, and Vite bundler setup.
- [**Docker Compose Config**](file:///d:/AntiGravity/Antigravity/industrial-brain-ai/docker-compose.yml): Root deployment compose file.
- [**Environment Configuration (.env.example)**](file:///d:/AntiGravity/Antigravity/industrial-brain-ai/.env.example): Complete template for system environment variables.

---

## 📋 Hackathon Submission Package (Artifacts)

The following artifacts have been created in the workspace app data directory for presentation submission:
1. [**Pitch Deck Outline (14 Slides)**](file:///C:/Users/mafaa/.gemini/antigravity/brain/9a97882a-e39b-4ec9-82e0-2c497c25f5c9/pitch_deck.md): Structured hackathon slides covering market problem, architecture, stack, and business model.
2. [**Technical Project Report**](file:///C:/Users/mafaa/.gemini/antigravity/brain/9a97882a-e39b-4ec9-82e0-2c497c25f5c9/project_report.md): Extensive report on features, system design, PostgreSQL ER schema, and business strategy.
3. [**Demo Video Script & Judges Q&A Prep**](file:///C:/Users/mafaa/.gemini/antigravity/brain/9a97882a-e39b-4ec9-82e0-2c497c25f5c9/demo_script.md): Script for a 3-5 minute video and prepared questions regarding API limits, OCR parsing, and database scales.

---

## 💻 Local Installation & Setup

### Prerequisite Environment Paths
Make sure you have **Java 21** and **Node.js (v22+)** installed. In our current session:
- Java JDK is located at: `D:\New Volume (D)\java`
- Node.js is located at: `C:\Users\mafaa\eclipse\jee-2025-12\eclipse\.node\node-v22.21.1-win-x64`

### 1. Run Backend Service
1. Navigate to the `backend/` directory.
2. Configure credentials in `.env` (or copy `.env.example`). If no variables are set, the system will fall back to H2 database and Simulated RAG.
3. Run the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```
4. Access the Swagger UI for API documentation: `http://localhost:8080/swagger-ui.html`

### 2. Run Frontend Client
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch Vite Dev Server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser: `http://localhost:5173`

---

## 🐳 Docker Deployment

To launch the entire stack (both React frontend and Spring Boot backend) locally using Docker:
```bash
docker-compose up --build
```
- **React Frontend**: `http://localhost`
- **Spring Boot Backend**: `http://localhost:8080`
- **H2 Console (DB GUI)**: `http://localhost:8080/h2-console`
