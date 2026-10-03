import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { rubricTotalPoints } from '@/lib/rubric'
import type { Rubric } from '@/lib/schemas/rubric'

export function RubricsTable({ rubrics }: { rubrics: Rubric[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Course</TableHead>
            <TableHead className="text-right">Criteria</TableHead>
            <TableHead className="text-right">Total points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rubrics.map((rubric) => (
            <TableRow key={rubric.id}>
              <TableCell className="font-medium">{rubric.title}</TableCell>
              <TableCell>
                {rubric.courseId}
                <div className="text-xs text-muted-foreground">{rubric.courseName}</div>
              </TableCell>
              <TableCell className="text-right tabular-nums">{rubric.criteria.length}</TableCell>
              <TableCell className="text-right tabular-nums">
                {rubricTotalPoints(rubric.criteria)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
