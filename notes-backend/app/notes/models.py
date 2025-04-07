from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from uuid import uuid4

class NoteBase(BaseModel):
    note_title: str
    note_content: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    note_title: Optional[str] = None
    note_content: Optional[str] = None

class NoteInDB(NoteBase):
    note_id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    created_on: datetime = Field(default_factory=datetime.utcnow)
    last_update: datetime = Field(default_factory=datetime.utcnow)

class Note(NoteBase):
    note_id: str
    created_on: datetime
    last_update: datetime 