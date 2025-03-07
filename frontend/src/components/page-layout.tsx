import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <SidebarTrigger className="mr-2" />
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4 grow flex flex-col">
        {children}
      </main>
    </SidebarInset>
  );
}
