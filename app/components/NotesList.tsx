'use client';

import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import { Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getAllNotes, deleteNote, Note } from '../services/notesService';

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await getAllNotes();
      setNotes(data);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      setError(error.response?.data?.error || 'Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    const noteId = note._id || note.note_id;
    if (!noteId) {
      console.error('Invalid note ID');
      return;
    }
    console.log('Editing note with ID:', noteId);
    router.push(`/notes/${noteId}/edit`);
  };

  const handleDelete = async (note: Note) => {
    const noteId = note._id || note.note_id;
    if (!noteId) {
      console.error('Invalid note ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
        fetchNotes();
      } catch (error: any) {
        console.error('Error deleting note:', error);
        setError(error.response?.data?.error || 'Failed to delete note. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {notes.length === 0 ? (
        <Grid component="div" columns={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 4
              }
            }}
            onClick={() => router.push('/notes/new')}
          >
            <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Create Your First Note
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click here to start writing your first note
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Create Note
            </Button>
          </Paper>
        </Grid>
      ) : (
        notes.map((note) => (
          <Grid component="div" columns={{ xs: 12, sm: 6, md: 4 }} key={note._id || note.note_id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" gutterBottom>
                  {note.note_title}
                </Typography>
                <Box>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEdit(note)}
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(note)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  flexGrow: 1,
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {note.note_content}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Last updated: {new Date(note.last_update).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))
      )}
    </Grid>
  );
} 