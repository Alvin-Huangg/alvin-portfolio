import { createClient, type SanityClient } from '@sanity/client'

/**
 * Lazily-instantiated singleton Sanity write client.
 *
 * The client is created once per process and reused, rather than reconstructed
 * on every request. Construction is deferred (not module-load) so that route
 * modules importing this file don't throw at import time when the write token
 * is absent — only when a write is actually attempted.
 */
let client: SanityClient | null = null

export function getWriteClient(): SanityClient {
  if (client) return client

  const token = process.env.SANITY_WRITE_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!token) throw new Error('SANITY_WRITE_TOKEN not configured')
  if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID not configured')

  client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })
  return client
}
