from sqlalchemy import Column, Integer, String, Text, Date, Enum, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum

class SpringStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    monitoring = "monitoring"

class AssignmentRole(str, enum.Enum):
    steward = "steward"
    monitor = "monitor"
    volunteer = "volunteer"

class Spring(Base):
    __tablename__ = "springs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    description = Column(Text)
    region = Column(String(100))
    status = Column(Enum(SpringStatus), default=SpringStatus.active)

    assignments = relationship("ParticipantSpring", back_populates="spring")
    logs = relationship("SpringLog", back_populates="spring")
    milestones = relationship("Milestone", back_populates="spring")
    seap_collections = relationship("SEAPCollection", back_populates="spring")

class ParticipantSpring(Base):
    __tablename__ = "participant_springs"

    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    spring_id = Column(Integer, ForeignKey("springs.id"), nullable=False)
    role = Column(Enum(AssignmentRole), default=AssignmentRole.volunteer)
    assigned_date = Column(Date)

    participant = relationship("Participant", back_populates="spring_assignments")
    spring = relationship("Spring", back_populates="assignments")
