'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAccount, useSendTransaction, useSwitchChain, useBalance, useReadContracts } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { SUPPORTED_CHAINS, type ChainInfo, type TokenInfo } from '@/lib/chains'

interface VaultConfig {
  name: string
  shareToken: string
  outputToken: { address: string; symbol: string; decimals: number }
  color: string
}

interface DepositPanelProps {
  vault: VaultConfig
  onClose: () => void
}

interface AcrossQuote {
  expectedOutputAmount: string
  minOutputAmount: string
  expectedFillTime: number
  fees: { total: { amountUsd: string; amount: string } }
  swapTx: { to: string; data: string; value?: string; chainId: number }
  approvalTxns?: Array<{ to: string; data: string; chainId: number }>
}

const ERC20_ABI = [
  {
    type: 'function' as const,
    name: 'balanceOf',
    stateMutability: 'view' as const,
    inputs: [{ name: 'account', type: 'address' as const }],
    outputs: [{ name: '', type: 'uint256' as const }],
  },
]

const ACROSS_LOGO = 'https://s3.coinmarketcap.com/static-gravity/image/54490f7ee08a4cb185c13049500dc279.png'

function safeParseUnits(value: string, decimals: number): bigint | null {
  try {
    const parts = value.split('.')
    if (parts.length === 2 && parts[1].length > decimals) {
      value = `${parts[0]}.${parts[1].slice(0, decimals)}`
    }
    return parseUnits(value as `${number}`, decimals)
  } catch {
    return null
  }
}

function formatBalance(raw: bigint, decimals: number): string {
  const n = Number(formatUnits(raw, decimals))
  if (n === 0) return '0'
  if (n < 0.0001) return '<0.0001'
  if (n < 1) return n.toFixed(4).replace(/\.?0+$/, '')
  if (n < 1000) return n.toFixed(3).replace(/\.?0+$/, '')
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function ChainLogo({ logoUrl, color, size = 18 }: { logoUrl: string; color: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoUrl} alt="" width={size} height={size}
      style={{ borderRadius: '50%', flexShrink: 0, objectFit: 'cover', background: color }} />
  )
}

