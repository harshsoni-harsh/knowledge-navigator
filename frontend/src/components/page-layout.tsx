import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  secondaryElement?: React.ReactNode;
}

export function PageLayout({ children, title, secondaryElement }: PageLayoutProps) {
  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <SidebarTrigger className="mr-2" />
          <h1 className="text-2xl font-bold truncate">{title}</h1>
          {secondaryElement}
        </div>
      </header>
      <main className="w-full mx-auto grow flex flex-col">
        {children}
      </main>
    </SidebarInset>
  );
}
