import { CopyIcon, DownloadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Rubric } from '@/lib/schemas/rubric'

type RubricJsonSheetProps = {
  rubric: Rubric | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RubricJsonSheet({ rubric, open, onOpenChange }: RubricJsonSheetProps) {
  const json = rubric ? JSON.stringify(rubric, null, 2) : ''

  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${rubric?.title || 'rubric'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Rubric JSON</SheetTitle>
          <SheetDescription>
            Saving to the server isn't wired up yet. Copy or download the JSON for now.
          </SheetDescription>
        </SheetHeader>
        <pre className="mx-4 flex-1 overflow-auto rounded-lg bg-muted p-4 text-xs">{json}</pre>
        <SheetFooter>
          <Button type="button" variant="outline" onClick={() => navigator.clipboard.writeText(json)}>
            <CopyIcon data-icon="inline-start" />
            Copy
          </Button>
          <Button type="button" onClick={download}>
            <DownloadIcon data-icon="inline-start" />
            Download
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
