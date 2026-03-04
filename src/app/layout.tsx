import { Cormorant_Garamond, Inter } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Numa',
  description: 'Articoli come Lucy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-gray-200 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Numa. Tutti i diritti riservati.
          </div>
        </footer>
      </body>
    </html>
  );
}