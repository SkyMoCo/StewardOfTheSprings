from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, Date
from sqlalchemy.types import JSON
from datetime import datetime
from database import Base


class PublicCheckin(Base):
    __tablename__ = "public_checkins"

    id = Column(Integer, primary_key=True, index=True)
    spring_name = Column(String(200), nullable=False)
    visitor_name = Column(String(200), nullable=True)
    visitor_email = Column(String(200), nullable=True)
    visit_date = Column(Date, nullable=False)
    actions = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    is_issue = Column(Boolean, default=False)
    submitted_at = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
