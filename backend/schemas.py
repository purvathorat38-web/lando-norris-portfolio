from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Login(BaseModel):
    email: str
    password: str

class ActionBase(BaseModel):
    page: str
    action_type: str
    ip_address: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None

class ActionCreate(ActionBase):
    pass

class Action(ActionBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    category: Optional[str] = "helmets"
    badge: Optional[str] = "MADE TO ORDER"
    scale: Optional[str] = None
    ship_date: Optional[str] = None
    in_stock: Optional[bool] = True

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    product_id: int
    product_name: str
    quantity: int = 1
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postcode: Optional[str] = None
    country: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderStatusUpdate(BaseModel):
    status: str

class Order(OrderBase):
    id: int
    total_price: float
    status: str
    timestamp: datetime
    class Config:
        from_attributes = True

class ContactBase(BaseModel):
    name: str
    email: str
    message: str

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class NewsletterBase(BaseModel):
    email: str

class NewsletterCreate(NewsletterBase):
    pass

class Newsletter(NewsletterBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class NewsBase(BaseModel):
    title: str
    content: str
    image_url: str

class NewsCreate(NewsBase):
    pass

class News(NewsBase):
    id: int
    date: datetime
    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    total_views: int
    total_orders: int
    revenue: float
    subscribers: int
