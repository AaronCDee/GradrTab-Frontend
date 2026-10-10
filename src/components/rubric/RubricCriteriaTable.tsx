import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { criterionMaxPoints } from '@/lib/rubric'
import type { RubricCriterion } from '@/lib/schemas/rubric'

const formatPoints = (points: number) => (Number.isFinite(points) ? points : '–')

export function RubricCriteriaTable({ criteria }: { criteria: RubricCriterion[] }) {
  const columnCount = Math.max(1, ...criteria.map((criterion) => criterion.levels.length))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Criterion</TableHead>
          <TableHead colSpan={columnCount}>Levels</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {criteria.map((criterion) => (
          <TableRow key={criterion.id}>
            <TableCell className="min-w-32 align-top font-medium whitespace-normal">
              {criterion.name || 'Untitled criterion'}
              <div className="text-xs font-normal text-muted-foreground">
                {criterionMaxPoints(criterion)} pts
              </div>
            </TableCell>
            {criterion.levels.map((level, index) => (
              <TableCell key={index} className="min-w-40 align-top whitespace-normal">
                <div className="flex justify-between gap-2 font-medium">
                  <span>{level.label || '—'}</span>
                  <span className="tabular-nums">{formatPoints(level.points)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{level.description}</p>
              </TableCell>
            ))}
            {Array.from({ length: columnCount - criterion.levels.length }, (_, index) => (
              <TableCell key={`empty-${index}`} />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
