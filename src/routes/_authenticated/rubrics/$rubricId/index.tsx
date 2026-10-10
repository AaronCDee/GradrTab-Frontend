import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { ClipboardListIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

import { DeleteRubricDialog } from '@/components/rubric/DeleteRubricDialog'
import { RubricCriteriaTable } from '@/components/rubric/RubricCriteriaTable'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { rubricQueryOptions } from '@/hooks/queries/useRubrics'
import { rubricTotalPoints } from '@/lib/rubric'

const RubricPage = () => {
  const { rubricId } = Route.useParams()
  const { data: rubric } = useQuery(rubricQueryOptions(rubricId))
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (!rubric) return null

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">{rubric.title}</h1>
          <p className="text-sm text-muted-foreground">
            {rubric.courseId} · {rubric.courseName} · {rubricTotalPoints(rubric.criteria)} points total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/rubrics/$rubricId/edit" params={{ rubricId }}>
              <PencilIcon data-icon="inline-start" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setConfirmingDelete(true)}>
            <Trash2Icon data-icon="inline-start" />
            Delete
          </Button>
        </div>
      </div>

      {rubric.criteria.length > 0 ? (
        <div className="rounded-lg border">
          <RubricCriteriaTable criteria={rubric.criteria} />
        </div>
      ) : (
        <Empty className="flex-1 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardListIcon />
            </EmptyMedia>
            <EmptyTitle>No criteria yet</EmptyTitle>
            <EmptyDescription>
              Edit this rubric to add the criteria it grades against.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <DeleteRubricDialog
        rubric={confirmingDelete ? rubric : null}
        onClose={() => setConfirmingDelete(false)}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/rubrics/$rubricId/')({
  staticData: { title: 'Rubric' },
  loader: async ({ context, params }) => {
    const rubric = await context.queryClient.ensureQueryData(rubricQueryOptions(params.rubricId))
    if (!rubric) throw redirect({ to: '/rubrics' })
  },
  component: RubricPage,
})
