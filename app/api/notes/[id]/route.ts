import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import Note from '../../../models/Note';
import connectDB from '../../../lib/db';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching note with ID:', params.id);
    console.log('User ID:', session.user.id);

    await connectDB();
    
    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(params.id);
    console.log('Is valid ObjectId:', isValidObjectId);
    
    let note;
    if (isValidObjectId) {
      note = await Note.findOne({ 
        $or: [
          { _id: params.id },
          { note_id: params.id }
        ],
        user_id: session.user.id 
      });
      console.log('Note found with _id:', note);
    } else {
      note = await Note.findOne({ 
        note_id: params.id,
        user_id: session.user.id 
      });
      console.log('Note found with note_id:', note);
    }

    if (!note) {
      console.log('Note not found for ID:', params.id);
      return NextResponse.json(
        { error: `Note not found with ID: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { note_title, note_content } = await request.json();
    
    if (!note_title || !note_content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const note = await Note.findOneAndUpdate(
      { 
        _id: params.id,
        user_id: session.user.id 
      },
      { 
        note_title,
        note_content,
        last_update: new Date()
      },
      { new: true }
    );

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const note = await Note.findOneAndDelete({ 
      _id: params.id,
      user_id: session.user.id 
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 