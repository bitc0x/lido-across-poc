import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const params = new URLSearchParams(req.nextUrl.searchParams)
  params.set('integratorId', '0x00f1')

  const url = `https://app.across.to/api/swap/approval?${params.toString()}`

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      // Don't cache quotes - they expire quickly
      cache: 'no-store',
    })

    const data = await res.json()

    return NextResponse.json(data, {
      status: res.status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to reach Across API. Check your connection.' },
      { status: 502 }
    )
  }
}
