'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getNote, Note } from '../services/notesService';

interface NoteDetailClientProps {
  noteId: string;
}

export default function NoteDetailClient({ noteId }: NoteDetailClientProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNote();
    }
  }, [user]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getNote(noteId);
      setNote(data);
    } catch (error: any) {
      console.error('Error fetching note:', error);
      setError(error.response?.data?.error || 'Failed to load note. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!note) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Note not found
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {note.note_title}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push(`/notes/${noteId}/edit`)}
          >
            Edit
          </Button>
        </Box>
        
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            mb: 2
          }}
        >
          {note.note_content}
        </Typography>
        
        <Typography variant="caption" color="textSecondary">
          Last updated: {new Date(note.last_update).toLocaleString()}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/notes')}
          >
            Back to Notes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 