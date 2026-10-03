import { ChevronsUpDownIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRubrics } from '@/hooks/queries/useRubrics'

type RubricComboboxProps = {
  id: string
  value: string
  onChange: (rubricId: string) => void
  invalid: boolean
}

export function RubricCombobox({ id, value, onChange, invalid }: RubricComboboxProps) {
  const [open, setOpen] = useState(false)
  const { data: rubrics = [], isPending } = useRubrics()
  const selected = rubrics.find((rubric) => rubric.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className="w-full justify-between font-normal"
        >
          {selected ? (
            <span className="truncate">{selected.title}</span>
          ) : (
            <span className="text-muted-foreground">Select a rubric</span>
          )}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Search rubrics..." />
          <CommandList>
            <CommandEmpty>{isPending ? 'Loading rubrics...' : 'No rubrics found.'}</CommandEmpty>
            <CommandGroup>
              {rubrics.map((rubric) => (
                <CommandItem
                  key={rubric.id}
                  value={`${rubric.title} ${rubric.courseId} ${rubric.courseName} ${rubric.id}`}
                  data-checked={rubric.id === value}
                  onSelect={() => {
                    onChange(rubric.id)
                    setOpen(false)
                  }}
                >
                  <span className="truncate">{rubric.title}</span>
                  <span className="text-xs text-muted-foreground">{rubric.courseId}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
