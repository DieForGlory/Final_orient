"""
Collections routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db, Collection, Product
from schemas import CollectionCreate, CollectionUpdate
from auth import require_admin

router = APIRouter()

@router.get("/collections")
async def get_collections(db: Session = Depends(get_db)):
    """Get all collections"""
    collections = db.query(Collection).filter(Collection.active == True).all()
    
    result = []
    for col in collections:
        # Count products in collection
        watch_count = db.query(Product).filter(
            Product.collection == col.name
        ).count()
        
        result.append({
            "id": col.id,
            "name": col.name,
            "description": col.description,
            "image": col.image,
            "watchCount": watch_count,
            "number": col.number,
            "active": col.active,
            "createdAt": col.created_at.isoformat() if col.created_at else None
        })
    
    return result

@router.get("/collections/{collection_id}")
async def get_collection(collection_id: str, db: Session = Depends(get_db)):
    """Get collection by ID"""
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Count products
    watch_count = db.query(Product).filter(
        Product.collection == collection.name
    ).count()
    
    return {
        "id": collection.id,
        "name": collection.name,
        "description": collection.description,
        "image": collection.image,
        "watchCount": watch_count,
        "number": collection.number,
        "active": collection.active
    }

@router.get("/collections/{collection_id}/products")
async def get_collection_products(
    collection_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get products in collection"""
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Get products
    query = db.query(Product).filter(Product.collection == collection.name)
    
    total = query.count()
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()
    
    data = [product.to_dict() for product in products]
    
    return {
        "data": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    }

@router.post("/admin/collections")
async def create_collection(
    collection: CollectionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Create collection"""
    # Check if exists
    existing = db.query(Collection).filter(Collection.id == collection.id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Collection already exists")
    
    db_collection = Collection(**collection.dict())
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    
    return {"message": "Collection created", "id": db_collection.id}

@router.put("/admin/collections/{collection_id}")
async def update_collection(
    collection_id: str,
    collection: CollectionUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update collection"""
    db_collection = db.query(Collection).filter(Collection.id == collection_id).first()
    
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    update_data = collection.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_collection, key, value)
    
    db.commit()
    
    return {"message": "Collection updated"}

@router.delete("/admin/collections/{collection_id}")
async def delete_collection(
    collection_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Delete collection"""
    db_collection = db.query(Collection).filter(Collection.id == collection_id).first()
    
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    db.delete(db_collection)
    db.commit()
    
    return {"message": "Collection deleted"}
