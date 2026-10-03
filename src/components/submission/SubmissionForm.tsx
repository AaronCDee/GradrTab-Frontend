import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'

import { RubricCombobox } from '@/components/rubric/RubricCombobox'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { submissionFormSchema, type SubmissionFormValues } from '@/lib/schemas/submission'

type SubmissionFormProps = {
  defaultValues?: SubmissionFormValues
  submitLabel: string
  pending: boolean
  error: Error | null
  onSubmit: (values: SubmissionFormValues) => void
}

export function SubmissionForm({
  defaultValues,
  submitLabel,
  pending,
  error,
  onSubmit,
}: SubmissionFormProps) {
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: defaultValues ?? { studentId: '', studentName: '', rubricId: '' },
  })
  const { errors } = form.formState

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="submission-student-id">Student ID</FieldLabel>
          <Input
            id="submission-student-id"
            placeholder="e.g. 123456789"
            aria-invalid={Boolean(errors.studentId)}
            {...form.register('studentId')}
          />
          <FieldError errors={[errors.studentId]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="submission-student-name">Student name</FieldLabel>
          <Input
            id="submission-student-name"
            placeholder="e.g. Jane Doe"
            aria-invalid={Boolean(errors.studentName)}
            {...form.register('studentName')}
          />
          <FieldError errors={[errors.studentName]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="submission-rubric">Rubric</FieldLabel>
          <Controller
            control={form.control}
            name="rubricId"
            render={({ field, fieldState }) => (
              <RubricCombobox
                id="submission-rubric"
                value={field.value}
                onChange={field.onChange}
                invalid={fieldState.invalid}
              />
            )}
          />
          <FieldError errors={[errors.rubricId]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="submission-file">Submission file</FieldLabel>
          <Controller
            control={form.control}
            name="file"
            render={({ field, fieldState }) => (
              <Input
                id="submission-file"
                type="file"
                accept=".pdf,.csv,application/pdf,text/csv"
                aria-invalid={fieldState.invalid}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.files?.[0] ?? defaultValues?.file)}
              />
            )}
          />
          <FieldDescription>
            {defaultValues
              ? `Current file: ${defaultValues.file.name}. Choose a new file to replace it.`
              : 'PDF or CSV'}
          </FieldDescription>
          <FieldError errors={[errors.file]} />
        </Field>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error.message}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link to="/submissions">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
