import { CopyIcon, PlusIcon } from 'lucide-react'
import { useId } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { ItemActions } from '@/components/rubric/ItemActions'
import { LevelRow } from '@/components/rubric/LevelRow'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createLevel } from '@/lib/rubric'
import type { RubricFormValues } from '@/lib/schemas/rubric'

type CriterionCardProps = {
  index: number
  count: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
  onDuplicate: (index: number) => void
}

export function CriterionCard({ index, count, onMove, onRemove, onDuplicate }: CriterionCardProps) {
  const id = useId()
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RubricFormValues>()
  const levels = useFieldArray({ control, name: `criteria.${index}.levels` })
  const criterionErrors = errors.criteria?.[index]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criterion {index + 1}</CardTitle>
        <CardAction className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Duplicate criterion ${index + 1}`}
            onClick={() => onDuplicate(index)}
          >
            <CopyIcon />
          </Button>
          <ItemActions
            label={`criterion ${index + 1}`}
            index={index}
            count={count}
            onMove={onMove}
            onRemove={onRemove}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
          <Input
            id={`${id}-name`}
            placeholder="e.g. Thesis & Argument"
            aria-invalid={Boolean(criterionErrors?.name)}
            {...register(`criteria.${index}.name`)}
          />
          <FieldError errors={[criterionErrors?.name]} />
        </Field>

        {levels.fields.map((field, levelIndex) => (
          <LevelRow
            key={field.id}
            criterionIndex={index}
            levelIndex={levelIndex}
            count={levels.fields.length}
            onMove={levels.move}
            onRemove={levels.remove}
          />
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => levels.append(createLevel())}
        >
          <PlusIcon data-icon="inline-start" />
          Add level
        </Button>
      </CardContent>
    </Card>
  )
}
