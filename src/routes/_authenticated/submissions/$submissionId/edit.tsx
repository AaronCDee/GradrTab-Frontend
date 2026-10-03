import { createFileRoute, redirect } from '@tanstack/react-router'

import { SubmissionForm } from '@/components/submission/SubmissionForm'
import { useUpdateSubmission } from '@/hooks/mutations/useUpdateSubmission'
import { rubricsQueryOptions } from '@/hooks/queries/useRubrics'
import { submissionQueryOptions } from '@/hooks/queries/useSubmissions'

const EditSubmissionPage = () => {
  const submission = Route.useLoaderData()
  const updateSubmission = useUpdateSubmission()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SubmissionForm
        defaultValues={{
          studentId: submission.studentId,
          studentName: submission.studentName,
          rubricId: submission.rubricId,
          file: submission.file,
        }}
        submitLabel="Save changes"
        pending={updateSubmission.isPending}
        error={updateSubmission.error}
        onSubmit={(values) => updateSubmission.mutate({ id: submission.id, values })}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/submissions/$submissionId/edit')({
  staticData: { title: 'Edit submission' },
  loader: async ({ context, params }) => {
    const [submission] = await Promise.all([
      context.queryClient.ensureQueryData(submissionQueryOptions(params.submissionId)),
      context.queryClient.ensureQueryData(rubricsQueryOptions),
    ])
    if (!submission) throw redirect({ to: '/submissions' })
    return submission
  },
  component: EditSubmissionPage,
})
