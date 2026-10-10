import type { ZodType } from 'zod'

import { getToken } from '@/lib/auth-token'

const UNKNOWN_ERROR = 'Something went wrong. Please try again.'
const SERVER_ERROR = 'Something went wrong on our end. Please try again in a few minutes.'
const NETWORK_ERROR = "We couldn't reach the server. Check your connection and try again."

const statusMessages: Partial<Record<number, string>> = {
  400: "Some of the details you entered aren't valid. Check them and try again.",
  401: 'Your session has expired. Sign in again to continue.',
  403: "You don't have permission to do that.",
  404: "We couldn't find that. It may have been deleted.",
  413: 'That file is too large to upload.',
  429: "You're doing that too often. Wait a moment and try again.",
}

const messageForStatus = (status: number) =>
  statusMessages[status] ?? (status >= 500 ? SERVER_ERROR : UNKNOWN_ERROR)

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const withErrorMessages =
  (messages: Partial<Record<number, string>>, fallback?: string) =>
  (error: unknown): never => {
    if (!(error instanceof ApiError)) throw error
    throw new ApiError(error.status, messages[error.status] ?? fallback ?? error.message)
  }

const readBody = async (response: Response): Promise<unknown> => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiFetch<T>(
  path: string,
  schema: ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const token = getToken()
  const isFormData = init?.body instanceof FormData
  const request = `${init?.method ?? 'GET'} ${path}`

  let response: Response
  try {
    response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      ...init,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    })
  } catch (error) {
    console.error(`${request} could not reach the server`, error)
    throw new ApiError(0, NETWORK_ERROR)
  }

  const body = await readBody(response)

  if (!response.ok) {
    console.error(`${request} failed with status ${response.status}`, body)
    throw new ApiError(response.status, messageForStatus(response.status))
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    console.error(`${request} returned an unexpected response`, result.error)
    throw new Error(UNKNOWN_ERROR)
  }

  return result.data
}
