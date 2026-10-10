import { GraduationCapIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AuthCardProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCapIcon className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-heading text-2xl font-semibold tracking-tight">GradrTab</p>
          <p className="text-sm text-muted-foreground">
            Grade student submissions against your rubrics.
          </p>
        </div>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </CardContent>
      </Card>
    </div>
  )
}
