import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import EditNoteClient from '../../../components/EditNoteClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditNotePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  if (!params?.id) {
    redirect('/notes');
  }

  return <EditNoteClient noteId={params.id} />;
} 