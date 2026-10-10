import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { ClipboardCheckIcon, DownloadIcon, MailIcon, PencilIcon, SparklesIcon } from 'lucide-react'
import { useEffect } from 'react'

import { EvaluationCard } from '@/components/submission/EvaluationCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { useEmailSubmission } from '@/hooks/mutations/useEmailSubmission'
import { useGradeSubmission } from '@/hooks/mutations/useGradeSubmission'
import { documentQueryOptions } from '@/hooks/queries/useDocuments'
import { rubricsQueryOptions, useRubrics } from '@/hooks/queries/useRubrics'
import { submissionQueryOptions } from '@/hooks/queries/useSubmissions'
import { gradingStatusLabels, gradingStatusVariants } from '@/lib/grading'
import { downloadDocument } from '@/lib/services/documents'

const SubmissionPage = () => {
  const { submissionId } = Route.useParams()
  const { document } = Route.useLoaderData()
  const { data: submission } = useQuery(submissionQueryOptions(submissionId))
  const { data: rubrics = [] } = useRubrics()
  const grade = useGradeSubmission(submissionId)
  const email = useEmailSubmission(submissionId)
  const failureReason = submission?.gradingStatus === 'Failure' ? submission.failureReason : null

  useEffect(() => {
    if (failureReason) console.error(`Grading submission ${submissionId} failed`, failureReason)
  }, [submissionId, failureReason])

  if (!submission) return null

  const rubric = rubrics.find((candidate) => candidate.id === submission.rubricId)
  const grading = grade.isPending || submission.gradingStatus === 'InProgress'
  const gradable = Boolean(submission.rubricId && submission.documentId)
  const graded = submission.gradingStatus === 'Complete' && Boolean(submission.evaluation)
  const failure = grade.error
    ? grade.error.message
    : submission.gradingStatus === 'Failure'
      ? "The last grading attempt didn't finish. Try grading again."
      : null
  const { evaluation } = submission
  const outdated = Boolean(
    evaluation &&
      (evaluation.rubricId !== submission.rubricId ||
        evaluation.documentId !== submission.documentId),
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{submission.studentName}</h1>
            <Badge variant={gradingStatusVariants[submission.gradingStatus]}>
              {gradingStatusLabels[submission.gradingStatus]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="tabular-nums">{submission.studentId}</span>
            {' · '}
            {rubric ? `${rubric.title} (${rubric.courseId})` : 'No rubric'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {document ? (
            <Button variant="outline" onClick={() => downloadDocument(document)}>
              <DownloadIcon data-icon="inline-start" />
              {document.originalFileName}
            </Button>
          ) : null}
          <Button variant="outline" asChild>
            <Link to="/submissions/$submissionId/edit" params={{ submissionId }}>
              <PencilIcon data-icon="inline-start" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => email.mutate()}
            disabled={!graded || grading || email.isPending}
          >
            {email.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <MailIcon data-icon="inline-start" />
            )}
            {email.isPending ? 'Sending...' : 'Email student'}
          </Button>
          <Button onClick={() => grade.mutate()} disabled={grading || !gradable}>
            {grading ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <SparklesIcon data-icon="inline-start" />
            )}
            {grading ? 'Grading...' : evaluation ? 'Re-grade' : 'Grade'}
          </Button>
        </div>
      </div>

      {!gradable ? (
        <p className="text-sm text-muted-foreground">
          Add a rubric and a file to this submission before grading it.
        </p>
      ) : null}

      {failure && !grading ? (
        <p role="alert" className="text-sm text-destructive">
          {failure}
        </p>
      ) : null}

      {evaluation ? (
        <EvaluationCard evaluation={evaluation} outdated={outdated} />
      ) : (
        <Empty className="flex-1 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {grading ? <Spinner /> : <ClipboardCheckIcon />}
            </EmptyMedia>
            <EmptyTitle>{grading ? 'Grading in progress' : 'Not graded yet'}</EmptyTitle>
            <EmptyDescription>
              {grading
                ? 'The submission is being graded against its rubric. This can take a little while.'
                : 'Grade this submission to see its score and feedback against the rubric.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/submissions/$submissionId/')({
  staticData: { title: 'Submission' },
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
    return { document }
  },
  component: SubmissionPage,
})
