import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import NoteDetailClient from '../../components/NoteDetailClient';

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  return <NoteDetailClient noteId={params.id} />;
} 