import type { ZodType } from 'zod'

import { getToken } from '@/lib/auth-token'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T>(
  path: string,
  schema: ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const token = getToken()

  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}`
    throw new ApiError(response.status, message)
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    console.error(result.error)
    throw new Error('Unexpected response from server')
  }

  return result.data
}
