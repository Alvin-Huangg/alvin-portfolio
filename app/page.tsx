// Home uses the root layout's full branded title/description (best for the
// landing tab + SEO), so no per-page metadata override here.

export default function AboutPage() {
  const facts = [
    { key: 'based in',     val: 'Phoenix, AZ' },
    { key: 'current role', val: 'Operations Associate II, Amazon' },
    { key: 'building',     val: 'AKRO Cafe, OC/LA pop-up 2026' },
    { key: 'also runs',    val: 'Nori Japan, Tucson' },
    { key: 'education',    val: 'BS Business Admin, CSU Fullerton' },
    { key: 'tools',        val: 'Python, SQL, Power BI, Excel' },
    { key: 'open to',      val: 'full-time ops strategy roles' },
    { key: 'outside work', val: 'photography, weight lifting, fashion, markets' },
  ]

  return (
    <div className="animate-fade-up">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-6">about me</h1>

      {/* Hero */}
      <div className="mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-900 max-w-[560px] xl:max-w-[680px] 2xl:max-w-[780px]">
        <p className="text-[13px] text-neutral-400 dark:text-neutral-600 mb-3 tracking-wide">
          Operations Associate II · Amazon · Phoenix, AZ
        </p>
        <h2 className="text-[26px] xl:text-[28px] font-medium text-neutral-900 dark:text-neutral-100 leading-[1.3]">
          I lead operations, build automation, and run two businesses on the side — all hands-on.
        </h2>
      </div>

      <div className="space-y-4 mb-8 max-w-[540px] xl:max-w-[660px] 2xl:max-w-[760px] 3xl:max-w-[860px]">
        <p className="text-[17px] text-neutral-500 dark:text-neutral-400 leading-[1.8]">
          I lead operations at <strong className="font-medium text-neutral-900 dark:text-neutral-100">Amazon</strong>, managing outbound and inbound workflows, driving process improvements, and building automation tools that actually move the needle.
        </p>

        {/* Key stats */}
        <div className="flex items-center gap-8 py-3">
          <div>
            <div className="text-[38px] font-medium text-neutral-900 dark:text-neutral-100 leading-none tracking-tight">99%</div>
            <div className="text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mt-1.5">ML accuracy</div>
          </div>
          <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-800" />
          <div>
            <div className="text-[38px] font-medium text-neutral-900 dark:text-neutral-100 leading-none tracking-tight">200%</div>
            <div className="text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mt-1.5">cycle time improvement</div>
          </div>
        </div>

        <p className="text-[17px] text-neutral-500 dark:text-neutral-400 leading-[1.8] pl-4 border-l-[2px] border-accent/50">
          what sets me apart is that I go deep on the data myself. I build in Python, model in SQL, and visualize in Power BI. I don't hand specs to engineers and wait — I ship the work.
        </p>
        <p className="text-[17px] text-neutral-500 dark:text-neutral-400 leading-[1.8]">
          alongside that, I run <strong className="font-medium text-neutral-900 dark:text-neutral-100">Nori Japan</strong> in Tucson and I'm currently building <strong className="font-medium text-neutral-900 dark:text-neutral-100">AKRO Cafe</strong>, a specialty coffee pop-up launching in OC/LA in 2026 with a permanent location planned for 2028.
        </p>
        <p className="text-[17px] text-neutral-500 dark:text-neutral-400 leading-[1.8]">
          I'm looking for roles where I can build at scale, not just maintain what's already there.
        </p>

      </div>

      <div className="max-w-[540px] xl:max-w-[660px] 2xl:max-w-[760px] 3xl:max-w-[860px]">
        {facts.map((f, i) => (
          <div
            key={f.key}
            style={{ animationDelay: `${i * 50 + 300}ms` }}
            className={`animate-stagger flex justify-between items-baseline py-1.5 border-b border-neutral-100 dark:border-neutral-900 text-[15px] gap-4 hover:bg-accent/5 rounded-sm transition-colors ${
              i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''
            }`}
          >
            <span className="text-neutral-400 dark:text-neutral-600 flex-shrink-0">{f.key}</span>
            <span className="text-neutral-500 dark:text-neutral-400 text-right">{f.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
