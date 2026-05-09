from sqlalchemy import Column, Integer, Text, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class SEAPStatus(str, enum.Enum):
    draft = "draft"
    submitted = "submitted"
    approved = "approved"

class SEAPCollection(Base):
    __tablename__ = "seap_collections"

    id = Column(Integer, primary_key=True, index=True)
    spring_id = Column(Integer, ForeignKey("springs.id"), nullable=False)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    collection_date = Column(Date, nullable=False)
    # SEAP-specific fields will be added after reviewing the actual SSI SEAP form
    field_notes = Column(Text)
    status = Column(Enum(SEAPStatus), default=SEAPStatus.draft)
    submitted_date = Column(DateTime)
    created_date = Column(DateTime, server_default=func.now())

    spring = relationship("Spring", back_populates="seap_collections")
    participant = relationship("Participant", back_populates="seap_collections")
