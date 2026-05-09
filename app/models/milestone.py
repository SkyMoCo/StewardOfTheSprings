from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    spring_id = Column(Integer, ForeignKey("springs.id"), nullable=False)
    milestone_type = Column(String(100), nullable=False)
    achieved_date = Column(Date)
    description = Column(Text)

    participant = relationship("Participant", back_populates="milestones")
    spring = relationship("Spring", back_populates="milestones")
