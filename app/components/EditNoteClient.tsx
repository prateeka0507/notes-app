'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getNote, updateNote } from '../services/notesService';

interface EditNoteClientProps {
  noteId: string;
}

export default function EditNoteClient({ noteId }: EditNoteClientProps) {
  if (!noteId) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Invalid note ID
          </Alert>
          <Button
            variant="outlined"
            onClick={() => router.push('/notes')}
          >
            Back to Notes
          </Button>
        </Paper>
      </Box>
    );
  }

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchNote = async () => {
      if (!user) {
        setError('You must be logged in to edit a note');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        console.log('Fetching note with ID:', noteId);
        const note = await getNote(noteId);
        if (!note) {
          setError(`Note with ID ${noteId} not found`);
          return;
        }
        setTitle(note.note_title);
        setContent(note.note_content);
      } catch (error: any) {
        console.error('Error fetching note:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(error.response.data.error || 'Failed to load note. Please try again later.');
        } else if (error.request) {
          // The request was made but no response was received
          setError('No response received from server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError('Error setting up the request. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to edit a note');
      return;
    }
    
    // Validate inputs
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    if (title.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await updateNote(noteId, { 
        note_title: title.trim(),
        note_content: content.trim()
      });
      
      // Redirect back to notes list
      router.push('/notes');
      
    } catch (error: any) {
      console.error('Failed to update note:', error);
      setError(error.response?.data?.error || 'Failed to update note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="outlined"
            onClick={() => router.push('/notes')}
          >
            Back to Notes
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Note
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            error={!!error && !title.trim()}
            helperText={!title.trim() ? "Title is required" : ""}
            disabled={isSubmitting}
          />
          
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            multiline
            rows={6}
            required
            error={!!error && !content.trim()}
            helperText={!content.trim() ? "Content is required" : ""}
            disabled={isSubmitting}
          />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push('/notes')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
} 