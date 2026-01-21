import os
import mysql.connector
from mysql.connector import Error, pooling
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="QuranWithTahir Institutional API",
    description="Enterprise-grade backend for elite Quranic education platform.",
    version="4.1.0"
)

# Database Connection Pool for High Concurrency
try:
    db_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="qwt_pool",
        pool_size=10,
        host='localhost',
        database='quranwithtahir_db',
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASS', '')
    )
except Error as e:
    print(f"Critial: Database Pool Failure - {e}")
    db_pool = None

class UserEnrollment(BaseModel):
    academyId: str
    name: str
    email: EmailStr
    role: str
    course: Optional[str] = "General Tajweed"

class AIRequest(BaseModel):
    prompt: str

@app.get("/api/health")
def health():
    return {
        "status": "Operational",
        "engine": "Uvicorn/FastAPI",
        "db": "Connected" if db_pool else "Offline"
    }

@app.post("/api/enroll")
async def enroll_student(user: UserEnrollment):
    if not db_pool:
        raise HTTPException(status_code=500, detail="Persistence Layer Offline")
    
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor()
        query = """
        INSERT INTO users (academyId, name, email, role, course, status, timestamp)
        VALUES (%s, %s, %s, %s, %s, 'APPROVED', UNIX_TIMESTAMP())
        """
        cursor.execute(query, (user.academyId, user.name, user.email, user.role, user.course))
        conn.commit()
        return {"success": True, "id": user.academyId}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/api/ai-proxy")
async def ai_proxy(request: AIRequest):
    api_key = os.getenv("API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Server misconfigured: API_KEY missing")
    
    # Targeting Gemini 3 Flash for speed and intelligence
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={api_key}"
    
    payload = {
        "contents": [{
            "parts": [{"text": f"Context: Quran Academy. Query: {request.prompt}"}]
        }]
    }
    
    try:
        response = requests.post(url, json=payload, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI Bridge Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)