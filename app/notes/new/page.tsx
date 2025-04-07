import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import CreateNoteClient from '../../components/CreateNoteClient';

export default async function NewNotePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  return <CreateNoteClient onNoteCreated={() => redirect('/notes')} />;
} 