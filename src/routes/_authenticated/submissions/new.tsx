import { createFileRoute } from '@tanstack/react-router'

import { SubmissionForm } from '@/components/submission/SubmissionForm'
import { useCreateSubmission } from '@/hooks/mutations/useCreateSubmission'
import { rubricsQueryOptions } from '@/hooks/queries/useRubrics'

const NewSubmissionPage = () => {
  const createSubmission = useCreateSubmission()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SubmissionForm
        submitLabel="Upload submission"
        pending={createSubmission.isPending}
        error={createSubmission.error}
        onSubmit={(values) => createSubmission.mutate(values)}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/submissions/new')({
  staticData: { title: 'New submission' },
  loader: ({ context }) => context.queryClient.ensureQueryData(rubricsQueryOptions),
  component: NewSubmissionPage,
})
