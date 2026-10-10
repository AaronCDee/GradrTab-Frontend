import { Link } from '@tanstack/react-router'
import { DownloadIcon, EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

import { DeleteSubmissionDialog } from '@/components/submission/DeleteSubmissionDialog'
import { Badge } from '@/components/ui/badge'
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
import { gradingStatusLabels, gradingStatusVariants } from '@/lib/grading'
import type { Document } from '@/lib/schemas/document'
import type { Rubric } from '@/lib/schemas/rubric'
import type { SubmissionSummary } from '@/lib/schemas/submission'
import { downloadDocument } from '@/lib/services/documents'
import { formatFileSize } from '@/lib/submission'

type SubmissionsTableProps = {
  submissions: SubmissionSummary[]
  rubrics: Rubric[]
  documents: Document[]
}

export function SubmissionsTable({ submissions, rubrics, documents }: SubmissionsTableProps) {
  const [pendingDelete, setPendingDelete] = useState<SubmissionSummary | null>(null)
  const rubricTitles = new Map(rubrics.map((rubric) => [rubric.id, rubric.title]))
  const documentsById = new Map(documents.map((document) => [document.id, document]))

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
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => {
              const document = submission.documentId
                ? documentsById.get(submission.documentId)
                : undefined

              return (
                <TableRow key={submission.id}>
                  <TableCell className="tabular-nums">{submission.studentId}</TableCell>
                  <TableCell className="font-medium">
                    <Link
                      to="/submissions/$submissionId"
                      params={{ submissionId: submission.id }}
                      className="underline-offset-4 hover:underline"
                    >
                      {submission.studentName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {submission.rubricId
                      ? (rubricTitles.get(submission.rubricId) ?? 'Unknown rubric')
                      : 'No rubric'}
                  </TableCell>
                  <TableCell>
                    {document ? (
                      <>
                        {document.originalFileName}
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(document.fileSizeBytes)}
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No file</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={gradingStatusVariants[submission.gradingStatus]}>
                      {gradingStatusLabels[submission.gradingStatus]}
                    </Badge>
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
                            to="/submissions/$submissionId"
                            params={{ submissionId: submission.id }}
                          >
                            <EyeIcon />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/submissions/$submissionId/edit"
                            params={{ submissionId: submission.id }}
                          >
                            <PencilIcon />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={!document}
                          onSelect={() => document && downloadDocument(document)}
                        >
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
              )
            })}
          </TableBody>
        </Table>
      </div>

      <DeleteSubmissionDialog submission={pendingDelete} onClose={() => setPendingDelete(null)} />
    </>
  )
}
