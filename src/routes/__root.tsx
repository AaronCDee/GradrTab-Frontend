import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'

import { TooltipProvider } from '@/components/ui/tooltip'

const RootLayout = () => (
  <TooltipProvider>
    <Outlet />
    <TanStackRouterDevtools position="top-right" />
    <ReactQueryDevtools initialIsOpen={false} />
  </TooltipProvider>
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
})
