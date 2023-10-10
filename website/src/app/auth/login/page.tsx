import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LoginPageClient from './LoginPageClient';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/');
  }

  return <LoginPageClient />;
}
