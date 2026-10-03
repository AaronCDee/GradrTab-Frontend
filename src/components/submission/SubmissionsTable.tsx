import { Link } from '@tanstack/react-router'
import { DownloadIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

import { DeleteSubmissionDialog } from '@/components/submission/DeleteSubmissionDialog'
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
import type { Rubric } from '@/lib/schemas/rubric'
import type { Submission } from '@/lib/schemas/submission'
import { downloadFile, formatFileSize } from '@/lib/submission'

type SubmissionsTableProps = {
  submissions: Submission[]
  rubrics: Rubric[]
}

export function SubmissionsTable({ submissions, rubrics }: SubmissionsTableProps) {
  const [pendingDelete, setPendingDelete] = useState<Submission | null>(null)
  const rubricTitles = new Map(rubrics.map((rubric) => [rubric.id, rubric.title]))

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Student name</TableHead>
              <TableHead>Rubric</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="tabular-nums">{submission.studentId}</TableCell>
                <TableCell className="font-medium">{submission.studentName}</TableCell>
                <TableCell>{rubricTitles.get(submission.rubricId) ?? 'Unknown rubric'}</TableCell>
                <TableCell>
                  {submission.file.name}
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(submission.file.size)}
                  </div>
                </TableCell>
                <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Submission actions">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/submissions/$submissionId/edit"
                          params={{ submissionId: submission.id }}
                        >
                          <PencilIcon />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => downloadFile(submission.file)}>
                        <DownloadIcon />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setPendingDelete(submission)}
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

      <DeleteSubmissionDialog submission={pendingDelete} onClose={() => setPendingDelete(null)} />
    </>
  )
}
