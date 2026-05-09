from sqlalchemy import Column, Integer, String, Date, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class ParticipantStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    created_date = Column(Date)
    status = Column(Enum(ParticipantStatus), default=ParticipantStatus.active)

    spring_assignments = relationship("ParticipantSpring", back_populates="participant")
    logs = relationship("SpringLog", back_populates="participant")
    milestones = relationship("Milestone", back_populates="participant")
    seap_collections = relationship("SEAPCollection", back_populates="participant")
