"""
Database configuration and connection
SQLite database with SQLAlchemy ORM
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import json

# Database URL
DATABASE_URL = "sqlite:///./orient.db"

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite
)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="user")  # user, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    
    orders = relationship("Order", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    collection = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
    image = Column(String)
    images = Column(Text)  # JSON array
    description = Column(Text)
    features = Column(Text)  # JSON array
    specs = Column(Text)  # JSON object
    in_stock = Column(Boolean, default=True)
    stock_quantity = Column(Integer, default=0)
    sku = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "collection": self.collection,
            "price": self.price,
            "image": self.image,
            "images": json.loads(self.images) if self.images else [],
            "description": self.description,
            "features": json.loads(self.features) if self.features else [],
            "specs": json.loads(self.specs) if self.specs else {},
            "inStock": self.in_stock,
            "stockQuantity": self.stock_quantity,
            "sku": self.sku,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

class Collection(Base):
    __tablename__ = "collections"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    image = Column(String)
    watch_count = Column(Integer, default=0)
    number = Column(String)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_data = Column(Text)  # JSON object
    items = Column(Text)  # JSON array
    subtotal = Column(Float, nullable=False)
    shipping = Column(Float, default=0)
    total = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, processing, completed, cancelled
    payment_method = Column(String)
    delivery_method = Column(String)
    delivery_address = Column(Text)  # JSON object
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")

class ContentHero(Base):
    __tablename__ = "content_hero"
    
    id = Column(Integer, primary_key=True, default=1)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)
    image = Column(String, nullable=False)
    cta_text = Column(String, nullable=False)
    cta_link = Column(String, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ContentPromoBanner(Base):
    __tablename__ = "content_promo_banner"
    
    id = Column(Integer, primary_key=True, default=1)
    text = Column(String, nullable=False)
    code = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    background_color = Column(String, default="#000000")
    text_color = Column(String, default="#FFFFFF")
    highlight_color = Column(String, default="#C8102E")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ContentFeaturedWatch(Base):
    __tablename__ = "content_featured_watches"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    order_num = Column(Integer, nullable=False)
    is_new = Column(Boolean, default=False)

class ContentHeritage(Base):
    __tablename__ = "content_heritage"
    
    id = Column(Integer, primary_key=True, default=1)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    cta_text = Column(String, nullable=False)
    cta_link = Column(String, nullable=False)
    years_text = Column(String, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)
