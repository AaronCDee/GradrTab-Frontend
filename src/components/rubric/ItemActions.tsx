import { ChevronDownIcon, ChevronUpIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ItemActionsProps = {
  label: string
  index: number
  count: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
}

export function ItemActions({ label, index, count, onMove, onRemove }: ItemActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <ChevronUpIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Move ${label} down`}
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <ChevronDownIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Remove ${label}`}
        disabled={count === 1}
        onClick={() => onRemove(index)}
      >
        <Trash2Icon />
      </Button>
    </div>
  )
}
