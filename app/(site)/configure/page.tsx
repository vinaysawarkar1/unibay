import Link from 'next/link'
import { Cpu, Laptop, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const cards = [
  {
    title: 'Laptop configurator',
    description: 'Start from an ultraportable, creator, or gaming chassis and upgrade internals.',
    href: '/configure/laptop',
    icon: Laptop,
  },
  {
    title: 'Desktop configurator',
    description: 'Pick a tower, workstation, or compact case and spec CPU, GPU, cooling, and PSU.',
    href: '/configure/desktop',
    icon: Cpu,
  },
  {
    title: 'Quick build',
    description: 'Let UNIBAY suggest a balanced UK-priced rig based on popular presets.',
    href: '/configure/quick',
    icon: Sparkles,
  },
]

export default function ConfigureHubPage() {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28">
      <h1 className="text-4xl font-bold mb-4">Configure your UNIBAY</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mb-12">
        Choose a path below. Every price is shown in GBP for the UK market, and you can send any
        configuration straight to your basket.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div
            key={c.href}
            className="rounded-2xl border border-border bg-card p-6 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <c.icon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
            <p className="text-sm text-muted-foreground flex-1 mb-6">{c.description}</p>
            <Button asChild className="glow-cyan">
              <Link href={c.href}>Start</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
