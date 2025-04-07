'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  CircularProgress,
  Alert
} from '@mui/material';
import { createNote } from '../services/notesService';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface CreateNoteProps {
  onNoteCreated: () => void;
}

export default function CreateNote({ onNoteCreated }: CreateNoteProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a note');
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
      setLoading(true);
      setError('');
      
      await createNote({ 
        note_title: title.trim(),
        note_content: content.trim()
      });
      
      // Reset form
      setTitle('');
      setContent('');
      
      // Refresh notes list
      onNoteCreated();
      
      // Show success message
      router.push('/notes?created=true');
      
    } catch (error: any) {
      console.error('Failed to create note:', error);
      setError(error.response?.data?.error || 'Failed to create note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        maxWidth: 800,
        mx: 'auto',
        mt: 4
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create New Note
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate
        sx={{ mt: 2 }}
      >
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          error={!!error && !title.trim()}
          helperText={!title.trim() ? "Title is required" : ""}
          disabled={loading}
        />
        
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          error={!!error && !content.trim()}
          helperText={!content.trim() ? "Content is required" : ""}
          disabled={loading}
        />
        
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button 
            type="button" 
            variant="outlined"
            onClick={() => router.push('/notes')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creating...' : 'Create Note'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
} 