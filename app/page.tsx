'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Overview from '@/components/Overview'
import EarnSection from '@/components/EarnSection'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview' | 'earn'>('overview')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'overview'
        ? <Overview onGetStarted={() => setActiveTab('earn')} />
        : <EarnSection />
      }
    </div>
  )
}
