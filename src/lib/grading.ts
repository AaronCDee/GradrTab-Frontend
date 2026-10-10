import type { GradingStatus } from '@/lib/schemas/submission'

export const gradingStatusLabels: Record<GradingStatus, string> = {
  NotStarted: 'Not graded',
  InProgress: 'Grading',
  Complete: 'Graded',
  Failure: 'Failed',
}

export const gradingStatusVariants = {
  NotStarted: 'outline',
  InProgress: 'secondary',
  Complete: 'default',
  Failure: 'destructive',
} as const satisfies Record<GradingStatus, string>
