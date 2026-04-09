'use client'

import { SUPPORTED_CHAINS } from '@/lib/chains'

interface OverviewProps {
  onGetStarted: () => void
}

const STATS = [
  { value: '22',  label: 'Supported chains' },
  { value: '40+', label: 'Independent relayers' },
  { value: '~2s',  label: 'Average fill time' },
  { value: '<$1',   label: 'Typical relay fee' },
]

const STEPS = [
  {
    num: '01',
    title: 'Choose your origin',
    body: 'Select any chain and any supported asset. USDC on Arbitrum, ETH on Base, WBTC on Polygon. Anything works.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Across routes and fills',
    body: 'The Across relayer network instantly swaps and bridges your asset to Ethereum mainnet in the correct vault input token.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Vault deposit executes',
    body: 'Funds arrive on Ethereum and are deposited directly into EarnETH or EarnUSD. You receive vault shares. Done.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
]

export default function Overview({ onGetStarted }: OverviewProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-20">

      {/* HERO */}
      <section className="text-center space-y-6 animate-fade-up stagger-1">
        <div className="inline-flex items-center gap-3 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://europe1.discourse-cdn.com/flex013/uploads/lido/original/1X/8d3e77d0e4936c97f2b6189ab18370bd88fbe91e.png"
            alt="Lido" width={40} height={40} style={{ borderRadius: '50%' }} />
          <span style={{ color: 'var(--muted-light)', fontSize: 20, fontWeight: 300 }}>×</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://s3.coinmarketcap.com/static-gravity/image/54490f7ee08a4cb185c13049500dc279.png"
            alt="Across" width={40} height={40} style={{ borderRadius: '50%' }} />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: 'var(--text)' }}>
          Lido Earn, open to<br />
          <span style={{ color: 'var(--blue)' }}>every chain and asset</span>
        </h1>

        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--muted-light)' }}>
          Today, EarnETH and EarnUSD only accept a handful of assets on Ethereum mainnet.
          Across Protocol unlocks deposits from any supported chain with any supported token, in a single transaction.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onGetStarted}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'var(--blue)', color: '#fff' }}>
            Try the Demo
          </button>
          <a href="https://across.to" target="_blank" rel="noreferrer"
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
            style={{ border: '1px solid var(--border-hover)', color: 'var(--muted-light)' }}>
            About Across
          </a>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="grid md:grid-cols-2 gap-6 animate-fade-up stagger-2">
        {/* Problem */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-1 rounded"
              style={{ background: 'rgba(255,100,100,0.12)', color: '#ff6464' }}>
              TODAY
            </span>
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Lido Earn limitations</span>
          </div>
          {[
            'Ethereum mainnet only',
            'EarnETH: ETH, WETH, stETH, wstETH',
            'EarnUSD: USDC, USDT only',
            'Multi-step: bridge, approve, deposit',
            'Every extra step loses conversion',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--muted-light)' }}>
              <span className="mt-0.5 shrink-0" style={{ color: '#ff6464' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </span>
              {item}
            </div>
          ))}
        </div>

        {/* Solution */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: 'var(--card)', border: '1px solid rgba(0,163,255,0.25)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-1 rounded"
              style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
              WITH ACROSS
            </span>
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Unlocked</span>
          </div>
          {[
            '22 chains supported (Arbitrum, Base, OP, Polygon, Blast, HyperEVM, MegaETH...)',
            'Any liquid ERC-20: ETH, USDC, USDT, WBTC, DAI, and more',
            'Across swaps to the correct vault input automatically',
            'One transaction from origin to vault deposit',
            'Across covers gas on destination. Only a small relay fee applies',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--muted-light)' }}>
              <span className="mt-0.5 shrink-0" style={{ color: 'var(--green)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up stagger-3">
        {STATS.map((s, i) => (
          <div key={i} className="rounded-2xl p-5 text-center"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-3xl font-extrabold" style={{ color: 'var(--blue)' }}>{s.value}</div>
            <div className="text-xs mt-1 font-medium" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-6 animate-fade-up stagger-4">
        <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--text)' }}>How it works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-3 relative overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="absolute top-4 right-4 text-5xl font-extrabold select-none"
                style={{ color: 'rgba(255,255,255,0.03)' }}>{step.num}</div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
                {step.icon}
              </div>
              <h3 className="font-bold text-[15px]" style={{ color: 'var(--text)' }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-light)' }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHAINS GRID */}
      <section className="space-y-5 animate-fade-up stagger-5">
        <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--text)' }}>
          Supported origin chains
        </h2>
        <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
          Deposit into Lido Earn vaults from any of these networks
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SUPPORTED_CHAINS.map(chain => (
            <div key={chain.id} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={chain.logoUrl} alt={chain.name} width={18} height={18}
                style={{ borderRadius: '50%', objectFit: 'cover', background: chain.color }} />
              {chain.name}
            </div>
          ))}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--card)', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
            + more
          </div>
        </div>
      </section>

      {/* BD VALUE PROP */}
      <section className="rounded-2xl p-8 space-y-4 animate-fade-up"
        style={{ background: 'linear-gradient(135deg, rgba(0,163,255,0.08) 0%, rgba(90,200,120,0.06) 100%)', border: '1px solid rgba(0,163,255,0.2)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          TVL acquisition, not just better UX
        </h2>
        <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--muted-light)' }}>
          The Lido Earn vaults are competing for liquidity that lives on L2s and in assets outside their whitelist.
          Across turns every supported chain into a direct deposit channel. Users with USDC on Arbitrum, WBTC on Polygon,
          or ETH on Base can deposit into EarnETH or EarnUSD in one click. These are flows that are categorically impossible today.
          Lido builds nothing. Across handles all routing, swapping, and settlement.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {[
            { label: 'Smart contract escrow', desc: 'Non-custodial' },
            { label: '40+ relayers', desc: 'No single point of failure' },
            { label: 'UMA oracle', desc: 'Optimistic verification' },
            { label: 'Atomic execution', desc: 'Bridge and deposit in one tx' },
          ].map((f, i) => (
            <div key={i} className="px-3 py-2 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-bold" style={{ color: 'var(--blue)' }}>{f.label}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 pb-8">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>See it live</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          The Earn tab below has real quotes from the Across Swap API
        </p>
        <button onClick={onGetStarted}
          className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'var(--blue)', color: '#fff' }}>
          Open Earn Demo
        </button>
      </section>
    </div>
  )
}
