import time
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from app.services.parser import parse_html

app = FastAPI(title="Page Pulse API")

# Allow your React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Contracts
class AuditRequest(BaseModel):
    url: HttpUrl  # Automatically validates that the input is a valid URL format

class AuditResponse(BaseModel):
    http_status: int
    response_time_ms: int
    title: str | None
    meta_description: str | None
    h1_count: int
    images_missing_alt_text: int
    approximate_word_count: int

@app.post("/api/audit", response_model=AuditResponse)
async def audit_url(request: AuditRequest):
    start_time = time.time()
    
    try:
        # 10-second timeout to prevent hanging on bad servers
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(str(request.url), follow_redirects=True)
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request to the target URL timed out.")
    except httpx.RequestError:
        raise HTTPException(status_code=400, detail="Failed to reach the target URL. It may not exist.")

    # Explicitly check for non-HTML responses (e.g., PDFs, Images)
    content_type = response.headers.get('content-type', '').lower()
    if 'text/html' not in content_type:
        raise HTTPException(status_code=422, detail=f"Target URL returned a non-HTML content type: {content_type}")

    response_time_ms = int((time.time() - start_time) * 1000)
    
    # Pass the raw HTML to our isolated parser
    parsed_data = parse_html(response.text)
    
    return AuditResponse(
        http_status=response.status_code,
        response_time_ms=response_time_ms,
        **parsed_data
    )