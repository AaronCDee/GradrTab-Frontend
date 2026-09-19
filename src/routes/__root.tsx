import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { useSignOut } from '@/hooks/mutations/useSignOut'
import { useCurrentUser } from '@/hooks/queries/useCurrentUser'

const AuthNav = () => {
  const { data: user, isPending } = useCurrentUser()
  const signOut = useSignOut()

  if (isPending) return null

  if (!user) {
    return (
      <>
        <Link to="/sign-in" className="[&.active]:font-bold">
          Sign in
        </Link>
        <Link to="/sign-up" className="[&.active]:font-bold">
          Sign up
        </Link>
      </>
    )
  }

  return (
    <>
      <Link to="/dashboard" className="[&.active]:font-bold">
        Dashboard
      </Link>
      <span className="text-muted-foreground">{user.name}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut.mutate()}
        disabled={signOut.isPending}
      >
        Sign out
      </Button>
    </>
  )
}

const RootLayout = () => (
  <>
    <div className="flex items-center gap-4 p-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <AuthNav />
      </div>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
    <ReactQueryDevtools initialIsOpen={false} />
  </>
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
})
