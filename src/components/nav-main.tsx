import type { ReactNode } from 'react'
import { Link, useMatchRoute, type LinkProps } from '@tanstack/react-router'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export type NavItem = {
  title: string
  to: LinkProps['to']
  icon: ReactNode
}

export function NavMain({ items }: { items: NavItem[] }) {
  const matchRoute = useMatchRoute()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={Boolean(matchRoute({ to: item.to, fuzzy: true }))}
            >
              <Link to={item.to}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
