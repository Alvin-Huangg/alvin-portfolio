'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AppleProjectDetail from '@/components/AppleProjectDetail'
import GroceriesProjectDetail from '@/components/GroceriesProjectDetail'

const projects = [
  {
    id: 'nguon',
    meta: '01 / market research',
    title: 'Nguồn Coffee: Market Analysis',
    desc: 'The research foundation behind AKRO. Full 13-section market analysis for a Vietnamese specialty café + co-working concept in Irvine, CA. TAM/SAM/SOM, competitive mapping, site scoring, 3-year P&L. 39 citations.',
    metrics: [{ val: '$109M', label: 'SAM identified' }, { val: '7.90/10', label: 'site score' }, { val: 'Mo. 14', label: 'break-even' }],
    protected: false,
    tags: ['market research','TAM/SAM/SOM','competitive analysis','site selection','financial modelling','pricing strategy','SWOT'],
    detail: `<p>The research foundation that became AKRO. I identified a white space in the Irvine, CA market: no competitor combines specialty-grade Vietnamese coffee, cultural identity, and a purpose-built co-working workspace. So I built a full market analysis to validate whether it was real.</p><p>13 sections, 39 citations. TAM/SAM/SOM, competitive mapping across 7 candidate markets, customer segmentation, pricing strategy, financial benchmarking, and demand validation. This was Phase 1 of what eventually became AKRO.</p>`,
    detailMetrics: [{ val: '$47.8B', label: 'TAM specialty coffee' }, { val: '$109M', label: 'SAM Irvine' }, { val: '7.90/10', label: 'site score' }, { val: 'Mo. 14', label: 'break-even' }],
    docs: [],
    findings: [
      { key: 'white space', val: 'No competitor in Irvine or OC combines specialty coffee + Vietnamese culture + workspace' },
      { key: 'site pick', val: 'UCI-adjacent Irvine scored highest across 7 evaluated markets' },
      { key: 'demand base', val: '240K Vietnamese in OC, 37K UCI students, $129K median income' },
      { key: 'revenue model', val: 'Dual streams: café + workspace memberships ($99 to $150/mo)' },
      { key: 'unit economics', val: '65 to 70% gross margin; 19.8% net margin by Year 3' },
    ],
  },
  {
    id: 'amazon',
    meta: '02 / amazon, operations + automation',
    title: 'ML Automation Initiative',
    desc: 'Spearheaded an ML automation program at Amazon improving accuracy to 99% and reducing cycle time by 200%.',
    metrics: [{ val: '99%', label: 'accuracy' }, { val: '200%', label: 'cycle time reduction' }],
    protected: true,
    tags: ['machine learning','Python','process automation','operations'],
    detail: `<p>Identified a high-volume manual classification process in Amazon's outbound operations that was running at roughly 15% error rate with multi-hour cycle times. I owned the problem end-to-end: data extraction, feature engineering, model training, validation, and production rollout.</p><p>Built in Python. The model hit 99% accuracy in production and eliminated the manual review bottleneck entirely, cutting cycle time by 200%. I coordinated the rollout with the ops team and monitored performance through the stabilisation period to ensure the gains held.</p>`,
    detailMetrics: [{ val: '99%', label: 'production accuracy' }, { val: '200%', label: 'cycle time reduction' }, { val: '~15%', label: 'prior error rate' }],
    docs: [],
    findings: [
      { key: 'problem', val: 'Manual classification running at ~15% error rate with multi-hour cycle times in outbound ops' },
      { key: 'approach', val: 'End-to-end Python pipeline: data extraction, feature engineering, model training, deployment, monitoring' },
      { key: 'accuracy', val: '99% in production — manual review bottleneck eliminated entirely' },
      { key: 'cycle time', val: '200% reduction; ops team redirected to higher-value workflow management' },
      { key: 'ownership', val: 'Sole builder and rollout coordinator; monitored performance through stabilisation' },
    ],
  },
  {
    id: 'warehouse',
    meta: '03 / amazon, warehouse ops',
    title: 'Inventory Tracking System',
    desc: "Implemented a new warehouse inventory tracking system at Amazon's Edison, NJ facility, cutting product locate time and improving accuracy across the floor.",
    metrics: [{ val: '20%', label: 'faster locating' }, { val: '15%', label: 'accuracy gain' }, { val: '30%', label: 'fewer accidents' }],
    protected: true,
    tags: ['warehouse ops','inventory management','process improvement','safety'],
    detail: `<p>The Edison, NJ fulfillment facility had no consistent inventory location system. Associates were relying on memory and informal labeling, leading to locate delays, scanning errors, and equipment conflicts on the floor that were driving up injury risk.</p><p>I mapped the full inventory flow, identified the failure points, and deployed a structured location system with standardised bin labeling and real-time scan validation. Separately, I pitched and project-managed a dedicated equipment zone to remove foot traffic conflicts from active pick paths.</p>`,
    detailMetrics: [{ val: '20%', label: 'faster locating' }, { val: '15%', label: 'accuracy gain' }, { val: '30%', label: 'fewer accidents' }, { val: '25%', label: 'equipment utilisation' }],
    docs: [],
    findings: [
      { key: 'problem', val: 'No structured location system — associates relying on memory, informal labeling, inconsistent scanning' },
      { key: 'tracking fix', val: 'Standardised bin labeling and real-time scan validation deployed across the floor' },
      { key: 'equipment zone', val: 'Pitched and project-managed a dedicated equipment zone, removing conflicts from active pick paths' },
      { key: 'safety result', val: 'Equipment-related accidents down 30%; utilisation up 25%' },
      { key: 'ops result', val: 'Product locate time down 20%; inventory accuracy up 15%' },
    ],
  },
  {
    id: 'nori',
    meta: '04 / entrepreneurship + operations',
    title: 'Nori Japan: Restaurant Operations',
    desc: 'Founded and operate a Japanese fast food restaurant in Tucson. Full ownership of supply chain, vendor relationships, health compliance, staffing, and daily operations.',
    metrics: [{ val: '2024', label: 'founded' }, { val: '✓', label: 'consistent health rating' }],
    protected: false,
    tags: ['entrepreneurship','supply chain','vendor management','operations','compliance'],
    detail: `<p>Founded and operate Nori Japan, a Japanese fast food restaurant in Tucson, AZ. I run every part of it: supply chain, vendor sourcing, inventory management, staffing, and compliance.</p><p>Running a restaurant is the most honest operations classroom there is. Every system you build gets stress-tested every single day.</p>`,
    detailMetrics: [{ val: '2024', label: 'founded' }, { val: '✓', label: 'consistent health rating' }],
    findings: [],
    docs: [],
  },
  {
    id: 'groceries',
    meta: '05 / product management · visa hackathon',
    title: 'Groceries for Good',
    desc: 'Led product management for Team EternalGarden at the Visa Hackathon. Designed a sustainability grocery app using anonymised payment data — user research, competitive analysis, persona synthesis, and three scoped MVPs.',
    metrics: [{ val: '4', label: 'user interviews' }, { val: '8', label: 'competitors mapped' }, { val: '3', label: 'MVPs scoped' }],
    protected: false,
    tags: ['product management','UX research','hackathon','sustainability','fintech','gamification'],
    detail: '',
    detailMetrics: [],
    findings: [],
    docs: [
      { label: 'Full Case Study', file: '/projects/Groceries_for_Good_Case_Study.pdf', type: 'pdf' },
      { label: 'Figma Board — Team EternalGarden', file: 'https://www.figma.com/board/EjD75Sf7QPIEtvuMPIgzij/Visa-Hackathon-Team-EternalGarden?node-id=0-1&t=RYpsfYewtmIDnu46-1', type: 'figma' },
    ],
  },
  {
    id: 'apple',
    meta: '06 / strategy & supply chain analysis',
    title: 'Apple: Supply Chain Diversification',
    desc: 'Strategic advisory analyzing Apple\'s 88% China concentration risk. Weighted risk scorecard across 5 geographies, options evaluation across India/Vietnam/Mexico, a 3-year phased recommendation, and a $2.1B capex scenario model.',
    metrics: [{ val: '4.2/5.0', label: 'China risk score' }, { val: '$5.8B', label: 'cost delta at 20% shift' }, { val: 'Yr 4', label: 'payback' }],
    protected: false,
    tags: ['supply chain','strategy','risk analysis','financial modelling','scenario planning','operations'],
    detail: `<p>A full strategic advisory on Apple's supply chain concentration risk. With ~88% of iPhone assembly in China and 100% of custom silicon at TSMC in Taiwan, I mapped three compounding risks — trade policy exposure ($8–12B annual if unmitigated), cross-strait semiconductor risk, and operational concentration — and built the case for a phased response.</p><p>The analysis includes a weighted risk scorecard across 5 geographies, an options evaluation of India, Vietnam, and Mexico, a 3-year phased implementation roadmap, and a full financial model with scenario analysis. Deliverables: 12-slide strategy deck, Excel risk scorecard + scenario model, and a board memo written in Pyramid Principle format.</p>`,
    detailMetrics: [
      { val: '88%', label: 'iPhone assembly in China' },
      { val: '4.2/5.0', label: 'China risk score' },
      { val: '4.8/5.0', label: 'Taiwan chip risk' },
      { val: '$5.8B', label: 'peak cost at 20% shift' },
      { val: '$8–12B', label: 'tariff exposure (no action)' },
      { val: 'Yr 4', label: 'payback vs. do-nothing' },
    ],
    findings: [
      { key: 'core risk', val: 'Three compounding single-points-of-failure: trade policy, Taiwan semiconductors, and Zhengzhou-style operational concentration' },
      { key: 'risk scores', val: 'China assembly 4.2/5.0 · Taiwan chips 4.8/5.0 — semiconductor risk is higher urgency than assembly' },
      { key: 'recommendation', val: 'Phased 20% shift to India by 2027 — $2.1B Phase 1 capex + $500M Supplier Development Fund' },
      { key: 'cost model', val: 'Peak diversification cost $5.8B/yr vs. $8–12B tariff exposure — lower-cost path by Year 4' },
      { key: 'India rationale', val: 'Only viable large-scale alternative: 1.4B labor pool, PLI subsidies, improving ecosystem; Vietnam/Mexico limited to non-iPhone near-term' },
      { key: 'deliverables', val: '12-slide strategy deck, weighted risk scorecard, 3-scenario financial model, board memo (Pyramid Principle)' },
    ],
    docs: [
      { label: 'Strategy Deck', file: '/projects/Apple_Supply_Chain_Strategy_Deck.pdf', type: 'pdf' },
      { label: 'Research & Supporting Docs', file: '/projects/Apple_Deck_Full_Research_and_Supporting_Docs.pdf', type: 'pdf' },
    ],
  },
]

