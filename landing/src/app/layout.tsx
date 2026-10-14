import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'President Tailor - Penjahit Jas, Hem Batik, & Celana Panjang di Sukoharjo',
  description:
    'President Tailor Sukoharjo melayani pembuatan pakaian pria berkualitas tinggi: jas formal, hem batik berpola rapi, dan celana panjang presisi.',
  keywords: [
    'President Tailor',
    'Penjahit Sukoharjo',
    'Jahit Jas Sukoharjo',
    'Hem Batik Sukoharjo',
    'Celana Panjang Pria',
    'Tailor Solo Sukoharjo',
  ],
  openGraph: {
    title: 'President Tailor - Penjahit Jas, Hem Batik, & Celana Panjang',
    description:
      'Penjahit berpengalaman di Sukoharjo, Jawa Tengah. Mengutamakan kenyamanan potongan, kerapian jahitan, dan ukuran personal.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
