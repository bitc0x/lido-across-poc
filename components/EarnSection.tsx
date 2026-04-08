'use client'

import { useState, useEffect } from 'react'
import DepositPanel from './DepositPanel'
import { VAULTS } from '@/lib/chains'

type VaultKey = 'ETH' | 'USD'

interface LiveStats { apy: string; tvl: string }
interface VaultStats { eth: LiveStats; usd: LiveStats }

const STATIC_DETAILS = {
  ETH: {
    curator: 'Mellow',
    curatorUrl: 'https://mellow.finance',
    performanceFee: '10%',
    platformFee: '1%',
    auditor: 'Nethermind',
    withdrawal: 'Up to 72 hours',
    etherscan: 'https://etherscan.io/address/0xBBFC8683C8fE8cF73777feDE7ab9574935fea0A4',
  },
  USD: {
    curator: 'Mellow',
    curatorUrl: 'https://mellow.finance',
    performanceFee: '10%',
    platformFee: '1%',
    auditor: 'Nethermind',
    withdrawal: 'Up to 72 hours',
    etherscan: 'https://etherscan.io/address/0x4Ce1ac8F43E0E5BD7A346A98aF777bF8fbeA1981',
  },
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}

function StatBox({ label, value, color, loading }: { label: string; value: string; color: string; loading: boolean }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--bg)' }}>
      <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>{label}</div>
      {loading ? (
        <div className="h-7 w-20 rounded shimmer mt-1" />
      ) : (
        <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      )}
    </div>
  )
}

interface VaultCardProps {
  vaultKey: VaultKey
  stats: LiveStats
  statsLoading: boolean
  onDeposit: (key: VaultKey) => void
}

function VaultCard({ vaultKey, stats, statsLoading, onDeposit }: VaultCardProps) {
  const vault = VAULTS[vaultKey]
  const details = STATIC_DETAILS[vaultKey]
  const [tab, setTab] = useState<'info' | 'assets'>('info')

  const acceptedAssets = vaultKey === 'ETH'
    ? ['ETH', 'WETH', 'stETH', 'wstETH', '+ any via Across']
    : ['USDC', 'USDT', '+ any via Across']

  const withAcross = vaultKey === 'ETH'
    ? ['ETH, WETH, WBTC, DAI on 15+ chains', 'USDC, USDT on any chain', 'Any liquid ERC-20 via swap']
    : ['USDC, USDT on 15+ chains', 'ETH, WETH, DAI on any chain', 'WBTC, stablecoins via swap']

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="p-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold" style={{ color: 'var(--text)' }}>{vault.name}</h2>
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
                <ShieldIcon />
                PROTECTED
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed max-w-sm" style={{ color: 'var(--muted)' }}>
              {vault.description}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0"
            style={{ background: `${vault.color}20`, color: vault.color }}>
            {vaultKey}
          </div>
        </div>

        {/* APY + TVL - live */}
        <div className="grid grid-cols-2 gap-3">
          <StatBox
            label="APY* (7d avg.)"
            value={stats.apy}
            color="var(--green)"
            loading={statsLoading}
          />
          <StatBox
            label="TVL"
            value={stats.tvl}
            color="var(--text)"
            loading={statsLoading}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
        {(['info', 'assets'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-xs font-semibold transition-all"
            style={tab === t
              ? { color: 'var(--blue)', borderBottom: '2px solid var(--blue)' }
              : { color: 'var(--muted)' }
            }>
            {t === 'info' ? 'Details' : 'Accepted Assets'}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {tab === 'info' && (
          <>
            {[
              ['Curator', <a key="c" href={details.curatorUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--blue)' }}>{details.curator}</a>],
              ['Performance fee', details.performanceFee],
              ['Platform fee', details.platformFee],
              ['Auditor', details.auditor],
              ['Withdrawal time', details.withdrawal],
              ['Contract', <a key="e" href={details.etherscan} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--muted)' }}>View on Etherscan</a>],
            ].map(([label, value], i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--muted)' }}>{label}</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>{value}</span>
              </div>
            ))}
          </>
        )}

        {tab === 'assets' && (
          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>
                NATIVE (Ethereum mainnet only)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {acceptedAssets.map((a, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: a.includes('via') ? 'var(--orange-dim)' : 'var(--blue-dim)',
                      color: a.includes('via') ? 'var(--orange)' : 'var(--blue)',
                    }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: 'var(--orange)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
                WITH ACROSS: Any chain, any asset
              </div>
              <div className="flex flex-wrap gap-1.5">
                {withAcross.map((a, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => onDeposit(vaultKey)}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: vault.color, color: '#fff' }}>
          Deposit
        </button>
        <a href={details.etherscan} target="_blank" rel="noreferrer"
          className="px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1 transition-all hover:opacity-70"
          style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
          Contract
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default function EarnSection() {
  const [activeDeposit, setActiveDeposit] = useState<VaultKey | null>(null)
  const [stats, setStats] = useState<VaultStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/vault-stats')
      .then(r => r.json())
      .then((data: VaultStats) => {
        setStats(data)
        setStatsLoading(false)
      })
      .catch(() => setStatsLoading(false))
  }, [])

  const ethStats  = stats?.eth  ?? { apy: '--', tvl: '--' }
  const usdStats  = stats?.usd  ?? { apy: '--', tvl: '--' }
  const activeVault = activeDeposit ? VAULTS[activeDeposit] : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up stagger-1">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
              Lido Earn
            </h1>
            <p className="text-sm mt-1.5 max-w-lg" style={{ color: 'var(--muted)' }}>
              Deploy ETH and USD into DeFi vaults for on-chain rewards.
              Now accessible from any chain via Across Protocol.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'var(--orange-dim)', color: 'var(--orange)', border: '1px solid rgba(255,102,64,0.2)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://s3.coinmarketcap.com/static-gravity/image/54490f7ee08a4cb185c13049500dc279.png"
              alt="Across" width={16} height={16} style={{ borderRadius: '50%' }} />
            Powered by Across Swap API
          </div>
        </div>
      </div>

      {/* Vault cards */}
      <div className="grid md:grid-cols-2 gap-5 animate-fade-up stagger-2">
        <VaultCard vaultKey="ETH" stats={ethStats} statsLoading={statsLoading} onDeposit={setActiveDeposit} />
        <VaultCard vaultKey="USD" stats={usdStats} statsLoading={statsLoading} onDeposit={setActiveDeposit} />
      </div>

      <p className="text-center text-xs mt-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
        * APY figures are estimates, not guaranteed, and subject to change. Not available to U.S. persons.
        Vault deposits subject to 72-hour withdrawal window. This is a proof-of-concept demo.
      </p>

      {activeDeposit && activeVault && (
        <DepositPanel
          vault={activeVault}
          onClose={() => setActiveDeposit(null)}
        />
      )}
    </div>
  )
}
