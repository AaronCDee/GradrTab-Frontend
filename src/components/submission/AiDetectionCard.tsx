import { Stat } from '@/components/submission/EvaluationCard'
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
import type { AiDetection, AiDetectionVerdict } from '@/lib/schemas/submission'

type AiDetectionCardProps = {
  detection: AiDetection
}

const verdictLabels: Record<AiDetectionVerdict, string> = {
  'likely-human': 'Likely human',
  mixed: 'Mixed',
  'likely-ai': 'Likely AI',
}

const verdictVariants = {
  'likely-human': 'outline',
  mixed: 'secondary',
  'likely-ai': 'destructive',
} as const satisfies Record<AiDetectionVerdict, string>

export function AiDetectionCard({ detection }: AiDetectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI detection</CardTitle>
        <CardDescription>
          A stylistic estimate of how much of the text reads like AI output. It isn&apos;t proof.
        </CardDescription>
        <CardAction>
          <Badge variant={verdictVariants[detection.verdict]}>
            {verdictLabels[detection.verdict]}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <Stat label="AI" value={`${detection.aiPercentage}%`} />
          <Stat label="Human" value={`${detection.humanPercentage}%`} />
          <Stat label="Confidence" value={`${detection.confidence}%`} />
        </div>

        {detection.summary ? <p className="leading-relaxed">{detection.summary}</p> : null}

        {detection.textTruncated ? (
          <p className="text-muted-foreground">
            The submission was too long and was checked on a shortened version.
          </p>
        ) : null}

        {detection.signals.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signal</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detection.signals.map((signal) => (
                  <TableRow key={signal.signal}>
                    <TableCell className="align-top font-medium">{signal.signal}</TableCell>
                    <TableCell className="text-right align-top tabular-nums">
                      {signal.weight}%
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-muted-foreground">
                      {signal.detail || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Checked by {detection.model} · {new Date(detection.detectedAt).toLocaleString()}
      </CardFooter>
    </Card>
  )
}
