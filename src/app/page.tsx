'use client'
 
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;

  if (user) {
    router.push('/game');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Tic-Tac-Toe</h1>
      <a href="/api/auth/login" className="text-white bg-blue-500 px-4 py-2 rounded">
        Log in to play
      </a>
    </div>
  );
}
