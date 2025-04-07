import axios from 'axios';

const API_URL = '/api/notes';

// Configure axios to include token in all requests
axios.interceptors.request.use(async (config) => {
  const response = await fetch('/api/auth/session');
  const session = await response.json();
  if (session?.user?.token) {
    config.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return config;
});

export interface Note {
  _id: string;
  note_id: string;
  note_title: string;
  note_content: string;
  last_update: string;
  user_id: string;
}

export const getAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNote = async (noteId: string): Promise<Note> => {
  try {
    console.log('Making request to fetch note with ID:', noteId);
    const response = await axios.get(`${API_URL}/${noteId}`);
    
    if (!response.data) {
      console.log('No data received in response');
      throw new Error(`Note with ID ${noteId} not found`);
    }
    
    console.log('Note fetched successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error in getNote:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.error || `Failed to fetch note with ID ${noteId}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request. Please try again.');
    }
  }
};

export const createNote = async (note: { note_title: string; note_content: string }): Promise<Note> => {
  try {
    const response = await axios.post(API_URL, note);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const updateNote = async (noteId: string, note: { note_title: string; note_content: string }): Promise<Note> => {
  try {
    const response = await axios.put(`${API_URL}/${noteId}`, note);
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${noteId}`);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}; 