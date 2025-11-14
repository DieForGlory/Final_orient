"""
Orient Watch - FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routes import admin, products, collections, orders, content, upload

# Create FastAPI app
app = FastAPI(
    title="Orient Watch API",
    description="Backend API for Orient Watch e-commerce",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
        "https://orient.uz",      # Production (замените на ваш домен)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(products.router, prefix="/api", tags=["Products"])
app.include_router(collections.router, prefix="/api", tags=["Collections"])
app.include_router(orders.router, prefix="/api", tags=["Orders"])
app.include_router(content.router, prefix="/api", tags=["Content"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])

@app.get("/")
async def root():
    return {
        "message": "Orient Watch API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
