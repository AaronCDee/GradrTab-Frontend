import { createFileRoute, Link } from '@tanstack/react-router'
import { FileUpIcon, PlusIcon } from 'lucide-react'

import { SubmissionsTable } from '@/components/submission/SubmissionsTable'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { documentsQueryOptions, useDocuments } from '@/hooks/queries/useDocuments'
import { rubricsQueryOptions, useRubrics } from '@/hooks/queries/useRubrics'
import { submissionsQueryOptions, useSubmissions } from '@/hooks/queries/useSubmissions'

const SubmissionsPage = () => {
  const { data: submissions = [] } = useSubmissions()
  const { data: rubrics = [] } = useRubrics()
  const { data: documents = [] } = useDocuments()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">Submissions</h1>
        <Button asChild>
          <Link to="/submissions/new">
            <PlusIcon data-icon="inline-start" />
            New submission
          </Link>
        </Button>
      </div>

      {submissions.length === 0 ? (
        <Empty className="flex-1 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileUpIcon />
            </EmptyMedia>
            <EmptyTitle>No submissions yet</EmptyTitle>
            <EmptyDescription>
              Upload a student's submission to grade it against a rubric.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <SubmissionsTable submissions={submissions} rubrics={rubrics} documents={documents} />
      )}
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/submissions/')({
  staticData: { title: 'Submissions' },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(submissionsQueryOptions),
      context.queryClient.ensureQueryData(rubricsQueryOptions),
      context.queryClient.ensureQueryData(documentsQueryOptions),
    ]),
  component: SubmissionsPage,
})
