import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  params.set('integratorId', '0x00f1')

  const url = `https://app.across.to/api/swap/approval?${params.toString()}`

  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch Across quote' }, { status: 500 })
  }
}
