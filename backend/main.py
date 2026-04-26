from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import List

from . import models, schemas, database, auth
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lando Norris Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ── AUTH ─────────────────────────────────────────────────────────────────────
@app.post("/api/auth/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    if form_data.username != auth.ADMIN_EMAIL or not auth.verify_password(form_data.password, auth.ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# ── TRACKING ─────────────────────────────────────────────────────────────────
@app.post("/api/track", response_model=schemas.Action)
def track_visitor(action: schemas.ActionCreate, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else None
    db_action = models.Action(
        page=action.page,
        action_type=action.action_type,
        referrer=action.referrer,
        user_agent=action.user_agent,
        ip_address=client_ip
    )
    db.add(db_action)
    db.commit()
    db.refresh(db_action)
    return db_action

# ── ADMIN ACTIVITY & STATS ────────────────────────────────────────────────────
@app.get("/api/admin/activity", response_model=List[schemas.Action])
def get_activity(db: Session = Depends(get_db), current_user: schemas.TokenData = Depends(auth.get_current_user)):
    return db.query(models.Action).order_by(models.Action.timestamp.desc()).limit(100).all()

@app.get("/api/admin/stats", response_model=schemas.AdminStats)
def get_admin_stats(db: Session = Depends(get_db), current_user: schemas.TokenData = Depends(auth.get_current_user)):
    views = db.query(models.Action).filter(models.Action.action_type == "page_view").count()
    orders = db.query(models.Order).count()
    subscribers = db.query(models.Newsletter).count()
    all_orders = db.query(models.Order).all()
    revenue = sum([o.total_price for o in all_orders])
    return {
        "total_views": views,
        "total_orders": orders,
        "revenue": revenue,
        "subscribers": subscribers
    }

# ── ORDERS ────────────────────────────────────────────────────────────────────
@app.post("/api/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Get product price from DB
    product = db.query(models.Product).filter(models.Product.id == order.product_id).first()
    unit_price = product.price if product else 99.0
    db_order = models.Order(
        **order.dict(),
        total_price=unit_price * order.quantity
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/api/orders", response_model=List[schemas.Order])
def get_orders(db: Session = Depends(get_db), current_user: schemas.TokenData = Depends(auth.get_current_user)):
    return db.query(models.Order).order_by(models.Order.timestamp.desc()).all()

@app.patch("/api/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, update: schemas.OrderStatusUpdate, db: Session = Depends(get_db), current_user: schemas.TokenData = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = update.status
    db.commit()
    db.refresh(order)
    return order

# ── CONTACT ───────────────────────────────────────────────────────────────────
@app.post("/api/contact", response_model=schemas.Contact)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_contact = models.Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@app.get("/api/contact", response_model=List[schemas.Contact])
def get_contacts(db: Session = Depends(get_db), current_user: schemas.TokenData = Depends(auth.get_current_user)):
    return db.query(models.Contact).order_by(models.Contact.timestamp.desc()).all()

# ── NEWSLETTER ────────────────────────────────────────────────────────────────
@app.post("/api/newsletter", response_model=schemas.Newsletter)
def subscribe_newsletter(newsletter: schemas.NewsletterCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Newsletter).filter(models.Newsletter.email == newsletter.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    db_newsletter = models.Newsletter(email=newsletter.email)
    db.add(db_newsletter)
    db.commit()
    db.refresh(db_newsletter)
    return db_newsletter

@app.get("/api/newsletter", response_model=List[schemas.Newsletter])
def get_newsletter(db: Session = Depends(get_db), current_user: schemas.TokenData = Depends(auth.get_current_user)):
    return db.query(models.Newsletter).order_by(models.Newsletter.timestamp.desc()).all()

# ── PRODUCTS ──────────────────────────────────────────────────────────────────
HELMET_PRODUCTS = [
    {
        "name": "Lando Norris 2025 Season Mini Helmet",
        "description": "Celebrate Lando's 2025 F1 season with this striking neon yellow 1:2 scale mini helmet. Featuring the iconic squiggle livery with Monster Energy and OKX sponsor logos, this hand-finished replica comes mounted on a display stand. Made by Bell — the same team who build Lando's race helmets. Features adjustable visor, chin strap, interior cushioning and HANS clip.",
        "price": 189.0,
        "image_url": "/helmet1.jpg",
        "category": "helmets",
        "badge": "MADE TO ORDER",
        "scale": "1:2 Scale",
        "ship_date": "30 Jul 2026",
        "in_stock": True
    },
    {
        "name": "Lando Norris Discoball Mini Helmet",
        "description": "One of Lando's most iconic lids — the legendary Discoball helmet, now immortalised as a 1:2 scale collectible. Encased in a premium acrylic display box, this mirror-finish chrome replica captures every reflective tile in stunning detail. A true showpiece for any serious F1 fan or collector. Limited run, made to order.",
        "price": 249.0,
        "image_url": "/helmet2.jpg",
        "category": "helmets",
        "badge": "LIMITED EDITION",
        "scale": "1:2 Scale",
        "ship_date": "30 Aug 2026",
        "in_stock": True
    },
    {
        "name": "Lando Norris Quadrant Heritage Mini Helmet",
        "description": "A bold tribute to Lando's early McLaren career — this 1:2 scale replica features the iconic white, red and blue Quadrant livery with Samsung Galaxy and Tezos branding. Gold visor hardware and full sponsor detail make this a standout piece. Crafted by Bell with the same precision as the full-size race helmet.",
        "price": 199.0,
        "image_url": "/helmet3.jpg",
        "category": "helmets",
        "badge": "MADE TO ORDER",
        "scale": "1:2 Scale",
        "ship_date": "15 Sep 2026",
        "in_stock": True
    },
    {
        "name": "Lando Norris Monster Energy Mini Helmet",
        "description": "Raw, aggressive and unmistakably Lando — this 1:2 scale Monster Energy edition helmet captures the vivid green and black livery from one of his most memorable race weekends. Featuring OKX, Dropbox and Mastercard sponsor logos with full interior detail. A must-have for Monster and McLaren fans alike.",
        "price": 189.0,
        "image_url": "/helmet4.jpg",
        "category": "helmets",
        "badge": "MADE TO ORDER",
        "scale": "1:2 Scale",
        "ship_date": "1 Oct 2026",
        "in_stock": True
    },
    {
        "name": "Lando Norris FxPro Edition Mini Helmet",
        "description": "The FxPro neon yellow and blue helmet — a fan favourite from Lando's championship-winning season. This 1:2 scale replica features the Dell Technologies visor strip, Tezos and LiKart branding across a vivid lime and cobalt blue finish. Comes with full display stand and certificate of authenticity.",
        "price": 199.0,
        "image_url": "/helmet5.jpg",
        "category": "helmets",
        "badge": "MADE TO ORDER",
        "scale": "1:2 Scale",
        "ship_date": "15 Oct 2026",
        "in_stock": True
    },
]


@app.get("/api/products", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    expected_names = {p["name"] for p in HELMET_PRODUCTS}
    existing_names = {p.name for p in products}
    if not products or not expected_names.issubset(existing_names):
        # Clear old seed data and re-seed with updated products
        db.query(models.Product).delete()
        db.commit()
        mocks = [models.Product(**p) for p in HELMET_PRODUCTS]
        db.add_all(mocks)
        db.commit()
        products = db.query(models.Product).all()
    return products

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
