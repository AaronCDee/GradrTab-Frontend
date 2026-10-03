import type { MouseEvent } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteSubmission } from '@/hooks/mutations/useDeleteSubmission'
import type { Submission } from '@/lib/schemas/submission'

type DeleteSubmissionDialogProps = {
  submission: Submission | null
  onClose: () => void
}

export function DeleteSubmissionDialog({ submission, onClose }: DeleteSubmissionDialogProps) {
  const deleteSubmission = useDeleteSubmission()

  const close = () => {
    deleteSubmission.reset()
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !deleteSubmission.isPending) close()
  }

  const confirm = (event: MouseEvent) => {
    event.preventDefault()
    if (!submission) return
    deleteSubmission.mutate(submission.id, { onSuccess: close })
  }

  return (
    <AlertDialog open={submission !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete submission for {submission?.studentName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes {submission?.file.name} permanently. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteSubmission.error ? (
          <p role="alert" className="text-sm text-destructive">
            {deleteSubmission.error.message}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSubmission.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteSubmission.isPending}
            onClick={confirm}
          >
            {deleteSubmission.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
