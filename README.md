# Page Pulse

**Built for the Digital Heroes SDE Training Task**

A full-stack web tool that audits any URL and returns core metrics, including HTTP status, response times, and SEO elements. 

* **Live Frontend:** https://page-pulse-one.vercel.app/
* **Live API:** https://page-pulse-a01i.onrender.com/docs

---

## 🏗️ 3 Key Design Decisions

1. **Decoupling Parsing Logic from API Routing:** 
   * **Reasoning:** I isolated the `BeautifulSoup` HTML parsing logic into a dedicated `services/parser.py` file, completely separate from the FastAPI route handler. This architectural decision makes the parsing logic pure and deterministic, allowing me to write rapid unit tests using static HTML strings without having to mock complex network requests.
2. **FastAPI & Pydantic for the Backend:**
   * **Reasoning:** I chose FastAPI over Flask/Express because it natively uses Pydantic for data validation. This enforces a strict API contract (e.g., rejecting invalid URL formats automatically with a 422 error) and auto-generates interactive Swagger documentation, ensuring the backend is robust and developer-friendly.
3. **Monorepo Directory Structure:**
   * **Reasoning:** I structured the project as a monorepo containing both the React frontend and Python backend. This reduces context switching, simplifies version control tracking, and makes it significantly easier for reviewers to evaluate the full-stack architecture in a single repository.

---

## 📡 API Contract

**Endpoint:** `POST /api/audit`

**Request Body:**
```json
{
  "url": "https://github.com"
}