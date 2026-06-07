import type { Metadata } from 'next'
import BriefingDashboard from '@/components/briefing/BriefingDashboard'

export const metadata: Metadata = {
  title: 'Morning Briefing',
  description: 'A personalized daily briefing — weather, news, new music, and an AI summary.',
}

export default function BriefingPage() {
  return <BriefingDashboard />
}
