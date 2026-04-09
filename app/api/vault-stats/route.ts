import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Actual vault addresses from Lido's mainnet.json config (not the Etherscan proxy addresses)
const ETH_VAULT  = '0x6a37725ca7f4CE81c004c955f7280d5C704a249e'
const USD_VAULT  = '0x014e6DA8F283C4aF65B2AA0f201438680A004452'
const MELLOW_API = 'https://api.mellow.finance'
const CHAIN_ID   = 1

function formatTvl(usdRaw: string, usdDecimals: number): string {
  const usd = Number(BigInt(usdRaw)) / Math.pow(10, usdDecimals)
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`
  if (usd >= 1_000_000)     return `$${(usd / 1_000_000).toFixed(1)}M`
  if (usd >= 1_000)         return `$${(usd / 1_000).toFixed(1)}K`
  return `$${usd.toFixed(0)}`
}

async function fetchVault(address: string) {
  const [apyRes, dataRes] = await Promise.all([
    fetch(`${MELLOW_API}/v1/chain/${CHAIN_ID}/core-vaults/${address}/apy`),
    fetch(`${MELLOW_API}/v1/chain/${CHAIN_ID}/core-vaults/${address}/data`),
  ])

  const [apyJson, dataJson] = await Promise.all([apyRes.json(), dataRes.json()])

  const apy: string = apyJson?.apy != null
    ? `${Number(apyJson.apy).toFixed(2)}%`
    : '--'

  const tvlRaw  = dataJson?.totalTvl?.usd
  const tvlDec  = dataJson?.totalTvl?.usd_decimals ?? 8
  const tvl: string = tvlRaw ? formatTvl(tvlRaw, tvlDec) : '--'

  return { apy, tvl }
}

export async function GET() {
  try {
    const [eth, usd] = await Promise.all([
      fetchVault(ETH_VAULT),
      fetchVault(USD_VAULT),
    ])

    return NextResponse.json(
      { eth, usd },
      { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' } }
    )
  } catch {
    return NextResponse.json(
      { eth: { apy: '--', tvl: '--' }, usd: { apy: '--', tvl: '--' } },
      { status: 200 }
    )
  }
}
