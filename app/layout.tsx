import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Footer from '@/components/Layout-footer';
import Header from '@/components/Layout-header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full">
            <Header />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </SidebarProvider>
        <Footer />
      </body>
    </html>
  );
}
