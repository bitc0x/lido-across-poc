'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi'
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
  fees: {
    total: { amountUsd: string; amount: string }
  }
  swapTx: {
    to: string
    data: string
    value?: string
    chainId: number
  }
  approvalTxns?: Array<{ to: string; data: string; chainId: number }>
}

function ChainIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      borderRadius: '50%', background: color, flexShrink: 0
    }} />
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

  // Reset token when chain changes
  useEffect(() => {
    setSelectedToken(selectedChain.tokens[0])
    setQuote(null)
    setQuoteError('')
  }, [selectedChain])

  const fetchQuote = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) { setQuote(null); return }
    const amountIn = parseUnits(amount, selectedToken.decimals).toString()
    const recipient = address || '0x0000000000000000000000000000000000000001'
    const depositor = address || '0x0000000000000000000000000000000000000001'
    const inputToken = selectedToken.isNative
      ? '0x0000000000000000000000000000000000000000'
      : selectedToken.address

    setLoading(true)
    setQuoteError('')
    try {
      const params = new URLSearchParams({
        inputToken,
        outputToken: vault.outputToken.address,
        originChainId: String(selectedChain.id),
        destinationChainId: '1',
        amount: amountIn,
        recipient,
        depositor,
      })
      const res = await fetch(`/api/across-quote?${params}`)
      const data = await res.json()
      if (data.message || data.error) {
        setQuoteError(data.message || data.error)
        setQuote(null)
      } else {
        setQuote(data)
        setQuoteError('')
      }
    } catch {
      setQuoteError('Failed to fetch quote')
    } finally {
      setLoading(false)
    }
  }, [amount, selectedToken, selectedChain, vault, address])

  useEffect(() => {
    const t = setTimeout(fetchQuote, 600)
    return () => clearTimeout(t)
  }, [fetchQuote])

  const handleDeposit = async () => {
    if (!quote || !address) return
    try {
      // Switch chain if needed
      if (walletChain?.id !== selectedChain.id) {
        setTxStatus('switching')
        await switchChainAsync({ chainId: selectedChain.id })
      }
      // Handle approval if needed
      if (quote.approvalTxns?.length) {
        setTxStatus('approving')
        for (const appr of quote.approvalTxns) {
          await sendTransactionAsync({ to: appr.to as `0x${string}`, data: appr.data as `0x${string}`, chainId: appr.chainId })
        }
      }
      // Execute bridge + swap
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
    } catch (e: unknown) {
      console.error(e)
      setTxStatus('error')
    }
  }

  const outputAmount = quote
    ? parseFloat(formatUnits(BigInt(quote.expectedOutputAmount), vault.outputToken.decimals)).toFixed(4)
    : null
  const minOutputAmount = quote
    ? parseFloat(formatUnits(BigInt(quote.minOutputAmount), vault.outputToken.decimals)).toFixed(4)
    : null
  const fillTime = quote?.expectedFillTime ?? null
  const feeUsd = quote?.fees?.total?.amountUsd ?? null

  const needsChainSwitch = address && walletChain?.id !== selectedChain.id

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden animate-fade-up"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base" style={{ color: 'var(--text)' }}>
                Deposit into {vault.name}
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'var(--orange-dim)', color: 'var(--orange)' }}>
                via Across
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Any chain, any asset, one transaction
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:opacity-70"
            style={{ color: 'var(--muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Chain Selector */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted)' }}>
              FROM CHAIN
            </label>
            <div className="relative">
              <button onClick={() => { setChainOpen(!chainOpen); setTokenOpen(false) }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <div className="flex items-center gap-2">
                  <ChainIcon color={selectedChain.color} />
                  {selectedChain.name}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: chainOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {chainOpen && (
                <div className="absolute z-10 top-full mt-1 w-full rounded-xl overflow-hidden shadow-2xl"
                  style={{ background: '#0d1222', border: '1px solid var(--border)' }}>
                  <div className="max-h-52 overflow-y-auto">
                    {SUPPORTED_CHAINS.map(c => (
                      <button key={c.id} onClick={() => { setSelectedChain(c); setChainOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:opacity-80 transition-opacity"
                        style={{
                          background: selectedChain.id === c.id ? 'var(--blue-dim)' : 'transparent',
                          color: selectedChain.id === c.id ? 'var(--blue)' : 'var(--text)',
                        }}>
                        <ChainIcon color={c.color} />
                        {c.name}
                        <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>
                          {c.tokens.length} tokens
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Token + Amount */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted)' }}>
              YOU SEND
            </label>
            <div className="flex gap-2">
              {/* Token selector */}
              <div className="relative">
                <button onClick={() => { setTokenOpen(!tokenOpen); setChainOpen(false) }}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {selectedToken.symbol}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: tokenOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {tokenOpen && (
                  <div className="absolute z-10 top-full mt-1 rounded-xl overflow-hidden shadow-2xl"
                    style={{ background: '#0d1222', border: '1px solid var(--border)', minWidth: 140 }}>
                    {selectedChain.tokens.map(t => (
                      <button key={t.address} onClick={() => { setSelectedToken(t); setTokenOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:opacity-80 transition-opacity"
                        style={{
                          background: selectedToken.symbol === t.symbol ? 'var(--blue-dim)' : 'transparent',
                          color: selectedToken.symbol === t.symbol ? 'var(--blue)' : 'var(--text)',
                        }}>
                        <span className="font-bold">{t.symbol}</span>
                        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Amount input */}
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold outline-none transition-all"
                style={{
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  color: 'var(--text)', minWidth: 0,
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--blue)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          </div>

          {/* Route arrow */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold"
              style={{ background: 'var(--orange-dim)', color: 'var(--orange)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
              Across routes
            </div>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* You receive */}
          <div className="rounded-xl p-3.5 space-y-1" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>YOU RECEIVE (vault shares)</span>
              {loading && (
                <div className="w-3 h-3 rounded-full border-2 animate-spin-slow"
                  style={{ borderColor: 'var(--blue)', borderTopColor: 'transparent' }} />
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold" style={{ color: loading ? 'var(--muted)' : 'var(--text)' }}>
                {loading ? '...' : outputAmount ?? '0.0000'}
              </span>
              <span className="text-sm font-bold" style={{ color: vault.color }}>
                {vault.shareToken}
              </span>
            </div>
            {minOutputAmount && !loading && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Min received: {minOutputAmount} {vault.shareToken}
              </div>
            )}
          </div>

          {/* Quote details */}
          {quote && !loading && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg p-2.5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--muted)' }} className="mb-0.5">Bridge fee</div>
                <div className="font-bold" style={{ color: 'var(--text)' }}>
                  {feeUsd ? `~$${parseFloat(feeUsd).toFixed(4)}` : '--'}
                </div>
              </div>
              <div className="rounded-lg p-2.5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--muted)' }} className="mb-0.5">Fill time</div>
                <div className="font-bold" style={{ color: 'var(--green)' }}>
                  ~{fillTime ?? 2}s
                </div>
              </div>
            </div>
          )}

          {quoteError && (
            <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(255,100,100,0.1)', color: '#ff8080' }}>
              {quoteError}
            </div>
          )}

          {/* Success state */}
          {txStatus === 'success' && (
            <div className="rounded-xl p-4 text-center space-y-2"
              style={{ background: 'var(--green-dim)', border: '1px solid rgba(90,200,120,0.3)' }}>
              <div className="text-2xl">✓</div>
              <div className="font-bold text-sm" style={{ color: 'var(--green)' }}>Deposit submitted!</div>
              {txHash && (
                <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer"
                  className="text-xs underline" style={{ color: 'var(--muted-light)' }}>
                  View on Etherscan
                </a>
              )}
            </div>
          )}

          {/* CTA Button */}
          {txStatus !== 'success' && (
            <button
              onClick={address ? handleDeposit : undefined}
              disabled={!quote || loading || txStatus !== 'idle'}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={!address
                ? { background: 'var(--border)', color: 'var(--muted)', cursor: 'not-allowed' }
                : !quote || loading
                  ? { background: 'var(--border)', color: 'var(--muted)', cursor: 'not-allowed' }
                  : { background: vault.color, color: '#fff', cursor: 'pointer' }
              }>
              {!address
                ? 'Connect wallet to deposit'
                : loading
                  ? 'Fetching quote...'
                  : txStatus === 'switching'
                    ? `Switching to ${selectedChain.name}...`
                    : txStatus === 'approving'
                      ? 'Approving token...'
                      : txStatus === 'depositing'
                        ? 'Submitting deposit...'
                        : txStatus === 'error'
                          ? 'Error — try again'
                          : needsChainSwitch
                            ? `Switch to ${selectedChain.name} and deposit`
                            : !quote
                              ? 'Enter amount to get quote'
                              : `Deposit into ${vault.name}`
              }
            </button>
          )}

          {/* Disclaimer */}
          <p className="text-center text-[10px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            Not available to U.S. persons or restricted jurisdictions. Not financial advice.
            Vault deposits have a 72h withdrawal window.
          </p>
        </div>
      </div>
    </div>
  )
}