// Projects to surface at the top of the list, in this order.
const PINNED = ['groceries', 'apple']
const pinRank = (id: string) => {
  const i = PINNED.indexOf(id)
  return i === -1 ? PINNED.length : i
}
// Stable sort: pinned ids first (in PINNED order), everything else untouched.
const orderedProjects = [...projects].sort((a, b) => pinRank(a.id) - pinRank(b.id))

// Drop any hardcoded "0N / " prefix so we can renumber by display position.
const metaLabel = (meta: string) => meta.replace(/^\d+\s*\/\s*/, '')

function ProjectsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selected = searchParams.get('id')

  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const selectProject = (id: string) => router.push(`/projects?id=${id}`, { scroll: false })
  const clearProject = () => router.push('/projects', { scroll: false })

  const handleClick = (id: string, isProtected: boolean) => {
    if (isProtected && !unlocked) {
      setPendingId(id)
      setShowPw(true)
      return
    }
    selectProject(id)
  }

  const checkPw = async () => {
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      if (res.ok) {
        setUnlocked(true)
        setShowPw(false)
        if (pendingId) selectProject(pendingId)
        setPendingId(null)
        setPw('')
      } else {
        setPwError(true)
        setPw('')
      }
    } catch {
      setPwError(true)
      setPw('')
    }
  }

  const proj = projects.find(p => p.id === selected)

  return (
    <div className="animate-fade-up">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-7">other projects</h1>

      {!selected ? (
        <div className="max-w-[520px] xl:max-w-[680px] 2xl:max-w-[780px] 3xl:max-w-[900px]">
          {orderedProjects.map((p, i) => (
            <div
              key={p.id}
              onClick={() => handleClick(p.id, p.protected)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleClick(p.id, p.protected) }}
              className={`py-4 px-2 border-b border-neutral-100 dark:border-neutral-900 cursor-pointer border-l-2 border-l-transparent hover:border-l-accent hover:bg-accent/5 rounded-r-sm transition-all duration-150 group ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}
            >
              <p className="text-[12px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mb-1">{String(i + 1).padStart(2, '0')} / {metaLabel(p.meta)}</p>
              <p className="text-[16px] font-medium mb-1.5 group-hover:text-accent transition-colors">
                {PINNED.includes(p.id) && <span className="mr-1.5">📌</span>}
                {p.title}
                {p.protected && !unlocked && <span className="text-[12px] text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-full px-2 py-0.5 ml-2">available on request</span>}
              </p>
              <p className="text-[15px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[400px]">{p.desc}</p>
              <div className="flex gap-6 mt-2.5">
                {p.metrics.map(m => (
                  <div key={m.label}>
                    <span className="font-mono text-[18px] text-accent block">{m.val}</span>
                    <span className="text-[12px] text-neutral-400 dark:text-neutral-600">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : proj ? (
        <div className="max-w-[520px] xl:max-w-[680px] 2xl:max-w-[780px] 3xl:max-w-[900px] animate-fade-up">
          <button onClick={clearProject} className="text-[13px] text-neutral-400 hover:text-accent mb-7 flex items-center gap-1 transition-colors hover:-translate-x-0.5 transform duration-150 focus-visible:ring-2 focus-visible:ring-accent rounded">
            ← back to projects
          </button>
          <p className="text-[12px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mb-1">{metaLabel(proj.meta)}</p>
          <h2 className="text-[21px] font-medium mb-6 leading-tight">{PINNED.includes(proj.id) && <span className="mr-1.5">📌</span>}{proj.title}</h2>

          {proj.id === 'apple' ? (
            <div className="mb-8">
              <AppleProjectDetail />
            </div>
          ) : proj.id === 'groceries' ? (
            <div className="mb-8">
              <GroceriesProjectDetail />
            </div>
          ) : (
            <>
              <div className="text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9] space-y-3 mb-6"
                dangerouslySetInnerHTML={{ __html: proj.detail }} />
              <div className="flex gap-10 py-4 border-t border-b border-neutral-100 dark:border-neutral-900 mb-6 flex-wrap">
                {proj.detailMetrics.map(m => (
                  <div key={m.label}>
                    <span className="font-mono text-[20px] text-accent block">{m.val}</span>
                    <span className="text-[12px] text-neutral-400 dark:text-neutral-600 tracking-wider">{m.label}</span>
                  </div>
                ))}
              </div>
              {proj.findings.length > 0 && (
                <>
                  <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-3">key findings</p>
                  <div className="mb-6">
                    {proj.findings.map((f, i) => (
                      <div key={f.key} className={`flex gap-4 py-2.5 border-b border-neutral-100 dark:border-neutral-900 text-[15px] hover:bg-accent/5 rounded-sm transition-colors ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}>
                        <span className="text-neutral-400 dark:text-neutral-600 min-w-[100px] flex-shrink-0">{f.key}</span>
                        <span className="text-neutral-500 dark:text-neutral-400">{f.val}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {proj.tags.map(t => (
              <span key={t} className="text-[13px] px-2.5 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-accent/10 hover:border-accent/40 hover:text-accent transition-all cursor-default">{t}</span>
            ))}
          </div>

          {proj.docs && proj.docs.length > 0 && (
            <div className="pt-5 border-t border-neutral-100 dark:border-neutral-900">
              <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-3">documents</p>
              <div className="flex flex-col gap-2">
                {proj.docs.map(doc => {
                  const isExternal = doc.file.startsWith('http')
                  return (
                    <a
                      key={doc.file}
                      href={doc.file}
                      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
                      className="flex items-center gap-3 py-2.5 px-3 border border-neutral-200 dark:border-neutral-800 rounded-md hover:border-accent/40 hover:bg-accent/5 transition-all group"
                    >
                      <span className="text-[10px] uppercase tracking-wider font-medium text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded px-1.5 py-0.5 flex-shrink-0">{doc.type}</span>
                      <span className="text-[15px] text-neutral-700 dark:text-neutral-300 group-hover:text-accent transition-colors">{doc.label}</span>
                      <span className="ml-auto text-neutral-400 group-hover:text-accent transition-colors text-[13px]">{isExternal ? '→' : '↓'}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {showPw && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 w-80">
            <p className="text-[16px] font-medium mb-1">protected content</p>
            <p className="text-[15px] text-neutral-400 dark:text-neutral-600 mb-5 leading-relaxed">this section contains proprietary Amazon work. enter the password to continue.</p>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError(false) }}
              onKeyDown={e => e.key === 'Enter' && checkPw()}
              placeholder="password"
              autoFocus
              className="w-full text-[16px] px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 outline-none focus:border-accent mb-3 font-light"
            />
            {pwError && <p className="text-[13px] text-red-500 mb-2">incorrect password, try again</p>}
            <button onClick={checkPw} className="w-full py-2 bg-accent text-white text-[15px] rounded-md hover:bg-accent-mid transition-colors mb-2">unlock</button>
            <button onClick={() => { setShowPw(false); setPw(''); setPwError(false) }} className="w-full text-[13px] text-neutral-400 text-center cursor-pointer hover:text-neutral-600 transition-colors">cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectsPageInner />
    </Suspense>
  )
}
