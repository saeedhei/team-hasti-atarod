import './globals.css';
import Footer from '@/components/Layout-footer';
import Header from '@/components/Layout-header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
