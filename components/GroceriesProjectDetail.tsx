'use client'

import React from 'react'

function SlideCard({ section, title, children }: { section: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex-shrink-0">{section}</span>
        <span className="text-[13px] text-neutral-600 dark:text-neutral-400">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

const CHECK = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="6" cy="6" r="5.5" fill="#3a7d4420" stroke="#3a7d44" strokeWidth="1"/>
    <polyline points="3.5,6.2 5.2,7.8 8.5,4.5" stroke="#3a7d44" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)

const DASH = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="6" cy="6" r="5.5" fill="#e5e5e520" stroke="#d4d4d4" strokeWidth="1"/>
    <line x1="3.5" y1="6" x2="8.5" y2="6" stroke="#a3a3a3" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

export default function GroceriesProjectDetail() {
  return (
    <div className="space-y-8 text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9]">

      {/* Narrative */}
      <div className="space-y-3">
        <p>
          Built during the Visa Hackathon in June 2024, Groceries for Good is a sustainability-focused grocery app
          that uses anonymised payment and transaction data to help shoppers understand the environmental footprint
          of their purchases, discover greener alternatives, and earn rewards for eco-friendly choices.
        </p>
        <p>
          I served as Project Manager for Team EternalGarden — a cross-functional team spanning research, design,
          and development. I defined the sprint structure, ran user research, facilitated synthesis workshops,
          mapped the competitive landscape, and owned the final presentation — all inside a tight hackathon
          timeline judged on Feasibility, Innovation, Desirability, and Scalability.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { val: '4',       label: 'User interviews',         sub: 'distinct archetypes' },
          { val: '8',       label: 'Competitors mapped',      sub: 'strengths, gaps, white space' },
          { val: '3',       label: 'MVPs scoped',             sub: 'receipt · gamification · vendor' },
          { val: '4',       label: 'Sprints in June 2024',    sub: 'research → design → dev → demo' },
        ].map(m => (
          <div key={m.label} className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-3.5">
            <div className="text-[28px] font-medium text-neutral-900 dark:text-neutral-100 leading-none mb-1.5">{m.val}</div>
            <div className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">{m.label}</div>
            <div className="text-[11px] text-neutral-400 dark:text-neutral-600">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <SlideCard section="Section 01" title="Mission & Challenge">
        <div className="bg-accent/8 border border-accent/20 rounded-md px-5 py-4 mb-5">
          <p className="text-[11px] uppercase tracking-widest text-accent font-medium mb-2">Mission statement</p>
          <p className="text-[16px] text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
            "Revolutionise the use of payments data to drive sustainable outcomes and enable consumers to make informed choices."
          </p>
        </div>
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-4">
          Visa's challenge: design an app that helps grocery shoppers understand their environmental impact,
          learn to reduce it, and be rewarded through a gamified experience. Judged on four criteria:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { criterion: 'Feasibility',   def: 'Can it be built given time, resources, and technology?' },
            { criterion: 'Innovation',    def: 'Is this a unique approach or genuinely new solution?' },
            { criterion: 'Desirability',  def: 'Is it attractive to users and does it meet an unmet need?' },
            { criterion: 'Scalability',   def: 'Can it scale and can success be measured over time?' },
          ].map(c => (
            <div key={c.criterion} className="bg-neutral-50 dark:bg-neutral-900 rounded p-3">
              <p className="text-[12px] font-medium text-accent mb-0.5">{c.criterion}</p>
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400 leading-snug">{c.def}</p>
            </div>
          ))}
        </div>
      </SlideCard>

      {/* Secondary Research */}
      <SlideCard section="Section 02" title="Secondary Research — Environmental Landscape">
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
          I coordinated a desk research phase before talking to users to give the team a shared factual foundation.
          Five impact categories in the grocery supply chain were identified:
        </p>
        <div className="space-y-0">
          {[
            { icon: '🚛', label: 'Transportation',      detail: 'Long-distance food transport via fossil fuels; energy-intensive cold chain logistics' },
            { icon: '♻️', label: 'Waste Generation',    detail: 'Food loss at every stage farm-to-fork; excessive plastic, cardboard, and Styrofoam packaging' },
            { icon: '🧪', label: 'Chemical Pollution',  detail: 'Pesticides and fertilisers contaminating soil, waterways, and ecosystems' },
            { icon: '🌿', label: 'Biodiversity Loss',   detail: 'Monoculture farming and habitat destruction reducing ecosystem resilience' },
            { icon: '🌡️', label: 'Climate Change',      detail: 'Disrupts agriculture through temperature shifts, altered precipitation, and extreme weather' },
          ].map((item, i) => (
            <div key={item.label} className={`flex gap-3 py-2.5 border-b border-neutral-100 dark:border-neutral-900 ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}>
              <span className="text-[16px] flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <span className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300">{item.label} — </span>
                <span className="text-[13px] text-neutral-500 dark:text-neutral-400">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pl-4 border-l-[2px] border-accent/50">
          <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
            Grocery shopping sits at the intersection of all five harms. Individual choices, multiplied at scale,
            are a significant lever — if consumers have the right information and incentives.
          </p>
        </div>
      </SlideCard>

      {/* User Research */}
      <SlideCard section="Section 03" title="User Research — 4 In-Depth Interviews">
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-4">
          I led planning and facilitation of four in-depth interviews across distinct user archetypes.
          Each interview covered five areas:
        </p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { area: 'Motivations',         detail: 'What drives sustainable shopping behaviour' },
            { area: 'Prior experiences',   detail: 'Sustainable discovery and past friction points' },
            { area: 'Price vs. values',    detail: 'Sustainability relative to cost and convenience' },
            { area: 'Barriers',            detail: 'Challenges and pain points encountered' },
            { area: 'Goals & desires',     detail: 'Improvements users wanted in grocery experience' },
            { area: 'Future outlook',      detail: 'Long-term aspirations around sustainable living' },
          ].map(item => (
            <div key={item.area} className="flex gap-2 py-2 border-b border-neutral-100 dark:border-neutral-900">
              <span className="text-accent text-[13px] flex-shrink-0 mt-0.5">→</span>
              <div>
                <span className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300">{item.area}</span>
                <span className="text-[12px] text-neutral-400 dark:text-neutral-600 block leading-snug">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </SlideCard>

      {/* Personas */}
      <SlideCard section="Section 04" title="Analysis & Synthesis — User Personas">
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-4">
          Four representative personas built from interview synthesis — used as the team's decision-making compass throughout design and development.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              name: 'Alex', age: 28, type: 'Sustainability Coordinator',
              goals: ['Advocate sustainable practices in community', 'Inspire eco-friendly choices in others'],
              challenges: ['Navigating overwhelming sustainability info', 'Limited eco-friendly product visibility'],
              insight: 'Believes in community engagement for meaningful environmental change',
              color: '#3a7d44',
            },
            {
              name: 'Maya', age: 31, type: 'Eco-Conscious Millennial',
              goals: ['Lead by example in sustainable living', 'Inspire eco-friendly choices in everyday shopping'],
              challenges: ['Finding affordable eco-friendly options', 'Balancing values with traditional grocery stores'],
              insight: 'Driven by values; uses consumer choices as a form of activism',
              color: '#0891b2',
            },
            {
              name: 'David', age: 42, type: 'Budget-Conscious Parent',
              goals: ['Reduce family environmental footprint', 'Make eco choices without compromising budget'],
              challenges: ['Balancing sustainability with budget constraints', 'Limited access to affordable eco options'],
              insight: 'Committed to sustainability but practicality and price come first',
              color: '#d97706',
            },
            {
              name: 'Emily', age: 22, type: 'Gen Z Climate Activist',
              goals: ['Reduce footprint through shopping choices', 'Contribute to a healthier planet for future generations'],
              challenges: ['Navigating info overload on sustainability', 'Frustration with plastic and misleading eco claims'],
              insight: 'Highly values transparency; wants data-backed, accessible eco choices',
              color: '#7c3aed',
            },
          ].map(p => (
            <div key={p.name} className="border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
              <div className="px-3.5 py-2.5 flex items-center justify-between" style={{ backgroundColor: `${p.color}12` }}>
                <div>
                  <span className="text-[14px] font-medium text-neutral-800 dark:text-neutral-200">{p.name}</span>
                  <span className="text-[12px] text-neutral-500 dark:text-neutral-400 ml-1.5">· {p.age}</span>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: p.color, backgroundColor: `${p.color}20` }}>{p.type}</span>
              </div>
              <div className="p-3.5 space-y-2.5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Goals</p>
                  {p.goals.map((g, i) => (
                    <div key={i} className="flex gap-1.5 text-[12px] text-neutral-500 dark:text-neutral-400 leading-snug mb-1"><CHECK />{g}</div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Challenges</p>
                  {p.challenges.map((c, i) => (
                    <div key={i} className="flex gap-1.5 text-[12px] text-neutral-500 dark:text-neutral-400 leading-snug mb-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 mt-0.5">
                        <circle cx="6" cy="6" r="5.5" fill="#ef444420" stroke="#ef4444" strokeWidth="1"/>
                        <line x1="4" y1="4" x2="8" y2="8" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
                        <line x1="8" y1="4" x2="4" y2="8" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                      {c}
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900">
                  <p className="text-[11px] text-neutral-400 italic leading-snug">"{p.insight}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SlideCard>

      {/* Competitor Analysis */}
      <SlideCard section="Section 05" title="Competitor Analysis — 8 Apps Mapped">
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-4">
          Mapped eight competitors across key capability dimensions. The analysis revealed a clear white space:
          no existing product combined payment-linked carbon tracking, personalised alternatives, and a gamified
          rewards layer in a single consumer app.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-900">
                <th className="text-left text-neutral-400 font-medium pb-2 pr-4 w-28">App</th>
                {['Payment-linked', 'Carbon tracking', 'Alternatives', 'Gamification', 'Community', 'Vendor data'].map(h => (
                  <th key={h} className="text-center text-neutral-400 font-medium pb-2 px-2 leading-tight">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Olio',           vals: [false, false, false, false, true,  false] },
                { name: 'Giki',           vals: [false, true,  true,  false, false, false] },
                { name: 'Too Good to Go', vals: [false, false, false, true,  false, false] },
                { name: 'FoodPrint',      vals: [false, true,  false, false, false, false] },
                { name: 'Greenery',       vals: [false, false, true,  false, false, false] },
                { name: 'Barcoo',         vals: [false, false, true,  false, false, false] },
                { name: 'Karma',          vals: [false, false, false, true,  false, false] },
                { name: 'Groceries for Good', vals: [true, true, true, true, true, true], highlight: true },
              ].map(row => (
                <tr
                  key={row.name}
                  className={`border-b border-neutral-100 dark:border-neutral-900 last:border-0 ${row.highlight ? 'bg-accent/5' : ''}`}
                >
                  <td className={`py-2 pr-4 text-[12px] font-medium ${row.highlight ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    {row.name}
                  </td>
                  {row.vals.map((v, i) => (
                    <td key={i} className="py-2 px-2 text-center">
                      <div className="flex justify-center">{v ? <CHECK /> : <DASH />}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-neutral-400 mt-3 italic">
          Groceries for Good is the only product covering all six dimensions — the white space identified from this analysis.
        </p>
      </SlideCard>

      {/* Ideation */}
      <SlideCard section="Section 06" title="Ideation — Brainstorm & Rolestorming">
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-4">
          I facilitated two structured exercises — a 10-min brainstorm and a 10-min rolestorming session —
          using a digital sticky-note board. Top ideas that made it into the final product:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { idea: 'Card-linked flagging', detail: 'Flag non-sustainable purchases and redirect credits to eco projects via Visa integration' },
            { idea: 'Receipt carbon scan', detail: 'Scan receipt to surface carbon footprint with Ecológiq data for each item' },
            { idea: 'Tree reward system', detail: 'Sustainability points grow like a tree; redeem for eco-friendly incentives' },
            { idea: 'Visa loyalty bridge', detail: 'Convert existing Visa loyalty points into sustainable choice rewards' },
            { idea: 'Community leaderboards', detail: 'Friends and family competing on sustainability scores' },
            { idea: 'Monthly AI insights', detail: 'AI-generated monthly recommendations for reducing your carbon footprint' },
            { idea: 'Vendor emissions portal', detail: 'Vendors submit Scope 1, 2, 3 data to enrich product-level sustainability ratings' },
            { idea: 'Local farmer surfacing', detail: 'Partner with local farmers; surface them at the top of sustainable alternatives' },
          ].map(item => (
            <div key={item.idea} className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-3">
              <p className="text-[12px] font-medium text-neutral-700 dark:text-neutral-300 mb-0.5">{item.idea}</p>
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400 leading-snug">{item.detail}</p>
            </div>
          ))}
        </div>
      </SlideCard>

      {/* MVP */}
      <SlideCard section="Section 07" title="MVP Feature Prioritisation">
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-4">
          I led the team through a prioritisation exercise to define three delivery-scoped MVPs within the hackathon timeline:
        </p>
        <div className="space-y-3">
          {[
            {
              mvp: 'MVP 1', color: '#3a7d44',
              title: 'Receipt Submission + Carbon Tracking',
              steps: [
                'OCR / AI receipt scanning to extract items, quantities, and prices',
                'Carbon footprint database: associate each product with emissions data',
                'Sustainable alternatives engine: recommend greener swaps based on purchase history',
                'Dashboard: display carbon data clearly with a feedback loop on suggestions',
              ],
            },
            {
              mvp: 'MVP 2', color: '#d97706',
              title: 'Gamification & Rewards Programme',
              steps: [
                'Points system: earn for sustainable purchases, receipt submissions, and eco-actions',
                'Challenges and quests: weekly sustainability targets (e.g. reduce carbon by 10%)',
                'Leaderboards and badges: friendly competition and milestone recognition',
                'Redeemable rewards: discounts, free products, exclusive sustainability content',
              ],
            },
            {
              mvp: 'MVP 3', color: '#6b7280',
              title: 'Vendor Scope 1, 2 & 3 Data Portal',
              steps: [
                'Secure vendor login portal with clear Scope 1, 2, 3 data upload interface',
                'Data validation checks for accuracy and completeness',
                'Enhanced recommendations: product-specific ratings powered by vendor data',
                'Vendor insights: show sustainability performance and improvement suggestions',
              ],
            },
          ].map(m => (
            <div key={m.mvp} className="border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded" style={{ color: m.color, backgroundColor: `${m.color}18` }}>{m.mvp}</span>
                <span className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300">{m.title}</span>
              </div>
              <ul className="p-4 space-y-1.5">
                {m.steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    <span style={{ color: m.color }} className="flex-shrink-0 mt-0.5">→</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SlideCard>

      {/* Sprint Structure */}
      <SlideCard section="Section 08" title="Product Development Plan — Sprint Structure">
        <div className="space-y-0">
          {[
            { sprint: 'Sprint 1', dates: 'Jun 3 – 6',   focus: 'Data Gathering & User Research',                   pct: 25 },
            { sprint: 'Sprint 2', dates: 'Jun 6 – 11',  focus: 'Analysis, Synthesis & Design Iteration',           pct: 50 },
            { sprint: 'Sprint 3', dates: 'Jun 10 – 11', focus: 'User Testing, Dev Contact & Handoff',               pct: 75 },
            { sprint: 'Sprint 4', dates: 'Jun 11 – 20', focus: 'Development, User Testing & Final Presentation',   pct: 100 },
          ].map((s, i) => (
            <div key={s.sprint} className={`flex items-center gap-4 py-3 border-b border-neutral-100 dark:border-neutral-900 ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}>
              <span className="text-[12px] font-medium text-accent w-16 flex-shrink-0">{s.sprint}</span>
              <span className="text-[12px] text-neutral-400 dark:text-neutral-600 w-24 flex-shrink-0">{s.dates}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mb-1.5 truncate">{s.focus}</p>
                <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SlideCard>

      {/* Reflections */}
      <SlideCard section="Section 09" title="Reflections & Key PM Takeaways">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-3">What worked well</p>
            {[
              'Front-loading research before ideation — all decisions were evidence-led',
              'Persona-driven design kept the team aligned on user needs throughout',
              'Mapping 8 competitors early revealed the genuine white space we occupied',
              'Sprint structure maintained momentum under time pressure',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug mb-2">
                <span className="text-accent flex-shrink-0 mt-0.5">+</span>{item}
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-3">Challenges overcome</p>
            {[
              'Information overload required tight synthesis to extract signal from noise',
              'Balancing feature breadth against hackathon timeline meant hard prioritisation calls',
              'Aligning research, design, and dev required clear shared documentation throughout',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug mb-2">
                <span className="text-neutral-400 flex-shrink-0 mt-0.5">−</span>{item}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-3">Key takeaways</p>
          {[
            'User research is non-negotiable even under time pressure — it de-risks assumptions and sharpens every solution',
            'A clear mission statement is a north star: "Revolutionise payment data for sustainable outcomes" kept every decision aligned',
            'Competitor analysis is most valuable when synthesised into a gap statement, not just a feature comparison',
            'Gamification works best when tied to genuine user values — not as a superficial overlay',
          ].map((item, i) => (
            <div key={i} className="flex gap-2 text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug mb-2">
              <span className="text-accent flex-shrink-0 mt-0.5">→</span>{item}
            </div>
          ))}
        </div>
      </SlideCard>

    </div>
  )
}
