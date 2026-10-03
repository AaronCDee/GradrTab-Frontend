import { useId } from 'react'
import { useFormContext } from 'react-hook-form'

import { ItemActions } from '@/components/rubric/ItemActions'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { RubricFormValues } from '@/lib/schemas/rubric'

type LevelRowProps = {
  criterionIndex: number
  levelIndex: number
  count: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
}

export function LevelRow({ criterionIndex, levelIndex, count, onMove, onRemove }: LevelRowProps) {
  const id = useId()
  const {
    register,
    formState: { errors },
  } = useFormContext<RubricFormValues>()
  const levelErrors = errors.criteria?.[criterionIndex]?.levels?.[levelIndex]
  const path = `criteria.${criterionIndex}.levels.${levelIndex}` as const

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Level {levelIndex + 1}</span>
        <ItemActions
          label={`level ${levelIndex + 1}`}
          index={levelIndex}
          count={count}
          onMove={onMove}
          onRemove={onRemove}
        />
      </div>

      <div className="flex items-start gap-3">
        <Field className="flex-1">
          <FieldLabel htmlFor={`${id}-label`}>Label</FieldLabel>
          <Input
            id={`${id}-label`}
            placeholder="e.g. Strong"
            aria-invalid={Boolean(levelErrors?.label)}
            {...register(`${path}.label`)}
          />
          <FieldError errors={[levelErrors?.label]} />
        </Field>

        <Field className="w-24 shrink-0">
          <FieldLabel htmlFor={`${id}-points`}>Points</FieldLabel>
          <Input
            id={`${id}-points`}
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            aria-invalid={Boolean(levelErrors?.points)}
            {...register(`${path}.points`, { valueAsNumber: true })}
          />
          <FieldError errors={[levelErrors?.points]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor={`${id}-description`}>Description</FieldLabel>
        <Textarea
          id={`${id}-description`}
          rows={2}
          placeholder="What does work at this level look like?"
          {...register(`${path}.description`)}
        />
      </Field>
    </div>
  )
}
