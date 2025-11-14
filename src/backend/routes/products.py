"""
Products routes - CRUD operations
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import json

from database import get_db, Product
from schemas import ProductCreate, ProductUpdate
from auth import require_admin

router = APIRouter()

@router.get("/products")
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    collection: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Get all products with filters and pagination"""
    query = db.query(Product)
    
    # Filters
    if search:
        query = query.filter(Product.name.contains(search))
    
    if collection:
        query = query.filter(Product.collection == collection)
    
    if minPrice is not None:
        query = query.filter(Product.price >= minPrice)
    
    if maxPrice is not None:
        query = query.filter(Product.price <= maxPrice)
    
    # Count total
    total = query.count()
    
    # Pagination
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()
    
    # Convert to dict
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

@router.get("/products/{product_id}")
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product.to_dict()

@router.post("/admin/products")
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Create new product"""
    # Check if SKU exists
    if product.sku:
        existing = db.query(Product).filter(Product.sku == product.sku).first()
        if existing:
            raise HTTPException(status_code=409, detail="SKU already exists")
    
    # Create product
    db_product = Product(
        name=product.name,
        collection=product.collection,
        price=product.price,
        image=product.image,
        images=json.dumps(product.images),
        description=product.description,
        features=json.dumps(product.features),
        specs=json.dumps(product.specs),
        in_stock=product.inStock,
        stock_quantity=product.stockQuantity,
        sku=product.sku
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product.to_dict()

@router.put("/admin/products/{product_id}")
async def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update product"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update fields
    update_data = product.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        if key == "images" and value is not None:
            setattr(db_product, key, json.dumps(value))
        elif key == "features" and value is not None:
            setattr(db_product, key, json.dumps(value))
        elif key == "specs" and value is not None:
            setattr(db_product, key, json.dumps(value))
        elif key == "inStock":
            setattr(db_product, "in_stock", value)
        elif key == "stockQuantity":
            setattr(db_product, "stock_quantity", value)
        else:
            setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    
    return db_product.to_dict()

@router.delete("/admin/products/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Delete product"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    
    return {"message": "Product deleted", "id": product_id}
