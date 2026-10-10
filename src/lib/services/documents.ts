import { toast } from 'sonner'
import { z } from 'zod'

import { apiFetch, withErrorMessages } from '@/lib/api'
import { getToken } from '@/lib/auth-token'
import { documentSchema, documentUploadSchema, type Document } from '@/lib/schemas/document'
import { pagedSchema } from '@/lib/schemas/paged'
import { downloadFile } from '@/lib/submission'

export const listDocuments = async () =>
  (await apiFetch('/documents?pageSize=200', pagedSchema(documentSchema))).items

export const getDocument = (id: string) => apiFetch(`/documents/${id}`, documentSchema)

export const deleteDocument = (id: string) =>
  apiFetch(`/documents/${id}`, z.null(), { method: 'DELETE' })

export async function uploadDocument(file: File): Promise<string> {
  const body = new FormData()
  body.append('files', file)

  const { results } = await apiFetch('/documents', documentUploadSchema, {
    method: 'POST',
    body,
  }).catch(
    withErrorMessages({
      400: "We couldn't upload that file. Make sure it's a PDF or CSV that opens correctly, then try again.",
    }),
  )
  return results[0].id
}

export async function downloadDocument({ id, originalFileName }: Document) {
  const token = getToken()

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/${id}/content`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!response.ok) throw new Error(`Download failed with status ${response.status}`)
    downloadFile(new File([await response.blob()], originalFileName))
  } catch (error) {
    console.error(`Downloading ${originalFileName} failed`, error)
    toast.error(`We couldn't download ${originalFileName}. Please try again.`)
  }
}
