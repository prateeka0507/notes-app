'use client';

import React, { useState } from 'react';
import { Container, Typography, Button, Box, Fab, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateNote from './CreateNote';
import NotesList from './NotesList';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NotesPageClient() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const handleNoteCreated = () => {
    setRefreshKey(prev => prev + 1);
    setShowCreateForm(false);
    setShowSuccessMessage(true);
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading) {
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

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          position: 'relative'
        }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Your Notes
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Welcome, {user.user_name}!
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setShowCreateForm(true)}
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'none',
                  px: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                Create Note
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleLogout}
                sx={{
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>

          {/* Success Message */}
          {showSuccessMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Note created successfully!
            </Alert>
          )}

          {/* Create Note Form */}
          {showCreateForm && (
            <Box sx={{ mb: 3 }}>
              <CreateNote onNoteCreated={handleNoteCreated} />
            </Box>
          )}
          
          {/* Notes List */}
          <NotesList key={refreshKey} />

          {/* Floating Action Button */}
          <Fab 
            color="primary"
            aria-label="add note"
            sx={{ 
              position: 'fixed', 
              bottom: 32, 
              right: 32,
              boxShadow: 6,
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.2s'
              }
            }}
            onClick={() => setShowCreateForm(true)}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Container>
    </Box>
  );
}
