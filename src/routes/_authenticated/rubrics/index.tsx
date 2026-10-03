import { createFileRoute, Link } from '@tanstack/react-router'
import { ClipboardListIcon, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const RubricsPage = () => (
  <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-lg font-semibold">Rubrics</h1>
      <Button asChild>
        <Link to="/rubrics/new">
          <PlusIcon data-icon="inline-start" />
          New rubric
        </Link>
      </Button>
    </div>

    <Empty className="flex-1 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClipboardListIcon />
        </EmptyMedia>
        <EmptyTitle>No rubrics yet</EmptyTitle>
        <EmptyDescription>Create a rubric to start grading against it.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
)

export const Route = createFileRoute('/_authenticated/rubrics/')({
  staticData: { title: 'Rubrics' },
  component: RubricsPage,
})
