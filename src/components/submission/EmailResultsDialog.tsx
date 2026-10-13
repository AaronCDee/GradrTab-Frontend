import { zodResolver } from '@hookform/resolvers/zod'
import { MailIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useEmailSubmission } from '@/hooks/mutations/useEmailSubmission'
import { gradingEmailFormSchema, type GradingEmailFormValues } from '@/lib/schemas/submission'

type EmailResultsDialogProps = {
  submissionId: string
  open: boolean
  onClose: () => void
}

export function EmailResultsDialog({ submissionId, open, onClose }: EmailResultsDialogProps) {
  const email = useEmailSubmission(submissionId)

  const form = useForm<GradingEmailFormValues>({
    resolver: zodResolver(gradingEmailFormSchema),
    defaultValues: { graderEmail: '' },
  })

  const { errors } = form.formState

  const close = () => {
    email.reset()
    form.reset()
    onClose()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next && !email.isPending) close()
  }

  const send = ({ graderEmail }: GradingEmailFormValues) =>
    email.mutate(graderEmail, { onSuccess: close })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(send)} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Email grading results</DialogTitle>
            <DialogDescription>
              Send this submission&apos;s score and rubric feedback to an email address.
            </DialogDescription>
          </DialogHeader>

          <Field>
            <FieldLabel htmlFor="grader-email">Email</FieldLabel>
            <Input
              id="grader-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.graderEmail)}
              {...form.register('graderEmail')}
            />
            <FieldError errors={[errors.graderEmail]} />
          </Field>

          {email.error ? (
            <p role="alert" className="text-sm text-destructive">
              {email.error.message}
            </p>
          ) : null}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={email.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={email.isPending}>
              {email.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <MailIcon data-icon="inline-start" />
              )}
              {email.isPending ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
