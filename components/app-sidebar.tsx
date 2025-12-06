'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Calendar, Clipboard, Clock, ListTodoIcon, MonitorCog } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from 'next/image';
import { fromTheme } from 'tailwind-merge';
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu';

const items = [
  {
    title: 'Projects',
    url: '/projects',
    icon: MonitorCog,
  },
  {
    title: 'My Task',
    url: '/',
    icon: Clipboard,
  },
  {
    title: 'Calendar',
    url: '/',
    icon: Calendar,
  },
  {
    title: 'Timesheet',
    url: '/',
    icon: Clock,
  },
  {
    title: 'My Board',
    url: '/Board-page-sidebar',
    icon: ListTodoIcon,
  },
];
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar({ className, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className={className} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/window.svg" alt="logo" width={25} height={25} />
                <span className="text-lg font-semibold">Kanban Board</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton></SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
