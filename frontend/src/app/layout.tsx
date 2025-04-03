import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Knowledge Navigator',
  description:
    'An Interactive Learning Augmentation Tool that enhances the learning experience by integrating multiple text-based resources, dynamically highlighting keywords, and providing contextual information retrieval. Ideal for students and professionals seeking to streamline their study process and improve knowledge retention.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="flex h-screen min-w-screen bg-background text-foreground w-full">
              <AppSidebar />
              {children}
            </div>
          </SidebarProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
