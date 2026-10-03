import { Link } from '@tanstack/react-router'
import { ClipboardListIcon, FileTextIcon, GraduationCapIcon } from 'lucide-react'

import { NavMain, type NavItem } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import type { User } from '@/lib/schemas/auth'

const navItems: NavItem[] = [
  { title: 'Submissions', to: '/submissions', icon: <FileTextIcon /> },
  { title: 'Rubrics', to: '/rubrics', icon: <ClipboardListIcon /> },
]

export function AppSidebar({ user }: { user: User }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/submissions">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCapIcon className="size-4" />
                </div>
                <span className="truncate font-semibold">GradrTab</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
