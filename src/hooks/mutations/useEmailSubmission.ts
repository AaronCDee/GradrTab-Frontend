import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { emailSubmission } from '@/lib/services/submissions'

export function useEmailSubmission(id: string) {
  return useMutation({
    mutationFn: (graderEmail: string) => emailSubmission(id, graderEmail),
    onSuccess: ({ toEmail }) => toast.success(`Grading result sent to ${toEmail}.`),
  })
}
