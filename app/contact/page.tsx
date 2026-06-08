import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  const links = [
    { key: 'email', val: 'alvinhhuangg@gmail.com', href: 'mailto:alvinhhuangg@gmail.com' },
    { key: 'phone', val: '(626) 531-5647', href: 'tel:+16265315647' },
    { key: 'linkedin', val: 'linkedin.com/in/alvinhuangxi', href: 'https://www.linkedin.com/in/alvinhuangxi/' },
    { key: 'location', val: 'Phoenix, AZ', href: null },
    { key: 'resume', val: 'download PDF →', href: '/resume.pdf' },
  ]

  return (
    <div className="animate-fade-up">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-7">get in touch</h1>
      <p className="text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9] max-w-[480px] xl:max-w-[600px] 2xl:max-w-[720px] mb-7">
        open to full-time roles in operations strategy, supply chain management, and related areas. always happy to have a conversation.
      </p>
      <div className="max-w-[480px] xl:max-w-[600px] 2xl:max-w-[720px]">
        {links.map((l, i) => (
          <div key={l.key} className={`flex justify-between py-2.5 border-b border-neutral-100 dark:border-neutral-900 text-[15px] gap-4 hover:bg-accent/5 rounded-sm transition-colors ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}>
            <span className="text-neutral-400 dark:text-neutral-600 flex-shrink-0">{l.key}</span>
            {l.href ? (
              <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener" className="text-neutral-500 dark:text-neutral-400 hover:text-accent transition-colors text-right">
                {l.val}
              </a>
            ) : (
              <span className="text-neutral-500 dark:text-neutral-400 text-right">{l.val}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
