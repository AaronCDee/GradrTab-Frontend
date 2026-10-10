import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { emailSubmission } from '@/lib/services/submissions'

export function useEmailSubmission(id: string) {
  return useMutation({
    mutationFn: () => emailSubmission(id),
    onSuccess: () => toast.success('Email sent to the student.'),
    onError: (error) => toast.error(error.message),
  })
}
