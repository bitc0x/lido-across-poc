import { NextRequest, NextResponse } from 'next/server'

// Node.js runtime - edge was causing 502s fetching to external APIs
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const params = new URLSearchParams(req.nextUrl.searchParams)
  params.set('integratorId', '0x00f1')

  const url = `https://app.across.to/api/swap/approval?${params.toString()}`

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    })

    const data = await res.json()

    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (e) {
    console.error('Across API fetch failed:', e)
    return NextResponse.json(
      { error: 'Failed to reach Across API.' },
      { status: 502 }
    )
  }
}
