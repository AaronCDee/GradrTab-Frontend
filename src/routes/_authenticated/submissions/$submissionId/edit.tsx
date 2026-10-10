import { createFileRoute, redirect } from '@tanstack/react-router'

import { SubmissionForm } from '@/components/submission/SubmissionForm'
import { useUpdateSubmission } from '@/hooks/mutations/useUpdateSubmission'
import { documentQueryOptions } from '@/hooks/queries/useDocuments'
import { rubricsQueryOptions } from '@/hooks/queries/useRubrics'
import { submissionQueryOptions } from '@/hooks/queries/useSubmissions'

const EditSubmissionPage = () => {
  const { submission, document } = Route.useLoaderData()
  const updateSubmission = useUpdateSubmission()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SubmissionForm
        defaultValues={{
          studentId: submission.studentId,
          studentName: submission.studentName,
          rubricId: submission.rubricId ?? '',
          documentId: submission.documentId ?? undefined,
        }}
        currentFileName={document?.originalFileName}
        submitLabel="Save changes"
        pending={updateSubmission.isPending}
        error={updateSubmission.error}
        onSubmit={(values) => updateSubmission.mutate({ submission, values })}
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
    const document = submission.documentId
      ? await context.queryClient
          .ensureQueryData(documentQueryOptions(submission.documentId))
          .catch(() => null)
      : null
    return { submission, document }
  },
  component: EditSubmissionPage,
})
