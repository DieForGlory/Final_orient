"""
Content management routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from database import get_db, ContentHero, ContentPromoBanner, ContentFeaturedWatch, ContentHeritage, Product
from schemas import HeroContent, PromoBanner, FeaturedWatch, HeritageSection
from auth import require_admin

router = APIRouter()

# Hero Content
@router.get("/content/hero")
async def get_hero_content(db: Session = Depends(get_db)):
    """Get hero content"""
    hero = db.query(ContentHero).filter(ContentHero.id == 1).first()
    
    if not hero:
        # Return default
        return {
            "title": "НАЙДИТЕ\nИДЕАЛЬНЫЕ\nЧАСЫ.",
            "subtitle": "Японское мастерство и точность в каждой детали",
            "image": "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80",
            "ctaText": "Смотреть коллекцию",
            "ctaLink": "/catalog"
        }
    
    return {
        "title": hero.title,
        "subtitle": hero.subtitle,
        "image": hero.image,
        "ctaText": hero.cta_text,
        "ctaLink": hero.cta_link
    }

@router.put("/admin/content/hero")
async def update_hero_content(
    content: HeroContent,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update hero content"""
    hero = db.query(ContentHero).filter(ContentHero.id == 1).first()
    
    if not hero:
        hero = ContentHero(id=1)
        db.add(hero)
    
    hero.title = content.title
    hero.subtitle = content.subtitle
    hero.image = content.image
    hero.cta_text = content.ctaText
    hero.cta_link = content.ctaLink
    
    db.commit()
    
    return {"message": "Hero content updated"}

# Promo Banner
@router.get("/content/promo-banner")
async def get_promo_banner(db: Session = Depends(get_db)):
    """Get promo banner"""
    banner = db.query(ContentPromoBanner).filter(ContentPromoBanner.id == 1).first()
    
    if not banner:
        return {
            "text": "СКИДКА 15% НА ВСЕ ЧАСЫ С КОДОМ",
            "code": "PRE2025",
            "active": True,
            "backgroundColor": "#000000",
            "textColor": "#FFFFFF",
            "highlightColor": "#C8102E"
        }
    
    return {
        "text": banner.text,
        "code": banner.code,
        "active": banner.active,
        "backgroundColor": banner.background_color,
        "textColor": banner.text_color,
        "highlightColor": banner.highlight_color
    }

@router.put("/admin/content/promo-banner")
async def update_promo_banner(
    banner: PromoBanner,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update promo banner"""
    db_banner = db.query(ContentPromoBanner).filter(ContentPromoBanner.id == 1).first()
    
    if not db_banner:
        db_banner = ContentPromoBanner(id=1)
        db.add(db_banner)
    
    db_banner.text = banner.text
    db_banner.code = banner.code
    db_banner.active = banner.active
    db_banner.background_color = banner.backgroundColor
    db_banner.text_color = banner.textColor
    db_banner.highlight_color = banner.highlightColor
    
    db.commit()
    
    return {"message": "Promo banner updated"}

# Featured Watches
@router.get("/content/featured-watches")
async def get_featured_watches(db: Session = Depends(get_db)):
    """Get featured watches"""
    featured = db.query(ContentFeaturedWatch).order_by(ContentFeaturedWatch.order_num).all()
    
    result = []
    for item in featured:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            result.append({
                "id": str(product.id),
                "name": product.name,
                "collection": product.collection,
                "price": product.price,
                "image": product.image,
                "isNew": item.is_new
            })
    
    return result

@router.put("/admin/content/featured-watches")
async def update_featured_watches(
    watches: list[FeaturedWatch],
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update featured watches"""
    # Delete existing
    db.query(ContentFeaturedWatch).delete()
    
    # Add new
    for watch in watches:
        db_watch = ContentFeaturedWatch(
            product_id=int(watch.productId),
            order_num=watch.order,
            is_new=watch.isNew
        )
        db.add(db_watch)
    
    db.commit()
    
    return {"message": "Featured watches updated"}

# Heritage Section
@router.get("/content/heritage")
async def get_heritage_section(db: Session = Depends(get_db)):
    """Get heritage section"""
    heritage = db.query(ContentHeritage).filter(ContentHeritage.id == 1).first()
    
    if not heritage:
        return {
            "title": "75 лет\nмастерства",
            "subtitle": "С 1950 года",
            "description": "Orient создает механические часы высочайшего качества, объединяя традиционное японское мастерство с современными технологиями.",
            "ctaText": "Узнать историю",
            "ctaLink": "/history",
            "yearsText": "75"
        }
    
    return {
        "title": heritage.title,
        "subtitle": heritage.subtitle,
        "description": heritage.description,
        "ctaText": heritage.cta_text,
        "ctaLink": heritage.cta_link,
        "yearsText": heritage.years_text
    }

@router.put("/admin/content/heritage")
async def update_heritage_section(
    heritage: HeritageSection,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update heritage section"""
    db_heritage = db.query(ContentHeritage).filter(ContentHeritage.id == 1).first()
    
    if not db_heritage:
        db_heritage = ContentHeritage(id=1)
        db.add(db_heritage)
    
    db_heritage.title = heritage.title
    db_heritage.subtitle = heritage.subtitle
    db_heritage.description = heritage.description
    db_heritage.cta_text = heritage.ctaText
    db_heritage.cta_link = heritage.ctaLink
    db_heritage.years_text = heritage.yearsText
    
    db.commit()
    
    return {"message": "Heritage section updated"}
