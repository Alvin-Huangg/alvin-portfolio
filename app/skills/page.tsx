import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Skills' }

const skillGroups = [
  {
    label: 'Operations & Strategy',
    skills: [
      { name: 'supply chain strategy',        level: 'end-to-end design & optimisation',          href: '/akro',     ref: 'AKRO + Nori' },
      { name: 'process improvement',           level: 'automation, cycle time reduction',           href: '/projects', ref: 'Amazon' },
      { name: 'demand forecasting',            level: 'statistical modelling, ERP',                href: null,        ref: null },
      { name: 'pricing strategy',              level: 'menu engineering, margin optimisation',      href: '/akro',     ref: 'AKRO + Nori' },
    ],
  },
  {
    label: 'Finance & Analytics',
    skills: [
      { name: 'financial modelling',           level: 'P&L, CapEx, break-even analysis',           href: '/projects', ref: '3-year P&L' },
      { name: 'data & analytics',              level: 'Python, SQL, Power BI, Excel',              href: '/projects', ref: 'Amazon ML' },
      { name: 'market & competitive analysis', level: 'TAM/SAM/SOM, SWOT, site scoring',           href: '/projects', ref: 'Nguồn research' },
    ],
  },
  {
    label: 'Leadership & Management',
    skills: [
      { name: 'program management',            level: 'JIRA, Confluence, cross-functional teams',  href: '/projects', ref: 'Amazon' },
      { name: 'stakeholder communication',     level: 'exec reporting, KPI dashboards',            href: '/projects', ref: 'Amazon' },
    ],
  },
  {
    label: 'Entrepreneurship',
    skills: [
      { name: 'founder + operator',            level: 'AKRO Cafe (OC/LA, 2026) · Nori Japan (Tucson, 2024)', href: '/akro', ref: 'AKRO + Nori' },
    ],
  },
]

export default function SkillsPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-6">skills</h1>
      <p className="text-[15px] text-neutral-400 dark:text-neutral-600 mb-8 content-width">
        every skill below has been applied in real work — click the tag to see where.
      </p>

      <div className="content-width space-y-8">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-600 font-medium mb-2">
              {group.label}
            </p>
            <div>
              {group.skills.map((s, i) => (
                <div
                  key={s.name}
                  className={`flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-neutral-900 gap-4 group hover:bg-accent/5 rounded-sm transition-all duration-150 ${
                    i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''
                  }`}
                >
                  <span className="text-[15px] text-neutral-800 dark:text-neutral-200 group-hover:text-accent transition-colors font-normal">
                    {s.name}
                  </span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[14px] text-neutral-400 dark:text-neutral-600 text-right hidden sm:block">
                      {s.level}
                    </span>
                    {s.href && s.ref ? (
                      <Link
                        href={s.href}
                        className="text-[12px] text-accent/60 hover:text-accent border border-accent/20 hover:border-accent/60 rounded-full px-2 py-0.5 transition-all whitespace-nowrap"
                      >
                        {s.ref} →
                      </Link>
                    ) : (
                      <span className="text-[12px] text-transparent select-none px-2 py-0.5 hidden sm:block">–</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
