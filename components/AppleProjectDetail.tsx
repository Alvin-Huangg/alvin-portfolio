'use client'

import React from 'react'

function SlideCard({ slide, title, children }: { slide: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex-shrink-0">{slide}</span>
        <span className="text-[13px] text-neutral-600 dark:text-neutral-400">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function RiskBar({ label, score, note }: { label: string; score: number; note: string }) {
  const pct = (score / 5) * 100
  const color =
    score >= 4.5 ? '#dc2626' :
    score >= 4   ? '#ef4444' :
    score >= 3   ? '#f97316' :
    score >= 2   ? '#eab308' : '#22c55e'
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-[13px] text-neutral-500 dark:text-neutral-400 w-36 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-[13px] text-neutral-700 dark:text-neutral-300 w-12 text-right flex-shrink-0">{score.toFixed(1)} /5</span>
      <span className="text-[11px] text-neutral-400 dark:text-neutral-600 w-40 leading-tight hidden xl:block">{note}</span>
    </div>
  )
}

export default function AppleProjectDetail() {
  const scenarios = [
    { year: '2025', baseline: 0,   a: 0.8, b: 1.2 },
    { year: '2026', baseline: 1.2, a: 2.1, b: 3.0 },
    { year: '2027', baseline: 3.8, a: 3.2, b: 4.8 },
    { year: '2028', baseline: 8.4, a: 4.5, b: 5.8 },
  ]
  const maxVal = 9

  return (
    <div className="space-y-8 text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9]">

      {/* Narrative */}
      <div className="space-y-3">
        <p>
          A board-level strategic advisory on Apple's most critical operational risk: ~88% of iPhone final assembly is
          concentrated in China, and 100% of custom silicon is produced by a single fab in Taiwan. These aren't
          independent risks — they compound. A cross-strait event disrupts both simultaneously.
        </p>
        <p>
          I built this end-to-end: original research across 13 primary sources and analyst reports, a weighted risk
          scorecard across five geographies, a three-scenario financial model, and a board memo in Pyramid Principle
          format. The deck is modeled after the kind of analysis Jeff Williams' team would prepare before a board vote.
        </p>
        <p>
          The recommendation: commit $2.1B to Phase 1 India capacity by Q3 2025, target 20% iPhone assembly in India
          by 2027, and initiate parallel TSMC Arizona negotiations immediately. The do-nothing path costs $8.4B
          cumulatively by 2028. Diversification costs $5.8B — and that gap widens every year after.
        </p>
      </div>

      {/* Slide 03 — Exec Summary */}
      <SlideCard slide="Slide 03" title="Executive Summary">
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { val: '4.2 / 5.0', label: 'China risk score',        sub: 'geopolitical + concentration' },
            { val: '$5.8B',      label: 'Peak annual cost delta',  sub: '20% India shift, Year 3' },
            { val: '−17%',       label: 'Tariff exposure cut',     sub: 'at 20% shift scenario' },
            { val: 'Year 4',     label: 'Diversification payback', sub: 'vs. no-action baseline' },
          ].map(m => (
            <div key={m.label} className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-3.5">
              <div className="text-[26px] font-medium text-neutral-900 dark:text-neutral-100 leading-none mb-1.5">{m.val}</div>
              <div className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">{m.label}</div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-600">{m.sub}</div>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-neutral-400 leading-relaxed">
          Three compounding risks: trade policy escalation ($8–12B annual exposure), Taiwan cross-strait semiconductor
          risk (TSMC = 100% of Apple custom silicon), and operational concentration (Foxconn Zhengzhou assembles
          &gt;50% of global iPhones — already cost Apple ~$8B in delayed revenue in Q1 FY2023).
        </p>
      </SlideCard>

      {/* Slide 05 — Concentration */}
      <SlideCard slide="Slide 05" title="Manufacturing Concentration — iPhone Assembly by Geography">
        <div className="space-y-3 mb-5">
          {[
            { label: 'China',   pct: 88, color: '#ef4444', note: '>50% in a single building in Zhengzhou' },
            { label: 'India',   pct: 7,  color: '#3a7d44', note: 'Foxconn Tamil Nadu + Tata (growing)' },
            { label: 'Vietnam', pct: 1,  color: '#6b7280', note: 'Limited iPhone capacity' },
            { label: 'Other',   pct: 4,  color: '#9ca3af', note: 'Rest of World' },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-[13px] text-neutral-500 dark:text-neutral-400 w-14 flex-shrink-0">{row.label}</span>
              <div className="flex-1 h-6 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden relative">
                <div
                  className="h-full rounded flex items-center"
                  style={{ width: `${row.pct}%`, backgroundColor: row.color, minWidth: '2px' }}
                >
                  {row.pct > 8 && (
                    <span className="text-[12px] text-white font-medium px-2 select-none">{row.pct}%</span>
                  )}
                </div>
                {row.pct <= 8 && (
                  <span className="absolute left-[calc(4px)] top-0 h-full flex items-center text-[11px] text-neutral-400 ml-1"
                    style={{ left: `${row.pct}%` }}>
                    &nbsp;{row.pct}%
                  </span>
                )}
              </div>
              <span className="text-[12px] text-neutral-400 dark:text-neutral-600 w-48 leading-tight hidden sm:block">{row.note}</span>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-neutral-400 leading-relaxed">
          Source: US import trade records (ImportYeti), TF International Securities (Ming-Chi Kuo), Apple earnings
          commentary. Taiwan chip risk is separate and higher urgency — TSMC is 100% single-sourced with no viable
          near-term alternative.
        </p>
      </SlideCard>

      {/* Slide 06 — Risk Scorecard */}
      <SlideCard slide="Slide 06" title="Supplier Risk Scorecard — Composite Weighted Scores">
        <div className="space-y-1 mb-6">
          <RiskBar label="Taiwan (chips)"    score={4.8} note="100% single-source — highest urgency" />
          <RiskBar label="China (assembly)"  score={4.2} note="Trade + concentration + ops risk" />
          <RiskBar label="India"             score={2.4} note="Improving — PLI + two assemblers" />
          <RiskBar label="Vietnam"           score={2.3} note="Stable; limited iPhone capacity" />
          <RiskBar label="Mexico"            score={1.8} note="USMCA favorable; ecosystem early" />
        </div>
        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-3">Scoring weights</p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { dim: 'Geopolitical', wt: '40%' },
              { dim: 'Concentration', wt: '25%' },
              { dim: 'Lead time', wt: '15%' },
              { dim: 'Labor & ops', wt: '10%' },
              { dim: 'Ecosystem', wt: '10%' },
            ].map(d => (
              <div key={d.dim} className="bg-neutral-50 dark:bg-neutral-900 rounded p-2 text-center">
                <div className="text-[14px] font-medium text-accent">{d.wt}</div>
                <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{d.dim}</div>
              </div>
            ))}
          </div>
        </div>
      </SlideCard>

      {/* Slide 07 — Options */}
      <SlideCard slide="Slide 07" title="Options Evaluated — India, Vietnam, Mexico">
        <div className="space-y-3">
          {[
            {
              country: 'India',
              verdict: 'Primary recommendation',
              verdictColor: '#3a7d44',
              pros: [
                '1.4B labor pool — the only country that can absorb iPhone volumes',
                'PLI subsidies reduce effective cost premium to ~$5–8/unit at scale',
                'iPhone 16 assembled simultaneously with China (Sept 2024 milestone)',
                '$6.7B government-committed PLI scheme over 5 years',
              ],
              cons: [
                '$9–14 per-unit cost premium today (drops at scale by 2027)',
                '8–10 years to build China-equivalent component ecosystem',
              ],
            },
            {
              country: 'Vietnam',
              verdict: 'Non-iPhone only (near-term)',
              verdictColor: '#d97706',
              pros: [
                '~30–50% of AirPods already assembled here',
                '~30% of Apple Watch and growing',
                'CPTPP + RCEP — favorable tariff treatment',
              ],
              cons: [
                'Population of 97M — cannot absorb iPhone complexity at scale',
                'Tighter tolerances and more assembly steps than Vietnam can support',
              ],
            },
            {
              country: 'Mexico',
              verdict: 'Phase 3 — assess 2027–28',
              verdictColor: '#6b7280',
              pros: [
                'USMCA — duty-free for US-bound goods',
                '2-day ground vs. 3-week ocean from China',
                'Mac Pro assembled in Austin, TX — adjacent opportunity',
              ],
              cons: [
                'Electronics ecosystem not yet at Apple-grade precision',
                'Limited large-scale assembly capacity currently',
              ],
            },
          ].map(opt => (
            <div key={opt.country} className="border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900">
                <span className="text-[14px] font-medium text-neutral-800 dark:text-neutral-200">{opt.country}</span>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ color: opt.verdictColor, backgroundColor: `${opt.verdictColor}18` }}
                >
                  {opt.verdict}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">For</p>
                  <ul className="space-y-1.5">
                    {opt.pros.map((p, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug">
                        <span className="text-accent flex-shrink-0 mt-0.5">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">Against</p>
                  <ul className="space-y-1.5">
                    {opt.cons.map((c, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug">
                        <span className="text-neutral-400 flex-shrink-0 mt-0.5">−</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SlideCard>

      {/* Slide 10 — Financial Model */}
      <SlideCard slide="Slide 10" title="Financial Model — Cumulative Cost of Diversification vs. Inaction ($B)">
        <div className="flex gap-4 mb-5">
          {[
            { label: 'No action (baseline)', color: '#ef4444' },
            { label: '10% India shift',       color: '#d97706' },
            { label: '20% India shift',       color: '#3a7d44' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: l.color }} />
              <span className="text-[12px] text-neutral-500 dark:text-neutral-400">{l.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-4 h-44 mb-1">
          {scenarios.map(s => (
            <div key={s.year} className="flex-1 flex flex-col justify-end">
              <div className="flex items-end gap-1 h-36">
                <div
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: s.baseline === 0 ? '2px' : `${(s.baseline / maxVal) * 100}%`,
                    backgroundColor: '#ef4444',
                  }}
                />
                <div
                  className="flex-1 rounded-t-sm"
                  style={{ height: `${(s.a / maxVal) * 100}%`, backgroundColor: '#d97706' }}
                />
                <div
                  className="flex-1 rounded-t-sm"
                  style={{ height: `${(s.b / maxVal) * 100}%`, backgroundColor: '#3a7d44' }}
                />
              </div>
              <p className="text-[12px] text-neutral-400 text-center mt-2">{s.year}</p>
              <div className="flex gap-1 justify-center mt-1">
                <span className="text-[10px] text-red-400">${s.baseline}</span>
                <span className="text-[10px] text-neutral-300 dark:text-neutral-700">/</span>
                <span className="text-[10px] text-amber-500">${s.a}</span>
                <span className="text-[10px] text-neutral-300 dark:text-neutral-700">/</span>
                <span className="text-[10px] text-accent">${s.b}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4 mt-2">
          <p className="text-[13px] text-neutral-400 leading-relaxed">
            By 2028, the no-action path costs $8.4B cumulatively — $2.6B more than the 20% shift scenario.
            The payback crossover for Scenario A (10% shift) happens in 2027; for Scenario B (20% shift), in 2028.
            The key input: Apple ships ~225M iPhones/year. At 20% shifted to India, that's 45M units × ~$13 cost
            premium = $5.8B peak cost — still below the $8–12B tariff exposure scenario.
          </p>
        </div>
      </SlideCard>

      {/* Slide 08–09 — Roadmap */}
      <SlideCard slide="Slides 08 – 09" title="Recommended Path & Implementation Roadmap">
        <div className="space-y-3">
          {[
            {
              phase: 'Phase 1',
              period: 'Q3 2025 – Q4 2026',
              color: '#3a7d44',
              title: 'Commit to India',
              capex: '$2.1B',
              items: [
                'Foxconn Tamil Nadu expansion + Tata Electronics Hosur facility',
                '$500M Supplier Development Fund (milestone-gated disbursements)',
                'Initiate TSMC Arizona anchor capacity term sheet negotiations',
                'Target: 10% iPhone assembly in India by end of 2026',
              ],
            },
            {
              phase: 'Phase 2',
              period: '2026 – 2027',
              color: '#d97706',
              title: 'Scale & Qualify',
              capex: 'ongoing',
              items: [
                'Qualify 15–20 critical tier-2 suppliers in India',
                'Ramp India to 20% of iPhone assembly',
                '40% non-iPhone capacity expansion in Vietnam (AirPods, Watch)',
                'TSMC Arizona Phase 1 (4nm) online; 3nm negotiations underway',
              ],
            },
            {
              phase: 'Phase 3',
              period: '2027 – 2028',
              color: '#6b7280',
              title: 'Consolidate & Assess',
              capex: 'TBD',
              items: [
                'China iPhone share target: below 70% (from 88%)',
                'TSMC Arizona at 15–20% of Apple chip volume',
                'Composite risk score: 4.2 → 3.1 (validated vs. scorecard)',
                'Mexico Phase 4 feasibility assessment',
              ],
            },
          ].map(p => (
            <div key={p.phase} className="border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded"
                    style={{ color: p.color, backgroundColor: `${p.color}18` }}
                  >
                    {p.phase}
                  </span>
                  <span className="text-[14px] font-medium text-neutral-800 dark:text-neutral-200">{p.title}</span>
                </div>
                <div className="text-right">
                  <div className="text-[12px] text-neutral-500">{p.period}</div>
                  <div className="text-[11px] text-neutral-400">Capex: {p.capex}</div>
                </div>
              </div>
              <ul className="p-4 space-y-2">
                {p.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    <span style={{ color: p.color }} className="flex-shrink-0 mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SlideCard>

    </div>
  )
}
