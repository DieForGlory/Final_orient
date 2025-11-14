"""
Orient Watch - FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import init_db
from routes import admin, products, collections, orders, content, upload, bookings

# Initialize database
init_db()

app = FastAPI(
    title="Orient Watch API",
    description="API for Orient Watch e-commerce platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(admin.router)
app.include_router(products.router)
app.include_router(collections.router)
app.include_router(orders.router)
app.include_router(content.router)
app.include_router(upload.router)
app.include_router(bookings.router)

@app.get("/")
def read_root():
    return {"message": "Orient Watch API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)