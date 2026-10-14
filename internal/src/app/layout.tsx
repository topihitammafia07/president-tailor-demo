import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { User } from '@/types';

export const metadata: Metadata = {
  title: 'President Tailor - Dashboard Internal',
  description: 'Dashboard operasional buku pesanan, pelanggan, dan progres produksi President Tailor Sukoharjo',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get('pt_role')?.value as 'owner' | 'staff' | undefined;
  const name = cookieStore.get('pt_name')?.value ? decodeURIComponent(cookieStore.get('pt_name')!.value) : undefined;
  const email = cookieStore.get('pt_email')?.value ? decodeURIComponent(cookieStore.get('pt_email')!.value) : undefined;

  const initialUser: User | null = role
    ? {
        id: 0,
        name: name || (role === 'owner' ? 'Owner President Tailor' : 'Staf Workshop'),
        email: email || (role === 'owner' ? 'owner@presidenttailor.com' : 'staff@presidenttailor.com'),
        role,
      }
    : null;

  return (
    <html lang="id">
      <body>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}
