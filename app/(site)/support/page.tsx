import Link from 'next/link'
import { supportTopicList } from '@/lib/marketing-content'

const labels: Record<string, string> = {
  contact: 'Contact us',
  faq: 'FAQs',
  warranty: 'Warranty',
  returns: 'Returns & exchanges',
  technical: 'Technical support',
}

export default function SupportHubPage() {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">Support centre</h1>
      <p className="text-muted-foreground mb-10">
        Choose a topic below. For urgent hardware faults, call 0333 555 0190 with your UNIBAY
        order reference ready.
      </p>
      <ul className="grid sm:grid-cols-2 gap-3">
        {supportTopicList.map((topic) => (
          <li key={topic}>
            <Link
              href={`/support/${topic}`}
              className="block rounded-xl border border-border bg-card px-4 py-4 hover:border-primary/50 transition-colors"
            >
              {labels[topic] ?? topic}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
