from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..database import get_note_collection
from .models import Note, NoteCreate, NoteUpdate, NoteInDB
from ..auth.jwt import get_current_active_user
from ..auth.models import User
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/notes", tags=["notes"])

@router.get("/", response_model=List[Note])
async def get_all_notes(current_user: User = Depends(get_current_active_user)):
    """Get all notes for the authenticated user"""
    try:
        logger.info(f"Fetching notes for user: {current_user.user_id}")
        collection = await get_note_collection()
        notes = []
        async for note in collection.find({"user_id": current_user.user_id}):
            notes.append(Note(
                note_id=note["note_id"],
                note_title=note["note_title"],
                note_content=note["note_content"],
                created_on=note["created_on"],
                last_update=note["last_update"]
            ))
        logger.info(f"Found {len(notes)} notes for user {current_user.user_id}")
        return notes
    except Exception as e:
        logger.error(f"Error fetching notes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch notes"
        )

@router.get("/{note_id}", response_model=Note)
async def get_note(note_id: str, current_user: User = Depends(get_current_active_user)):
    """Get a specific note by ID"""
    collection = await get_note_collection()
    note = await collection.find_one({
        "note_id": note_id,
        "user_id": current_user.user_id
    })
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return Note(
        note_id=note["note_id"],
        note_title=note["note_title"],
        note_content=note["note_content"],
        created_on=note["created_on"],
        last_update=note["last_update"]
    )

@router.post("/", response_model=Note, status_code=status.HTTP_201_CREATED)
async def create_note(note_data: NoteCreate, current_user: User = Depends(get_current_active_user)):
    """Create a new note"""
    collection = await get_note_collection()
    note = NoteInDB(
        note_title=note_data.note_title,
        note_content=note_data.note_content,
        user_id=current_user.user_id
    )
    
    note_dict = note.dict()
    
    # Insert into database
    await collection.insert_one(note_dict)
    
    return Note(
        note_id=note_dict["note_id"],
        note_title=note_dict["note_title"],
        note_content=note_dict["note_content"],
        created_on=note_dict["created_on"],
        last_update=note_dict["last_update"]
    )

@router.put("/{note_id}", response_model=Note)
async def update_note(
    note_id: str, 
    note_data: NoteUpdate, 
    current_user: User = Depends(get_current_active_user)
):
    """Update an existing note"""
    collection = await get_note_collection()
    # Check if note exists and belongs to the user
    note = await collection.find_one({
        "note_id": note_id,
        "user_id": current_user.user_id
    })
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Prepare update data
    update_data = {}
    
    if note_data.note_title is not None:
        update_data["note_title"] = note_data.note_title
    
    if note_data.note_content is not None:
        update_data["note_content"] = note_data.note_content
    
    # Add the last_update timestamp
    update_data["last_update"] = datetime.utcnow()
    
    # Update the note
    await collection.update_one(
        {"note_id": note_id, "user_id": current_user.user_id},
        {"$set": update_data}
    )
    
    # Get the updated note
    updated_note = await collection.find_one({
        "note_id": note_id,
        "user_id": current_user.user_id
    })
    
    return Note(
        note_id=updated_note["note_id"],
        note_title=updated_note["note_title"],
        note_content=updated_note["note_content"],
        created_on=updated_note["created_on"],
        last_update=updated_note["last_update"]
    )

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str, current_user: User = Depends(get_current_active_user)):
    """Delete a note"""
    collection = await get_note_collection()
    result = await collection.delete_one({
        "note_id": note_id,
        "user_id": current_user.user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        ) 