import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  note_title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  note_content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  user_id: {
    type: String,
    required: [true, 'User ID is required']
  },
  last_update: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries
noteSchema.index({ user_id: 1 });

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

export default Note; 