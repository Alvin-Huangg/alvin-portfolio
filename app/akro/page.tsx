import Image from 'next/image'

const tags = ['entrepreneurship','specialty coffee','supply chain','brand strategy','pop-up operations','community','co-working','OC / LA']

const roadmap = [
  { phase: 'Phase 1: Market Analysis + Brand Identity', status: 'complete', done: true, active: false },
  { phase: 'Phase 2: Supply Chain + Sourcing', status: 'in progress', done: false, active: true },
  { phase: 'Phase 3: Pop-up Launch, OC/LA', status: '2026', done: false, active: false },
  { phase: 'Phase 4: Pricing + Operations Model', status: 'pending', done: false, active: false },
  { phase: 'Phase 5: Financial Model + Investor Deck', status: 'pending', done: false, active: false },
  { phase: 'Phase 6: Physical Store Launch', status: '2028', done: false, active: false },
]

const done = [
  { key: 'market research', val: 'Full 13-section analysis covering TAM/SAM/SOM, site scoring, competitive mapping, 3-year P&L' },
  { key: 'brand identity', val: 'Logo, tagline, visual direction, and concept shoots completed' },
  { key: 'equipment', val: "Grinder, espresso machine, and brew station spec'd and sourced" },
  { key: 'pop-up model', val: 'Markets, events, hosted gatherings, and brand collabs in OC/LA area' },
  { key: 'supply chain', val: 'Vendor evaluation and bean sourcing model in progress' },
]

export default function AkroPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-7">current project</h1>

      {/* Hero card */}
      <div className="rounded-xl overflow-hidden max-w-[520px] xl:max-w-[680px] 2xl:max-w-[780px] mb-8 border border-white/5">
        <div className="bg-[#2b2f27] px-8 pt-8 pb-7 relative min-h-[190px] overflow-hidden">

          {/* Sheep silhouettes — dark cutouts via blend mode */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <Image src="/akro/sheep.png" alt="" width={440} height={234}
              className="absolute"
              style={{
                top: '-8%', left: '22%',
                width: '52%', height: 'auto',
                filter: 'invert(1) saturate(0)',
                mixBlendMode: 'darken',
                opacity: 0.75,
              }}
            />
            <Image src="/akro/sheep.png" alt="" width={440} height={234}
              className="absolute"
              style={{
                top: '28%', right: '-8%',
                width: '44%', height: 'auto',
                filter: 'invert(1) saturate(0)',
                mixBlendMode: 'darken',
                opacity: 0.65,
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-block bg-neutral-900 border border-white/10 rounded-lg px-3 py-2.5 mb-5">
              <Image
                src="/akro/wordmark.png"
                alt="AKRO — the cornerstone for community"
                width={1650} height={1156}
                className="w-24 xl:w-28 h-auto"
                style={{ filter: 'invert(1) brightness(0.88)' }}
              />
            </div>

            <p className="text-[14px] text-white/65 tracking-wide mb-4">the cornerstone for community</p>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-[#e8c97a] border border-[#e8c97a]/30 rounded-full px-3 py-1 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8c97a] animate-pulse-dot" />
                actively building
              </div>
              <a
                href="/menu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#e8c97a] bg-[#e8c97a]/10 border border-[#e8c97a]/40 rounded-full px-3 py-1 uppercase tracking-wider hover:bg-[#e8c97a]/20 hover:border-[#e8c97a]/60 transition-colors"
              >
                pop-up menu
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-[#1e211c]">
          {[['OC / LA','pop-up market'],['2026','pop-up launch'],['2028','physical store']].map(([val,label]) => (
            <div key={label} className="px-4 py-3">
              <p className="font-mono text-[18px] text-accent">{val}</p>
              <p className="text-[12px] text-white/50 tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[500px] xl:max-w-[660px] 2xl:max-w-[760px] space-y-3 mb-8 text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9]">
        <p>AKRO is a <strong className="font-medium text-neutral-900 dark:text-neutral-100">specialty coffee and co-working concept</strong> launching as a pop-up across OC and LA before growing into a permanent location in 2028. Markets, events, hosted community gatherings, and brand collabs. Building a real audience before signing a lease.</p>
        <p>The name and the brand are rooted in <strong className="font-medium text-neutral-900 dark:text-neutral-100">community</strong>. "The cornerstone for community" isn't just a tagline. It's the operating philosophy.</p>
        <p>This project pulls together everything I know how to do: supply chain, pricing strategy, operations design, financial modelling. The difference is the feedback loop is now real customers, not a spreadsheet.</p>
      </div>

      {/* Photo gallery */}
      <div className="max-w-[520px] xl:max-w-[680px] 2xl:max-w-[780px] mb-10">
        <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-3">brand shoot</p>
        {/* Landscape full width */}
        <div className="rounded-lg overflow-hidden mb-2">
          <Image
            src="/akro/coffee-gear.jpg"
            alt="AKRO coffee equipment"
            width={5328}
            height={4000}
            style={{ width: '100%', height: 'auto' }}
            quality={85}
            className="hover:opacity-95 transition-opacity duration-200"
          />
        </div>
        {/* Two portraits side by side */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/akro/shoot-table.jpg"
              alt="AKRO concept shoot"
              width={4000}
              height={5328}
              style={{ width: '100%', height: 'auto' }}
              quality={85}
              className="hover:opacity-95 transition-opacity duration-200"
            />
          </div>
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/akro/shoot-crew.jpg"
              alt="AKRO crew"
              width={4000}
              height={5328}
              style={{ width: '100%', height: 'auto' }}
              quality={85}
              className="hover:opacity-95 transition-opacity duration-200"
            />
          </div>
        </div>
      </div>

      <hr className="border-neutral-100 dark:border-neutral-900 max-w-[500px] xl:max-w-[660px] 2xl:max-w-[760px] mb-6" />

      <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-3">what's been done</p>
      <div className="max-w-[500px] xl:max-w-[660px] 2xl:max-w-[760px] mb-8">
        {done.map((d, i) => (
          <div key={d.key} className={`flex gap-4 py-2.5 border-b border-neutral-100 dark:border-neutral-900 text-[15px] hover:bg-accent/5 rounded-sm transition-colors ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}>
            <span className="text-neutral-400 dark:text-neutral-600 min-w-[110px] flex-shrink-0">{d.key}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{d.val}</span>
          </div>
        ))}
      </div>

      <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-3">roadmap</p>
      <div className="max-w-[500px] xl:max-w-[660px] 2xl:max-w-[760px] mb-8">
        {roadmap.map((r, i) => (
          <div key={r.phase} className={`flex items-center gap-2.5 py-2 border-b border-neutral-100 dark:border-neutral-900 text-[15px] ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${r.done ? 'bg-accent' : r.active ? 'bg-[#c8a84b]' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
            <span className="text-neutral-500 dark:text-neutral-400 flex-1">{r.phase}</span>
            <span className={`text-[12px] tracking-wider ${r.done ? 'text-accent font-medium' : r.active ? 'text-[#c8a84b]' : 'text-neutral-400 dark:text-neutral-600'}`}>{r.status}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 max-w-[500px] xl:max-w-[660px] 2xl:max-w-[760px]">
        {tags.map(t => (
          <span key={t} className="text-[13px] px-2.5 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-accent/10 hover:border-accent/40 hover:text-accent transition-all cursor-default">{t}</span>
        ))}
      </div>
    </div>
  )
}
