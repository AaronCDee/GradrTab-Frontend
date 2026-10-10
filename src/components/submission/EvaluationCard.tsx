import { TriangleAlertIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Evaluation } from '@/lib/schemas/submission'

type EvaluationCardProps = {
  evaluation: Evaluation
  outdated: boolean
}

const formatScore = (score: number | null, maxScore: number | null) =>
  `${score ?? '—'} / ${maxScore ?? '—'}`

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  )
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-medium">{title}</h3>
      {items.length === 0 ? (
        <p className="text-muted-foreground">None noted.</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function EvaluationCard({ evaluation, outdated }: EvaluationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation</CardTitle>
        <CardDescription>
          {evaluation.courseName} ({evaluation.courseId})
        </CardDescription>
        {outdated ? (
          <CardAction>
            <Badge variant="outline">
              <TriangleAlertIcon data-icon="inline-start" />
              Out of date
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {outdated ? (
          <p className="text-muted-foreground">
            The rubric or file changed after this grade was given. Re-grade to update it.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <Stat label="Score" value={formatScore(evaluation.overallScore, evaluation.maxScore)} />
          <Stat
            label="Percentage"
            value={evaluation.percentage === null ? '—' : `${evaluation.percentage}%`}
          />
          <Stat label="Grade" value={evaluation.grade ?? '—'} />
        </div>

        {evaluation.summary ? <p className="leading-relaxed">{evaluation.summary}</p> : null}

        {evaluation.assessmentTruncated ? (
          <p className="text-muted-foreground">
            The submission was too long and was graded on a shortened version.
          </p>
        ) : null}

        {evaluation.criteria.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criterion</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluation.criteria.map((criterion) => (
                  <TableRow key={criterion.name}>
                    <TableCell className="align-top font-medium">{criterion.name}</TableCell>
                    <TableCell className="text-right align-top tabular-nums">
                      {formatScore(criterion.score, criterion.maxScore)}
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-muted-foreground">
                      {criterion.comments ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <FeedbackList title="Strengths" items={evaluation.strengths} />
          <FeedbackList title="Improvements" items={evaluation.improvements} />
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Graded by {evaluation.model} · {new Date(evaluation.evaluatedAt).toLocaleString()}
      </CardFooter>
    </Card>
  )
}
