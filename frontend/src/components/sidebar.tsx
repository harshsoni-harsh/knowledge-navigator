'use client';

import { Home, Upload, Book, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Upload, label: 'Upload Files', href: '/upload' },
  { icon: Book, label: 'My Files', href: '/files' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r shrink-0 z-10 bg-inherit">
      <SidebarHeader className="flex items-center justify-between px-4 py-2 mt-2">
        <h2 className="text-lg font-semibold">Knowledge Navigator</h2>
        {/* <SidebarTrigger className="hidden" /> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent',
                        pathname === item.href && 'bg-accent'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
