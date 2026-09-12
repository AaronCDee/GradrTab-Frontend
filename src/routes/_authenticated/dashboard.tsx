import { createFileRoute } from '@tanstack/react-router'

import { useCurrentUser } from '@/hooks/queries/useCurrentUser'

const DashboardPage = () => {
  const { data: user } = useCurrentUser()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">Signed in as {user?.email}</p>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})
