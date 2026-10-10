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
import { useDeleteRubric } from '@/hooks/mutations/useDeleteRubric'
import type { Rubric } from '@/lib/schemas/rubric'

type DeleteRubricDialogProps = {
  rubric: Rubric | null
  onClose: () => void
}

export function DeleteRubricDialog({ rubric, onClose }: DeleteRubricDialogProps) {
  const deleteRubric = useDeleteRubric()

  const close = () => {
    deleteRubric.reset()
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !deleteRubric.isPending) close()
  }

  const confirm = (event: MouseEvent) => {
    event.preventDefault()
    if (!rubric) return
    deleteRubric.mutate(rubric.id, { onSuccess: close })
  }

  return (
    <AlertDialog open={rubric !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {rubric?.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            Submissions using this rubric keep their grades but will need a new rubric before
            they can be graded again. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteRubric.error ? (
          <p role="alert" className="text-sm text-destructive">
            {deleteRubric.error.message}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteRubric.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteRubric.isPending}
            onClick={confirm}
          >
            {deleteRubric.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
