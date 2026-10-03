import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useFieldArray, useForm, useWatch, type Control } from 'react-hook-form'

import { CriterionCard } from '@/components/rubric/CriterionCard'
import { RubricJsonSheet } from '@/components/rubric/RubricJsonSheet'
import { RubricPreview } from '@/components/rubric/RubricPreview'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createCriterion } from '@/lib/rubric'
import { rubricFormSchema, type Rubric, type RubricFormValues } from '@/lib/schemas/rubric'

function LivePreview({ control }: { control: Control<RubricFormValues> }) {
  const [title, criteria] = useWatch({ control, name: ['title', 'criteria'] })
  return <RubricPreview title={title} criteria={criteria} />
}

export function RubricBuilder() {
  const [savedRubric, setSavedRubric] = useState<Rubric | null>(null)
  const [jsonOpen, setJsonOpen] = useState(false)

  const form = useForm<RubricFormValues>({
    resolver: zodResolver(rubricFormSchema),
    defaultValues: { title: '', criteria: [createCriterion()] },
  })
  const criteria = useFieldArray({ control: form.control, name: 'criteria' })
  const { errors } = form.formState

  const addCriterion = () => criteria.append(createCriterion(form.getValues('criteria').at(-1)))

  const duplicateCriterion = (index: number) =>
    criteria.insert(index + 1, { ...form.getValues(`criteria.${index}`), id: crypto.randomUUID() })

  const onSubmit = (values: RubricFormValues) => {
    setSavedRubric({ id: crypto.randomUUID(), ...values })
    setJsonOpen(true)
  }

  return (
    <FormProvider {...form}>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="rubric-title">Title</FieldLabel>
              <Input
                id="rubric-title"
                placeholder="e.g. Research Essay"
                aria-invalid={Boolean(errors.title)}
                {...form.register('title')}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            {criteria.fields.map((field, index) => (
              <CriterionCard
                key={field.id}
                index={index}
                count={criteria.fields.length}
                onMove={criteria.move}
                onRemove={criteria.remove}
                onDuplicate={duplicateCriterion}
              />
            ))}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={addCriterion}>
                <PlusIcon data-icon="inline-start" />
                Add criterion
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/rubrics">Cancel</Link>
                </Button>
                <Button type="submit">Save rubric</Button>
              </div>
            </div>
          </FieldGroup>
        </form>

        <div className="lg:sticky lg:top-4 lg:max-h-[calc(100svh-2rem)] lg:overflow-auto">
          <LivePreview control={form.control} />
        </div>
      </div>

      <RubricJsonSheet rubric={savedRubric} open={jsonOpen} onOpenChange={setJsonOpen} />
    </FormProvider>
  )
}
