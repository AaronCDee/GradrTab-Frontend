import { Link } from '@tanstack/react-router'
import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

import { DeleteRubricDialog } from '@/components/rubric/DeleteRubricDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const [pendingDelete, setPendingDelete] = useState<Rubric | null>(null)

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Criteria</TableHead>
              <TableHead className="text-right">Total points</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rubrics.map((rubric) => (
              <TableRow key={rubric.id}>
                <TableCell className="font-medium">
                  <Link
                    to="/rubrics/$rubricId"
                    params={{ rubricId: rubric.id }}
                    className="underline-offset-4 hover:underline"
                  >
                    {rubric.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {rubric.courseId}
                  <div className="text-xs text-muted-foreground">{rubric.courseName}</div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{rubric.criteria.length}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {rubricTotalPoints(rubric.criteria)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Rubric actions">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/rubrics/$rubricId" params={{ rubricId: rubric.id }}>
                          <EyeIcon />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/rubrics/$rubricId/edit" params={{ rubricId: rubric.id }}>
                          <PencilIcon />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setPendingDelete(rubric)}
                      >
                        <Trash2Icon />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteRubricDialog rubric={pendingDelete} onClose={() => setPendingDelete(null)} />
    </>
  )
}
