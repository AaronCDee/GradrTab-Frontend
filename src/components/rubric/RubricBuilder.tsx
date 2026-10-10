import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { FormProvider, useFieldArray, useForm, useWatch, type Control } from 'react-hook-form'

import { CriterionCard } from '@/components/rubric/CriterionCard'
import { RubricPreview } from '@/components/rubric/RubricPreview'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createCriterion } from '@/lib/rubric'
import { rubricFormSchema, type RubricFormValues } from '@/lib/schemas/rubric'

function LivePreview({ control }: { control: Control<RubricFormValues> }) {
  const [title, courseName, courseId, criteria] = useWatch({
    control,
    name: ['title', 'courseName', 'courseId', 'criteria'],
  })
  return (
    <RubricPreview title={title} courseName={courseName} courseId={courseId} criteria={criteria} />
  )
}

type RubricBuilderProps = {
  defaultValues?: RubricFormValues
  submitLabel: string
  pending: boolean
  error: Error | null
  onSubmit: (values: RubricFormValues) => void
}

export function RubricBuilder({
  defaultValues,
  submitLabel,
  pending,
  error,
  onSubmit,
}: RubricBuilderProps) {
  const form = useForm<RubricFormValues>({
    resolver: zodResolver(rubricFormSchema),
    defaultValues: defaultValues ?? {
      title: '',
      courseName: '',
      courseId: '',
      criteria: [createCriterion()],
    },
  })
  const criteria = useFieldArray({ control: form.control, name: 'criteria' })
  const { errors } = form.formState

  const addCriterion = () => criteria.append(createCriterion(form.getValues('criteria').at(-1)))

  const duplicateCriterion = (index: number) =>
    criteria.insert(index + 1, { ...form.getValues(`criteria.${index}`), id: crypto.randomUUID() })

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

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="rubric-course-name">Course name</FieldLabel>
                <Input
                  id="rubric-course-name"
                  placeholder="e.g. Writing and Rhetoric"
                  aria-invalid={Boolean(errors.courseName)}
                  {...form.register('courseName')}
                />
                <FieldError errors={[errors.courseName]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="rubric-course-id">Course ID</FieldLabel>
                <Input
                  id="rubric-course-id"
                  placeholder="e.g. WRTG 150"
                  aria-invalid={Boolean(errors.courseId)}
                  {...form.register('courseId')}
                />
                <FieldError errors={[errors.courseId]} />
              </Field>
            </div>

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

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error.message}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={addCriterion}>
                <PlusIcon data-icon="inline-start" />
                Add criterion
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/rubrics">Cancel</Link>
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? 'Saving...' : submitLabel}
                </Button>
              </div>
            </div>
          </FieldGroup>
        </form>

        <div className="lg:sticky lg:top-4 lg:max-h-[calc(100svh-2rem)] lg:overflow-auto">
          <LivePreview control={form.control} />
        </div>
      </div>
    </FormProvider>
  )
}
