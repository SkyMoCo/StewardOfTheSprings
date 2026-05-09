from sqlalchemy import Column, Integer, Text, Date, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class SpringLog(Base):
    __tablename__ = "spring_logs"

    id = Column(Integer, primary_key=True, index=True)
    spring_id = Column(Integer, ForeignKey("springs.id"), nullable=False)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    visit_date = Column(Date, nullable=False)
    notes = Column(Text)
    conditions_observed = Column(Text)
    photos_url = Column(String(500))
    created_date = Column(DateTime, server_default=func.now())

    spring = relationship("Spring", back_populates="logs")
    participant = relationship("Participant", back_populates="logs")