function TokenLogo({ logoUrl, size = 16 }: { logoUrl: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoUrl} alt="" width={size} height={size}
      style={{ borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
  )
}

export default function DepositPanel({ vault, onClose }: DepositPanelProps) {
  const { address, chain: walletChain } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const { switchChainAsync } = useSwitchChain()

  const [selectedChain, setSelectedChain] = useState<ChainInfo>(SUPPORTED_CHAINS[0])
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(SUPPORTED_CHAINS[0].tokens[0])
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState<AcrossQuote | null>(null)
  const [quoteError, setQuoteError] = useState('')
  const [loading, setLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<'idle' | 'switching' | 'approving' | 'depositing' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState('')
  const [chainOpen, setChainOpen] = useState(false)
  const [tokenOpen, setTokenOpen] = useState(false)

  const chainRef = useRef<HTMLDivElement>(null)
  const tokenRef = useRef<HTMLDivElement>(null)

  // --- Balance reading ---
  const erc20Tokens = selectedChain.tokens.filter(t => !t.isNative)

  const { data: nativeBal } = useBalance({
    address,
    chainId: selectedChain.id,
    query: { enabled: !!address, refetchInterval: 15_000 },
  })

  const { data: erc20Bals } = useReadContracts({
    contracts: erc20Tokens.map(t => ({
      address: t.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf' as const,
      args: address ? [address as `0x${string}`] : undefined,
      chainId: selectedChain.id,
    })),
    query: { enabled: !!address && erc20Tokens.length > 0, refetchInterval: 15_000 },
  })

  type ERC20Result = { status: 'success'; result: bigint } | { status: 'failure'; error: Error }
  const typedErc20Bals = erc20Bals as ERC20Result[] | undefined

  // Build symbol -> formatted balance map
  const balances: Record<string, string> = {}
  if (address) {
    selectedChain.tokens.forEach(t => {
      if (t.isNative && nativeBal) {
        balances[t.symbol] = formatBalance(nativeBal.value, t.decimals)
      } else if (!t.isNative && typedErc20Bals) {
        const idx = erc20Tokens.findIndex(e => e.symbol === t.symbol)
        const res = typedErc20Bals[idx]
        if (res && res.status === 'success' && res.result != null) {
          balances[t.symbol] = formatBalance(res.result as bigint, t.decimals)
        }
      }
    })
  }

  const selectedBalance = balances[selectedToken.symbol]
  const rawSelectedBalance = selectedToken.isNative
    ? nativeBal?.value
    : (() => {
        const idx = erc20Tokens.findIndex(e => e.symbol === selectedToken.symbol)
        const res = typedErc20Bals?.[idx]
        return (res && res.status === 'success' && res.result != null) ? (res.result as bigint) : undefined
      })()

  // --- Dropdown close on outside click ---
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (chainRef.current && !chainRef.current.contains(e.target as Node)) setChainOpen(false)
      if (tokenRef.current && !tokenRef.current.contains(e.target as Node)) setTokenOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    setSelectedToken(selectedChain.tokens[0])
    setQuote(null); setQuoteError(''); setTxStatus('idle')
  }, [selectedChain])

  useEffect(() => {
    setQuote(null); setQuoteError('')
    if (txStatus === 'error') setTxStatus('idle')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, amount])

  // --- Quote fetching ---
  const fetchQuote = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) { setQuote(null); setQuoteError(''); return }
    const amountIn = safeParseUnits(amount, selectedToken.decimals)
    if (!amountIn || amountIn <= BigInt(0)) { setQuoteError('Invalid amount'); return }

    const recipient = address || '0x0000000000000000000000000000000000000001'
    const depositor = address || '0x0000000000000000000000000000000000000001'
    const inputToken = selectedToken.isNative ? '0x0000000000000000000000000000000000000000' : selectedToken.address

    setLoading(true); setQuoteError('')
    try {
      const params = new URLSearchParams({
        inputToken, outputToken: vault.outputToken.address,
        originChainId: String(selectedChain.id), destinationChainId: '1',
        amount: amountIn.toString(), recipient, depositor,
      })
      const res = await fetch(`/api/across-quote?${params}`)
      const data = await res.json()
      if (data.message || data.error || data.code) {
        const raw: string = data.message || data.error || ''
        const msg = raw.toLowerCase().includes('too low') || raw.toLowerCase().includes('minimum')
          ? 'Amount too low for this route. Try a larger amount.'
          : raw.toLowerCase().includes('not supported') || raw.toLowerCase().includes('route')
          ? 'Route not supported. Try a different token or chain.'
          : 'Quote unavailable. Try a different amount or token.'
        setQuoteError(msg); setQuote(null)
      } else {
        setQuote(data); setQuoteError('')
      }
    } catch { setQuoteError('Network error. Please try again.') }
    finally { setLoading(false) }
  }, [amount, selectedToken, selectedChain, vault, address])

  useEffect(() => {
    const t = setTimeout(fetchQuote, 700)
    return () => clearTimeout(t)
  }, [fetchQuote])

  // --- Transaction ---
  const handleDeposit = async () => {
    if (!quote || !address) return
    try {
      if (walletChain?.id !== selectedChain.id) {
        setTxStatus('switching')
        await switchChainAsync({ chainId: selectedChain.id })
      }
      if (quote.approvalTxns?.length) {
        setTxStatus('approving')
        for (const appr of quote.approvalTxns) {
          await sendTransactionAsync({ to: appr.to as `0x${string}`, data: appr.data as `0x${string}`, chainId: appr.chainId })
        }
      }
      setTxStatus('depositing')
      const tx = quote.swapTx
      const hash = await sendTransactionAsync({
        to: tx.to as `0x${string}`,
        data: tx.data as `0x${string}`,
        value: tx.value ? BigInt(tx.value) : undefined,
        chainId: tx.chainId,
      })
      setTxHash(hash)
      setTxStatus('success')
    } catch (e) { console.error(e); setTxStatus('error') }
  }

  const handleMax = () => {
    if (!rawSelectedBalance) return
    // Leave a small buffer for native ETH gas
    const buf = selectedToken.isNative ? parseUnits('0.001', 18) : BigInt(0)
    const max = rawSelectedBalance > buf ? rawSelectedBalance - buf : rawSelectedBalance
    setAmount(Number(formatUnits(max, selectedToken.decimals)).toFixed(6).replace(/\.?0+$/, ''))
  }

  const outputAmt = quote
    ? Number(formatUnits(BigInt(quote.expectedOutputAmount), vault.outputToken.decimals)).toFixed(6)
    : null
  const minAmt = quote
    ? Number(formatUnits(BigInt(quote.minOutputAmount), vault.outputToken.decimals)).toFixed(6)
    : null
  const fillTime = quote?.expectedFillTime ?? null
  const feeUsd = quote?.fees?.total?.amountUsd ?? null
  const needsChainSwitch = !!address && walletChain?.id !== selectedChain.id
  const isProcessing = txStatus === 'switching' || txStatus === 'approving' || txStatus === 'depositing'
  const canDeposit = !!quote && !loading && !isProcessing && !quoteError && !!address

  const buttonLabel = !address ? 'Connect wallet to deposit'
    : loading ? 'Fetching quote...'
    : isProcessing ? (
        txStatus === 'switching' ? `Switching to ${selectedChain.name}...`
        : txStatus === 'approving' ? 'Approving token...'
        : 'Submitting bridge...'
      )
    : quoteError ? 'Quote unavailable'
    : !quote ? 'Enter an amount'
    : needsChainSwitch ? `Switch to ${selectedChain.name} and deposit`
    : `Deposit into ${vault.name}`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden animate-fade-up"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base" style={{ color: 'var(--text)' }}>
                Deposit into {vault.name}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'var(--orange-dim)', color: 'var(--orange)' }}>
                <TokenLogo logoUrl={ACROSS_LOGO} size={13} />
                via Across
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Any chain, any asset, one transaction
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-60 transition-opacity"
            style={{ color: 'var(--muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Chain selector */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted)' }}>FROM CHAIN</label>
            <div className="relative" ref={chainRef}>
              <button onClick={() => { setChainOpen(v => !v); setTokenOpen(false) }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg)', border: `1px solid ${chainOpen ? 'var(--blue)' : 'var(--border)'}`, color: 'var(--text)' }}>
                <div className="flex items-center gap-2">
                  <ChainLogo logoUrl={selectedChain.logoUrl} color={selectedChain.color} />
                  {selectedChain.name}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: chainOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {chainOpen && (
                <div className="absolute z-20 top-full mt-1 w-full rounded-xl overflow-hidden shadow-2xl"
                  style={{ background: '#0d1222', border: '1px solid var(--border-hover)' }}>
                  <div className="max-h-52 overflow-y-auto">
                    {SUPPORTED_CHAINS.map(c => (
                      <button key={c.id} onClick={() => { setSelectedChain(c); setChainOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors"
                        style={{
                          background: selectedChain.id === c.id ? 'var(--blue-dim)' : 'transparent',
                          color: selectedChain.id === c.id ? 'var(--blue)' : 'var(--text)',
                        }}>
                        <ChainLogo logoUrl={c.logoUrl} color={c.color} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Token + Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>YOU SEND</label>
              {address && selectedBalance !== undefined && (
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  Balance: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{selectedBalance}</span>
                  {' '}{selectedToken.symbol}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {/* Token selector */}
              <div className="relative shrink-0" ref={tokenRef}>
                <button onClick={() => { setTokenOpen(v => !v); setChainOpen(false) }}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap"
                  style={{ background: 'var(--bg)', border: `1px solid ${tokenOpen ? 'var(--blue)' : 'var(--border)'}`, color: 'var(--text)' }}>
                  <div className="flex items-center gap-1.5">
                    <TokenLogo logoUrl={selectedToken.logoUrl} />
                    {selectedToken.symbol}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: tokenOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {tokenOpen && (
                  <div className="absolute z-20 top-full mt-1 rounded-xl overflow-hidden shadow-2xl"
                    style={{ background: '#0d1222', border: '1px solid var(--border-hover)', minWidth: 220 }}>
                    {selectedChain.tokens.map(t => (
                      <button key={t.symbol} onClick={() => { setSelectedToken(t); setTokenOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors"
                        style={{
                          background: selectedToken.symbol === t.symbol ? 'var(--blue-dim)' : 'transparent',
                          color: selectedToken.symbol === t.symbol ? 'var(--blue)' : 'var(--text)',
                        }}>
                        <TokenLogo logoUrl={t.logoUrl} />
                        <span className="font-bold">{t.symbol}</span>
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>{t.name}</span>
                        {/* Balance on the right */}
                        {address && balances[t.symbol] !== undefined && (
                          <span className="ml-auto text-xs font-semibold tabular-nums"
                            style={{ color: balances[t.symbol] === '0' ? 'var(--muted)' : 'var(--text)' }}>
                            {balances[t.symbol]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount + MAX */}
              <div className="flex-1 relative">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold outline-none"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', paddingRight: rawSelectedBalance ? '52px' : '12px', transition: 'border-color 0.15s' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--blue)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
                {rawSelectedBalance && rawSelectedBalance > BigInt(0) && (
                  <button onClick={handleMax}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded transition-opacity hover:opacity-70"
                    style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
                    MAX
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Route indicator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ background: 'var(--orange-dim)', color: 'var(--orange)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
              Across routes to Ethereum
            </div>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Output */}
          <div className="rounded-xl p-3.5 space-y-1.5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>YOU RECEIVE ON ETHEREUM</span>
              {loading && (
                <div className="w-3 h-3 rounded-full border-2 animate-spin-slow"
                  style={{ borderColor: 'var(--blue)', borderTopColor: 'transparent' }} />
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold" style={{ color: loading ? 'var(--muted)' : 'var(--text)' }}>
                {loading ? '...' : outputAmt ?? '0.000000'}
              </span>
              <span className="text-sm font-bold" style={{ color: vault.color }}>
                {vault.outputToken.symbol}
              </span>
            </div>
            {minAmt && !loading && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Min {minAmt} {vault.outputToken.symbol}, then deposited into {vault.name}
              </div>
            )}
          </div>

          {/* Quote details */}
          {quote && !loading && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-2.5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Bridge fee</div>
                <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                  {feeUsd ? `~$${parseFloat(feeUsd).toFixed(4)}` : 'Free'}
                </div>
              </div>
              <div className="rounded-lg p-2.5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Est. fill time</div>
                <div className="text-sm font-bold" style={{ color: 'var(--green)' }}>~{fillTime ?? 2}s</div>
              </div>
            </div>
          )}

          {/* Errors */}
          {quoteError && (
            <div className="text-xs px-3 py-2.5 rounded-lg leading-relaxed"
              style={{ background: 'rgba(255,100,100,0.08)', color: '#ff8888', border: '1px solid rgba(255,100,100,0.15)' }}>
              {quoteError}
            </div>
          )}
          {txStatus === 'error' && !quoteError && (
            <div className="text-xs px-3 py-2.5 rounded-lg"
              style={{ background: 'rgba(255,100,100,0.08)', color: '#ff8888', border: '1px solid rgba(255,100,100,0.15)' }}>
              Transaction rejected or failed. Try again below.
            </div>
          )}

          {/* Success */}
          {txStatus === 'success' && (
            <div className="rounded-xl p-4 text-center space-y-2"
              style={{ background: 'var(--green-dim)', border: '1px solid rgba(90,200,120,0.25)' }}>
              <div style={{ fontSize: 24 }}>✓</div>
              <div className="font-bold text-sm" style={{ color: 'var(--green)' }}>Bridge submitted!</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {vault.outputToken.symbol} arriving on Ethereum in ~{fillTime ?? 2}s
              </div>
              {txHash && (
                <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer"
                  className="text-xs underline block" style={{ color: 'var(--muted-light)' }}>
                  View on Etherscan
                </a>
              )}
            </div>
          )}

          {/* CTA */}
          {txStatus !== 'success' && (
            <button
              onClick={canDeposit ? handleDeposit : undefined}
              disabled={!canDeposit}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
              style={canDeposit
                ? { background: vault.color, color: '#fff', cursor: 'pointer' }
                : { background: 'var(--border)', color: 'var(--muted)', cursor: 'not-allowed' }
              }>
              {buttonLabel}
            </button>
          )}

          <p className="text-center text-[10px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            Not available to U.S. persons or restricted jurisdictions.
            Vault deposits subject to 72h withdrawal period.
          </p>
        </div>
      </div>
    </div>
  )
}
