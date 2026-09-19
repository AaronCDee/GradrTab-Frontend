import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { currentUserQueryOptions } from '@/hooks/queries/useCurrentUser'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(currentUserQueryOptions)
    if (!user) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }
  },
  component: Outlet,
})
