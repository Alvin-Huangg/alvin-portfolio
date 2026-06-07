import { NextResponse } from 'next/server'
import { safeFetch } from '@/lib/safe-fetch'
import { buildBriefingPrompt } from '@/lib/briefing-prompt'
import { enforceRateLimit, requireJson, parseJsonBody, errorResponse } from '@/lib/http'

export const dynamic = 'force-dynamic'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  error?: { message?: string; code?: number }
}

interface SummaryRequest { weather?: unknown; news?: unknown }

export async function POST(req: Request): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return errorResponse(500, 'GEMINI_API_KEY not set')

  const limited = enforceRateLimit(req, 'summary', 10, 60_000)
  if (limited) return limited

  const ct = requireJson(req)
  if (ct) return ct

  const parsed = await parseJsonBody<SummaryRequest>(req, 8_192)
  if (!parsed.ok) return parsed.response

  const prompt = buildBriefingPrompt(parsed.value.weather, parsed.value.news)

  try {
    const res = await safeFetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
      }),
    })

    const data = (await res.json()) as GeminiResponse

    if (!res.ok || data.error) {
      // Log the upstream detail; return a generic message to the client.
      return errorResponse(502, 'Could not generate summary.', data.error?.message ?? `status ${res.status}`)
    }

    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!summary) return errorResponse(502, 'Could not generate summary.', 'empty model response')

    return NextResponse.json({ summary })
  } catch (err) {
    return errorResponse(502, 'Could not generate summary.', err)
  }
}
