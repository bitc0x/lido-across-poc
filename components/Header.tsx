'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

interface HeaderProps {
  activeTab: 'overview' | 'earn'
  onTabChange: (tab: 'overview' | 'earn') => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header style={{ background: 'rgba(11,14,26,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#00a3ff" fillOpacity="0.15"/>
            <path d="M14 5L8 10.5L14 13L20 10.5L14 5Z" fill="#00a3ff"/>
            <path d="M8 13L14 15.5L20 13L14 23L8 13Z" fill="#00a3ff" fillOpacity="0.7"/>
          </svg>
          <span className="font-bold text-[15px] tracking-tight" style={{ color: 'var(--text)' }}>
            Lido
          </span>
          <span style={{ color: 'var(--border-hover)', fontSize: 12 }}>/</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: 'var(--orange-dim)', color: 'var(--orange)' }}>
            Across PoC
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {(['Stake','Wrap','Withdrawals','Rewards'] as const).map(label => (
            <span key={label} className="px-3 py-1.5 text-sm rounded-lg cursor-default transition-colors"
              style={{ color: 'var(--muted)' }}>
              {label}
            </span>
          ))}
          {(['overview','earn'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="px-3 py-1.5 text-sm rounded-lg font-semibold transition-all"
              style={activeTab === tab
                ? { background: 'var(--blue-dim)', color: 'var(--blue)' }
                : { color: 'var(--muted-light)' }
              }
            >
              {tab === 'overview' ? 'Overview' : 'Earn'}
              {tab === 'earn' && (
                <span className="ml-1.5 text-[10px] font-bold px-1 py-0.5 rounded"
                  style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
                  NEW
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Wallet */}
        <div className="shrink-0">
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
          />
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex border-t" style={{ borderColor: 'var(--border)' }}>
        {(['overview','earn'] as const).map(tab => (
          <button key={tab} onClick={() => onTabChange(tab)}
            className="flex-1 py-2.5 text-sm font-semibold transition-all"
            style={activeTab === tab
              ? { color: 'var(--blue)', borderBottom: '2px solid var(--blue)' }
              : { color: 'var(--muted)' }
            }>
            {tab === 'overview' ? 'Overview' : 'Earn'}
          </button>
        ))}
      </div>
    </header>
  )
}
