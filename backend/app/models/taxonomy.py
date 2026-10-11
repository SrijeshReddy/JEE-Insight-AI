from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base


class SubjectModel(Base):
    __tablename__ = "taxonomy_subjects"

    id = Column(String(32), primary_key=True)  # 'Physics', 'Chemistry', 'Mathematics'
    name = Column(String(64), nullable=False)

    units = relationship("UnitModel", back_populates="subject", cascade="all, delete-orphan")


class UnitModel(Base):
    __tablename__ = "taxonomy_units"

    id = Column(String(64), primary_key=True)
    subject_id = Column(String(32), ForeignKey("taxonomy_subjects.id"), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    order_index = Column(Integer, default=0)

    subject = relationship("SubjectModel", back_populates="units")
    chapters = relationship("ChapterModel", back_populates="unit", cascade="all, delete-orphan")


class ChapterModel(Base):
    __tablename__ = "taxonomy_chapters"

    id = Column(String(64), primary_key=True)
    unit_id = Column(String(64), ForeignKey("taxonomy_units.id"), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    order_index = Column(Integer, default=0)

    unit = relationship("UnitModel", back_populates="chapters")
    concepts = relationship("ConceptModel", back_populates="chapter", cascade="all, delete-orphan")


class ConceptModel(Base):
    __tablename__ = "taxonomy_concepts"

    id = Column(String(64), primary_key=True)
    chapter_id = Column(String(64), ForeignKey("taxonomy_chapters.id"), nullable=False, index=True)
    code = Column(String(32), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    weightage_tier = Column(String(16), default="Medium")  # High, Medium, Low

    chapter = relationship("ChapterModel", back_populates="concepts")
    error_archetypes = relationship("ErrorArchetypeModel", back_populates="concept", cascade="all, delete-orphan")


class ErrorArchetypeModel(Base):
    __tablename__ = "taxonomy_error_archetypes"

    id = Column(String(64), primary_key=True)
    concept_id = Column(String(64), ForeignKey("taxonomy_concepts.id"), nullable=True, index=True)
    name = Column(String(128), nullable=False)
    category = Column(String(32), nullable=False)  # Conceptual, Careless, Time Pressure, Unattempted
    description = Column(Text, nullable=True)

    concept = relationship("ConceptModel", back_populates="error_archetypes")
